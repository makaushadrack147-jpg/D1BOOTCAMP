import 'dotenv/config'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { initializeDatabase, pool } from './database.js'
import {
  authenticate,
  clearSessionCookie,
  createSession,
  hashSessionToken,
  hashPassword,
  readSessionToken,
  requireAdmin,
  verifyPassword,
} from './security.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const allowedOrigins = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean),
])
function isAllowedOrigin(origin) {
  if (allowedOrigins.has(origin)) return true
  if (process.env.NODE_ENV === 'production') return false

  try {
    const url = new URL(origin)
    const port = Number(url.port)
    return url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname) &&
      port >= 5173 &&
      port <= 5199
  } catch {
    return false
  }
}
const publicAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Please wait and try again.' },
})
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many password reset attempts. Please wait and try again.' },
})
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many payment attempts. Please wait and try again.' },
})
const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many assistant messages. Please wait and try again.' },
})
const categories = new Set([
  'Home & repairs',
  'Design & creative',
  'Digital & tech',
  'Beauty & wellness',
  'Food & events',
  'Learning & skills',
])
const publicUserFields = 'id, name, email, role, bio, skills, contact_phone, available, profile_photo_updated_at, created_at'
const publicServiceFields = 'id, title, category, description, provider_name, provider_initials, provider_color, location, price, rating, review_count, badge, icon, slug, created_at, provider_user_id, status, listing_photo_updated_at'
const supportedImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        ...(process.env.NODE_ENV === 'production' ? { upgradeInsecureRequests: [] } : {}),
      },
    },
  }),
)
app.use((request, response, next) => {
  const origin = request.get('Origin')
  const originAllowed = origin ? isAllowedOrigin(origin) : false
  if (origin) response.vary('Origin')
  if (originAllowed) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Credentials', 'true')
  }
  if (origin && !originAllowed && !['GET', 'HEAD'].includes(request.method)) {
    return response.status(403).json({ error: 'This origin is not allowed to access the API.' })
  }
  if (request.method === 'OPTIONS') {
    if (!originAllowed) {
      return response.status(403).end()
    }
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', request.get('Access-Control-Request-Headers') || 'Content-Type')
    return response.status(204).end()
  }
  return next()
})
app.use(express.json({ limit: '20kb' }))

function requireRole(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user?.role)) {
      return response.status(403).json({ error: 'Your account does not have permission to do that.' })
    }
    return next()
  }
}

function requireNumericParam(name) {
  return (request, response, next) => {
    if (!/^\d+$/.test(request.params[name])) {
      return response.status(400).json({ error: 'The requested ID is invalid.' })
    }
    return next()
  }
}

function requireCommonServiceKey(request, response, next) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(request.params.serviceKey)) {
    return response.status(400).json({ error: 'The common service key is invalid.' })
  }
  return next()
}

function adminPagination(query) {
  const requestedPage = Number.parseInt(query.page, 10)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100000) : 1
  const pageSize = 30
  return { page, pageSize, offset: (page - 1) * pageSize }
}

function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function notifyEmail(to, subject, text, context) {
  if (!to) return
  const { RESEND_API_KEY: apiKey, EMAIL_FROM: from } = process.env
  if (!apiKey || !from) {
    console.warn(`Email notification skipped (${context}): set RESEND_API_KEY and EMAIL_FROM.`)
    return
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      console.error(`Email notification failed (${context}): Resend returned ${response.status}.`)
    }
  } catch (error) {
    console.error(`Email notification failed (${context}):`, error)
  }
}

function requiredText(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength
}

function serviceInput(input) {
  const body = input && typeof input === 'object' && !Array.isArray(input) ? input : {}
  if (
    !requiredText(body.title, 120) ||
    !categories.has(body.category) ||
    !requiredText(body.description, 500) ||
    !requiredText(body.location, 100) ||
    !Number.isSafeInteger(Number(body.price)) ||
    Number(body.price) <= 0 ||
    Number(body.price) > 10000000
  ) {
    return null
  }
  return {
    title: body.title.trim(),
    category: body.category,
    description: body.description.trim(),
    location: body.location.trim(),
    price: Number(body.price),
  }
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    skills: user.skills,
    contact_phone: user.contact_phone,
    available: user.available,
    profile_photo_updated_at: user.profile_photo_updated_at,
  }
}

function matchesImageSignature(buffer, mimeType) {
  if (!Buffer.isBuffer(buffer)) return false
  if (mimeType === 'image/jpeg') return buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  if (mimeType === 'image/png') return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  return mimeType === 'image/webp' &&
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
}

function normalizeMpesaPhone(value) {
  if (typeof value !== 'string') return null
  const digits = value.replace(/[\s()+-]/g, '')
  const normalized = digits.startsWith('0') ? `254${digits.slice(1)}` : digits
  return /^254[71]\d{8}$/.test(normalized) ? normalized : null
}

function mpesaSettings() {
  const environment = process.env.MPESA_ENV || 'sandbox'
  if (!['sandbox', 'production'].includes(environment)) {
    throw new Error('MPESA_ENV must be sandbox or production.')
  }
  const {
    MPESA_CONSUMER_KEY: consumerKey,
    MPESA_CONSUMER_SECRET: consumerSecret,
    MPESA_SHORTCODE: shortcode,
    MPESA_PASSKEY: passkey,
  } = process.env
  const externalHostname = process.env.RENDER_EXTERNAL_HOSTNAME
  const publicUrl =
    process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || (externalHostname ? `https://${externalHostname}` : '')
  if (!consumerKey || !consumerSecret || !shortcode || !passkey || !publicUrl) {
    throw new Error('M-Pesa is not configured. Set its Daraja credentials and public callback URL.')
  }
  const callbackBaseUrl = new URL(publicUrl)
  if (callbackBaseUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
    throw new Error('PUBLIC_URL must use HTTPS in production.')
  }
  const baseUrl = environment === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
  const transactionType = process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline'
  if (!['CustomerPayBillOnline', 'CustomerBuyGoodsOnline'].includes(transactionType)) {
    throw new Error('MPESA_TRANSACTION_TYPE must be CustomerPayBillOnline or CustomerBuyGoodsOnline.')
  }
  return {
    baseUrl,
    consumerKey,
    consumerSecret,
    shortcode,
    passkey,
    transactionType,
    callbackBaseUrl: callbackBaseUrl.origin,
  }
}

function mpesaTimestamp() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .format(new Date())
    .replace(/[-: ]/g, '')
}

async function startMpesaCheckout(settings, { amount, phone, callbackUrl, requestId }) {
  const authorization = Buffer.from(`${settings.consumerKey}:${settings.consumerSecret}`).toString('base64')
  const tokenResponse = await fetch(`${settings.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${authorization}` },
    signal: AbortSignal.timeout(15000),
  })
  const tokenData = await tokenResponse.json()
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error('Safaricom could not authorize the payment request.')
  }

  const timestamp = mpesaTimestamp()
  const password = Buffer.from(`${settings.shortcode}${settings.passkey}${timestamp}`).toString('base64')
  let pushResponse
  try {
    pushResponse = await fetch(`${settings.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: settings.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: settings.transactionType,
        Amount: amount,
        PartyA: phone,
        PartyB: settings.shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: `HH-${requestId}`,
        TransactionDesc: 'Hustle Hub service payment',
      }),
      signal: AbortSignal.timeout(20000),
    })
  } catch {
    const error = new Error(
      'Safaricom did not confirm the payment request. Check your phone and refresh the payment status before trying again.',
    )
    error.paymentStateUnknown = true
    throw error
  }
  let pushData
  try {
    pushData = await pushResponse.json()
  } catch {
    const error = new Error(
      'Safaricom returned an unclear payment response. Refresh the payment status before trying again.',
    )
    error.paymentStateUnknown = true
    throw error
  }
  if (pushResponse.status >= 500 || (pushResponse.ok && pushData.ResponseCode !== '0')) {
    const error = new Error(
      'Safaricom returned an unclear payment response. Refresh the payment status before trying again.',
    )
    error.paymentStateUnknown = true
    throw error
  }
  if (pushData.ResponseCode === '0' && (!pushData.CheckoutRequestID || !pushData.MerchantRequestID)) {
    const error = new Error(
      'Safaricom returned an unclear payment response. Refresh the payment status before trying again.',
    )
    error.paymentStateUnknown = true
    throw error
  }
  if (!pushResponse.ok || pushData.ResponseCode !== '0' || !pushData.CheckoutRequestID || !pushData.MerchantRequestID) {
    throw new Error(pushData.errorMessage || pushData.ResponseDescription || 'Safaricom could not start the payment.')
  }
  return pushData
}

function callbackMetadata(callback) {
  const items = callback?.Body?.stkCallback?.CallbackMetadata?.Item
  return Array.isArray(items) ? Object.fromEntries(items.map(({ Name, Value }) => [Name, Value])) : {}
}

app.get('/api/health', async (request, response) => {
  await pool.query('SELECT 1')
  response.json({ status: 'ok' })
})

app.get('/api/assistant/availability', (request, response) => {
  response.json({ configured: Boolean(process.env.OPENAI_API_KEY) })
})

app.post('/api/assistant/chat', assistantLimiter, async (request, response) => {
  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : ''
  if (!message || message.length > 1200) {
    return response.status(400).json({ error: 'Write a message up to 1,200 characters.' })
  }
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return response.status(503).json({ error: 'The AI assistant is not configured yet.' })
  }

  const history = Array.isArray(request.body?.history)
    ? request.body.history.slice(-8).filter((item) =>
      item && ['user', 'assistant'].includes(item.role) &&
      typeof item.content === 'string' && item.content.trim() && item.content.length <= 1200,
    ).map(({ role, content }) => ({ role, content: content.trim() }))
    : []
  const instructions = [
    'You are Hustle Hub Kenya’s friendly website assistant.',
    'Hustle Hub helps customers find local services and helps freelancers list services and manage requests.',
    'Customers browse services, submit a request, and track its status. Freelancers review requests and can accept, decline, or complete them.',
    'M-Pesa Express checkout is available only after a freelancer accepts a request and only when Daraja is configured. Hustle Hub does not hold a wallet balance, split payments, or automatically pay freelancers.',
    'Do not claim a feature or listing is available unless it is described here. For account support, call 0115820492.',
    'Keep answers concise. Do not ask for passwords, M-Pesa PINs, API keys, or other secrets.',
  ].join(' ')

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: instructions }, ...history, { role: 'user', content: message }],
        max_tokens: 350,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(20000),
    })
    const result = await aiResponse.json().catch(() => ({}))
    if (!aiResponse.ok) {
      console.error(`OpenAI assistant request failed with status ${aiResponse.status}.`)
      return response.status(502).json({ error: 'The assistant could not reply right now. Please try again.' })
    }
    const answer = result.choices?.[0]?.message?.content
    if (typeof answer !== 'string' || !answer.trim()) {
      return response.status(502).json({ error: 'The assistant returned an empty reply. Please try again.' })
    }
    response.json({ answer: answer.trim() })
  } catch (error) {
    console.error('OpenAI assistant request failed:', error.name || 'request error')
    response.status(502).json({ error: 'The assistant could not reply right now. Please try again.' })
  }
})

app.get('/api/payments/availability', (request, response) => {
  const externalHostname = process.env.RENDER_EXTERNAL_HOSTNAME
  const configured = Boolean(
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY &&
    (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || externalHostname),
  )
  response.json({
    configured,
    environment: process.env.MPESA_ENV === 'production' ? 'production' : 'sandbox',
  })
})

app.post('/api/auth/register', publicAuthLimiter, async (request, response) => {
  const { name, email, password, role } = request.body || {}
  if (
    !requiredText(name, 80) ||
    !validEmail(email) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 200 ||
    !['customer', 'freelancer'].includes(role)
  ) {
    return response.status(400).json({
      error: 'Enter a valid name, email, password (at least 8 characters), and account type.',
    })
  }

  const passwordHash = await hashPassword(password)
  let result
  try {
    result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING ${publicUserFields}`,
      [name.trim(), email.trim().toLowerCase(), passwordHash, role],
    )
  } catch (error) {
    if (error.code === '23505')
      return response.status(409).json({ error: 'An account with that email already exists.' })
    throw error
  }
  await createSession(pool, response, result.rows[0].id)
  response.status(201).json({ user: safeUser(result.rows[0]) })
})

app.post('/api/auth/login', publicAuthLimiter, async (request, response) => {
  const { email, password } = request.body || {}
  if (!validEmail(email) || typeof password !== 'string') {
    return response.status(400).json({ error: 'Enter a valid email address and password.' })
  }
  const result = await pool.query(
    `SELECT id, name, email, password_hash, role, status, bio, skills, contact_phone, available, profile_photo_updated_at
     FROM users WHERE email = $1`,
    [email.trim().toLowerCase()],
  )
  const account = result.rows[0]
  if (!account || !(await verifyPassword(password, account.password_hash))) {
    return response.status(401).json({ error: 'Email or password is incorrect.' })
  }
  if (account.status !== 'active') {
    return response.status(403).json({
      error: 'This account is not active. Contact Hustle Hub support.',
    })
  }
  await createSession(pool, response, account.id)
  response.json({ user: safeUser(account) })
})

app.post('/api/auth/forgot-password', passwordResetLimiter, async (request, response) => {
  const { email } = request.body || {}
  if (!validEmail(email)) {
    return response.status(400).json({ error: 'Enter a valid email address.' })
  }

  const { RESEND_API_KEY: apiKey, EMAIL_FROM: from } = process.env
  const frontendUrl = process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:5173')
  if (!apiKey || !from || !frontendUrl) {
    console.error('Password reset email is not configured.')
    return response.status(503).json({
      error: 'Password reset is temporarily unavailable. Please contact Hustle Hub support.',
    })
  }

  const accountResult = await pool.query(
    'SELECT id, email FROM users WHERE email = $1',
    [email.trim().toLowerCase()],
  )
  if (!accountResult.rowCount) {
    return response.status(202).json({
      message: 'If an account exists for that email, a password reset link will be sent shortly.',
    })
  }

  const account = accountResult.rows[0]
  const token = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const resetUrl = new URL('/', frontendUrl)
  resetUrl.hash = new URLSearchParams({ resetToken: token }).toString()

  await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1 OR expires_at <= NOW()', [account.id])
  await pool.query(
    `INSERT INTO password_reset_tokens (token_hash, user_id, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
    [tokenHash, account.id],
  )

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [account.email],
        subject: 'Reset your Hustle Hub password',
        text: `We received a request to reset your Hustle Hub password. Use this link within one hour:\n\n${resetUrl}\n\nIf you did not request a reset, you can ignore this email.`,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!emailResponse.ok) {
      await pool.query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash])
      console.error(`Password reset email failed: Resend returned ${emailResponse.status}.`)
      return response.status(502).json({
        error: 'We could not send a password reset email right now. Please try again later.',
      })
    }
  } catch (error) {
    await pool.query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash])
    console.error('Password reset email failed:', error.name || 'request error')
    return response.status(502).json({
      error: 'We could not send a password reset email right now. Please try again later.',
    })
  }

  response.status(202).json({
    message: 'If an account exists for that email, a password reset link will be sent shortly.',
  })
})

app.post('/api/auth/reset-password', passwordResetLimiter, async (request, response) => {
  const { token, password } = request.body || {}
  if (
    typeof token !== 'string' ||
    !/^[a-f0-9]{64}$/i.test(token) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 200
  ) {
    return response.status(400).json({
      error: 'Use a valid reset link and a password between 8 and 200 characters.',
    })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const tokenResult = await client.query(
      `SELECT user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND expires_at > NOW()
       FOR UPDATE`,
      [tokenHash],
    )
    if (!tokenResult.rowCount) {
      await client.query('ROLLBACK')
      return response.status(400).json({
        error: 'This password reset link is invalid or has expired. Request a new one.',
      })
    }

    const userId = tokenResult.rows[0].user_id
    const passwordHash = await hashPassword(password)
    await client.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId],
    )
    await client.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId])
    await client.query('DELETE FROM sessions WHERE user_id = $1', [userId])
    await client.query('COMMIT')
    clearSessionCookie(response)
    response.json({ message: 'Your password has been reset. Sign in with your new password.' })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
})

app.post('/api/auth/logout', authenticate(pool), async (request, response) => {
  const token = readSessionToken(request)
  if (token) await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashSessionToken(token)])
  clearSessionCookie(response)
  response.json({ status: 'signed out' })
})

app.get('/api/auth/me', authenticate(pool), (request, response) => {
  response.json({ user: safeUser(request.user) })
})

app.patch('/api/profile', authenticate(pool), requireRole('freelancer'), async (request, response) => {
  const { bio, skills, contact_phone, available } = request.body || {}
  if (
    typeof bio !== 'string' ||
    bio.length > 500 ||
    !Array.isArray(skills) ||
    skills.length > 20 ||
    skills.some((skill) => !requiredText(skill, 40)) ||
    typeof contact_phone !== 'string' ||
    contact_phone.length > 30 ||
    typeof available !== 'boolean'
  ) {
    return response.status(400).json({ error: 'Check your profile details and try again.' })
  }
  const result = await pool.query(
    `UPDATE users
     SET bio = $1, skills = $2, contact_phone = $3, available = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING ${publicUserFields}`,
    [bio.trim(), skills.map((skill) => skill.trim()), contact_phone.trim(), available, request.user.id],
  )
  response.json({ user: safeUser(result.rows[0]) })
})

app.put(
  '/api/profile/photo',
  authenticate(pool),
  express.raw({ type: [...supportedImageMimeTypes], limit: '1mb' }),
  async (request, response) => {
    const mimeType = request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase()
    if (!supportedImageMimeTypes.has(mimeType) || !matchesImageSignature(request.body, mimeType)) {
      return response.status(400).json({ error: 'Choose a valid JPEG, PNG, or WebP image.' })
    }

    const result = await pool.query(
      `UPDATE users
       SET profile_photo = $1, profile_photo_mime_type = $2, profile_photo_updated_at = NOW(), updated_at = NOW()
       WHERE id = $3
       RETURNING profile_photo_updated_at`,
      [request.body, mimeType, request.user.id],
    )
    response.json({
      user: safeUser({ ...request.user, profile_photo_updated_at: result.rows[0].profile_photo_updated_at }),
    })
  },
)

app.delete('/api/profile/photo', authenticate(pool), async (request, response) => {
  const result = await pool.query(
    `UPDATE users
     SET profile_photo = NULL, profile_photo_mime_type = NULL, profile_photo_updated_at = NULL, updated_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [request.user.id],
  )
  if (!result.rowCount) return response.status(404).json({ error: 'Your account could not be found.' })
  response.json({ user: safeUser({ ...request.user, profile_photo_updated_at: null }) })
})

app.get('/api/profile/photo', authenticate(pool), async (request, response) => {
  const result = await pool.query(
    'SELECT profile_photo, profile_photo_mime_type FROM users WHERE id = $1',
    [request.user.id],
  )
  const photo = result.rows[0]
  if (!photo?.profile_photo) return response.status(404).json({ error: 'No profile photo has been uploaded.' })
  response.set({
    'Cache-Control': 'private, no-store',
    'Content-Type': photo.profile_photo_mime_type,
    'X-Content-Type-Options': 'nosniff',
  })
  response.send(photo.profile_photo)
})

app.get('/api/profile', authenticate(pool), (request, response) => {
  response.json({ user: safeUser(request.user) })
})

app.get('/api/services', async (request, response) => {
  const values = []
  const filters = ["s.status = 'active'", "(s.provider_user_id IS NULL OR u.status = 'active')"]
  const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : ''
  const category = typeof request.query.category === 'string' ? request.query.category : ''
  if (search) {
    values.push(`%${search}%`)
    filters.push(
      `(s.title ILIKE $${values.length} OR s.category ILIKE $${values.length} OR s.description ILIKE $${values.length} OR s.provider_name ILIKE $${values.length} OR s.location ILIKE $${values.length})`,
    )
  }
  if (category && categories.has(category)) {
    values.push(category)
    filters.push(`s.category = $${values.length}`)
  }
  const result = await pool.query(
    `SELECT s.id, s.title, s.category, s.description, s.provider_name, s.provider_initials,
       s.provider_color, s.location, s.price, s.rating, s.review_count, s.badge, s.icon,
       s.slug, s.created_at, s.provider_user_id, s.status, s.listing_photo_updated_at,
       u.bio AS provider_bio, u.skills AS provider_skills,
       u.contact_phone AS provider_contact_phone, u.available AS provider_available
     FROM services s
     LEFT JOIN users u ON u.id = s.provider_user_id
     WHERE ${filters.join(' AND ')}
     ORDER BY s.created_at DESC
     LIMIT 200`,
    values,
  )
  response.json(result.rows)
})

app.get('/api/common-service-photos', async (request, response) => {
  const result = await pool.query(
    'SELECT service_key, updated_at FROM common_service_photos ORDER BY service_key',
  )
  response.set('Cache-Control', 'no-store')
  response.json(result.rows)
})

app.get(
  '/api/common-service-photos/:serviceKey/photo',
  requireCommonServiceKey,
  async (request, response) => {
    const result = await pool.query(
      'SELECT photo, mime_type FROM common_service_photos WHERE service_key = $1',
      [request.params.serviceKey],
    )
    const photo = result.rows[0]
    if (!photo) return response.status(404).json({ error: 'No custom photo has been uploaded for this service.' })
    response.set({
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': photo.mime_type,
      'X-Content-Type-Options': 'nosniff',
    })
    response.send(photo.photo)
  },
)

app.put(
  '/api/common-service-photos/:serviceKey/photo',
  authenticate(pool),
  requireAdmin,
  requireCommonServiceKey,
  express.raw({ type: [...supportedImageMimeTypes], limit: '1mb' }),
  async (request, response) => {
    const mimeType = request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase()
    if (!supportedImageMimeTypes.has(mimeType) || !matchesImageSignature(request.body, mimeType)) {
      return response.status(400).json({ error: 'Choose a valid JPEG, PNG, or WebP image.' })
    }

    const result = await pool.query(
      `INSERT INTO common_service_photos (service_key, photo, mime_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (service_key) DO UPDATE
       SET photo = EXCLUDED.photo, mime_type = EXCLUDED.mime_type, updated_at = NOW()
       RETURNING service_key, updated_at`,
      [request.params.serviceKey, request.body, mimeType],
    )
    response.json(result.rows[0])
  },
)

app.delete(
  '/api/common-service-photos/:serviceKey/photo',
  authenticate(pool),
  requireAdmin,
  requireCommonServiceKey,
  async (request, response) => {
    const result = await pool.query(
      'DELETE FROM common_service_photos WHERE service_key = $1',
      [request.params.serviceKey],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'No custom photo is set for this service.' })
    response.status(204).end()
  },
)

app.get('/api/services/:id/photo', requireNumericParam('id'), async (request, response) => {
  const result = await pool.query(
    `SELECT s.listing_photo, s.listing_photo_mime_type
     FROM services s
     LEFT JOIN users u ON u.id = s.provider_user_id
     WHERE s.id = $1 AND s.category = 'Digital & tech' AND s.status = 'active'
       AND (s.provider_user_id IS NULL OR u.status = 'active')`,
    [request.params.id],
  )
  const photo = result.rows[0]
  if (!photo?.listing_photo) return response.status(404).json({ error: 'No listing photo has been uploaded.' })
  response.set({
    'Cache-Control': 'public, max-age=3600',
    'Content-Type': photo.listing_photo_mime_type,
    'X-Content-Type-Options': 'nosniff',
  })
  response.send(photo.listing_photo)
})

app.get('/api/freelancers/:id', requireNumericParam('id'), async (request, response) => {
  const result = await pool.query(
    `SELECT id, name, bio, skills, contact_phone, available
     FROM users WHERE id = $1 AND role = 'freelancer' AND status = 'active'`,
    [request.params.id],
  )
  if (!result.rowCount) return response.status(404).json({ error: 'That freelancer profile was not found.' })
  response.json(result.rows[0])
})

app.post('/api/services', authenticate(pool), requireRole('freelancer'), async (request, response) => {
  const service = serviceInput(request.body)
  if (!service)
    return response.status(400).json({
      error: 'Check the title, category, description, location, and price.',
    })

  const result = await pool.query(
    `INSERT INTO services
      (title, category, description, provider_name, provider_initials, location, price, provider_user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${publicServiceFields}`,
    [
      service.title,
      service.category,
      service.description,
      request.user.name,
      request.user.name
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      service.location,
      service.price,
      request.user.id,
    ],
  )
  response.status(201).json(result.rows[0])
})

app.patch(
  '/api/services/:id',
  authenticate(pool),
  requireRole('freelancer', 'admin'),
  requireNumericParam('id'),
  async (request, response) => {
    const service = serviceInput(request.body)
    if (!service)
      return response.status(400).json({
        error: 'Check the title, category, description, location, and price.',
      })
    const result = await pool.query(
      `UPDATE services
     SET title = $1, category = $2, description = $3, location = $4, price = $5
     WHERE id = $6 AND status = 'active'
       AND ($7 = 'admin' OR provider_user_id = $8)
     RETURNING ${publicServiceFields}`,
      [
        service.title,
        service.category,
        service.description,
        service.location,
        service.price,
        request.params.id,
        request.user.role,
        request.user.id,
      ],
    )
    if (!result.rowCount)
      return response.status(404).json({ error: 'That listing was not found or you cannot edit it.' })
    response.json(result.rows[0])
  },
)

app.put(
  '/api/services/:id/photo',
  authenticate(pool),
  requireRole('freelancer', 'admin'),
  requireNumericParam('id'),
  express.raw({ type: [...supportedImageMimeTypes], limit: '1mb' }),
  async (request, response) => {
    const mimeType = request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase()
    if (!supportedImageMimeTypes.has(mimeType) || !matchesImageSignature(request.body, mimeType)) {
      return response.status(400).json({ error: 'Choose a valid JPEG, PNG, or WebP image.' })
    }

    const result = await pool.query(
      `UPDATE services
       SET listing_photo = $1, listing_photo_mime_type = $2, listing_photo_updated_at = NOW()
       WHERE id = $3 AND category = 'Digital & tech' AND status = 'active'
         AND ($4 = 'admin' OR provider_user_id = $5)
       RETURNING id, listing_photo_updated_at`,
      [request.body, mimeType, request.params.id, request.user.role, request.user.id],
    )
    if (!result.rowCount) {
      return response.status(404).json({ error: 'That Digital & tech listing was not found or you cannot edit it.' })
    }
    response.json(result.rows[0])
  },
)

app.delete(
  '/api/services/:id',
  authenticate(pool),
  requireRole('freelancer', 'admin'),
  requireNumericParam('id'),
  async (request, response) => {
    const result = await pool.query(
      `UPDATE services SET status = 'removed'
     WHERE id = $1 AND status = 'active'
       AND ($2 = 'admin' OR provider_user_id = $3)
     RETURNING id`,
      [request.params.id, request.user.role, request.user.id],
    )
    if (!result.rowCount)
      return response.status(404).json({ error: 'That listing was not found or you cannot remove it.' })
    response.status(204).end()
  },
)

app.post('/api/requests', authenticate(pool), requireRole('customer'), async (request, response) => {
  const { service_id: serviceId, location, preferred_date: preferredDate, details } = request.body || {}
  if (
    !/^\d+$/.test(String(serviceId)) ||
    !requiredText(location, 100) ||
    !requiredText(details, 500) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate || '')
  ) {
    return response.status(400).json({
      error: 'Check the service, location, preferred date, and request details.',
    })
  }
  const parsedDate = new Date(`${preferredDate}T00:00:00.000Z`)
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== preferredDate ||
    preferredDate < new Date().toISOString().slice(0, 10)
  ) {
    return response.status(400).json({ error: 'Choose a valid date that is not in the past.' })
  }
  const result = await pool.query(
    `INSERT INTO service_requests (service_id, customer_id, provider_id, location, preferred_date, details, agreed_amount)
     SELECT s.id, $2, s.provider_user_id, $3, $4, $5, s.price
     FROM services s
     WHERE s.id = $1 AND s.status = 'active'
       AND s.provider_user_id <> $2
       AND EXISTS (SELECT 1 FROM users p WHERE p.id = s.provider_user_id AND p.status = 'active')
     RETURNING id, service_id, customer_id, provider_id, location, preferred_date, details, agreed_amount AS service_price, status, created_at`,
    [serviceId, request.user.id, location.trim(), preferredDate, details.trim()],
  )
  if (!result.rowCount) return response.status(404).json({ error: 'That service is no longer available.' })
  const notificationData = await pool.query(
    `SELECT r.id, r.preferred_date, r.location, r.details, s.title AS service_title,
       customer.name AS customer_name, customer.email AS customer_email,
       provider.name AS provider_name, provider.email AS provider_email
     FROM service_requests r
     JOIN services s ON s.id = r.service_id
     JOIN users customer ON customer.id = r.customer_id
     LEFT JOIN users provider ON provider.id = r.provider_id
     WHERE r.id = $1`,
    [result.rows[0].id],
  )
  const notification = notificationData.rows[0]
  const requestSummary = `Service: ${notification.service_title}\nRequested by: ${notification.customer_name}\nLocation: ${notification.location}\nPreferred date: ${notification.preferred_date}\nDetails: ${notification.details}`
  void notifyEmail(
    notification.provider_email,
    `New service request: ${notification.service_title}`,
    `Hello ${notification.provider_name},\n\nYou have a new service request.\n\n${requestSummary}\n\nSign in to Hustle Hub to review it.`,
    'new request to freelancer',
  )
  void notifyEmail(
    notification.customer_email,
    `Request received: ${notification.service_title}`,
    `Hello ${notification.customer_name},\n\nYour request has been sent to ${notification.provider_name}.\n\n${requestSummary}\n\nSign in to Hustle Hub to track its status.`,
    'request confirmation to customer',
  )
  void notifyEmail(
    process.env.ADMIN_EMAIL,
    `New service request: ${notification.service_title}`,
    `${requestSummary}\n\nRequest ID: ${notification.id}`,
    'new request to admin',
  )
  response.status(201).json(result.rows[0])
})

app.get('/api/requests', authenticate(pool), async (request, response) => {
  const ownerColumn =
    request.user.role === 'admin'
      ? 'TRUE'
      : request.user.role === 'freelancer'
        ? 'r.provider_id = $1'
        : 'r.customer_id = $1'
  const values = request.user.role === 'admin' ? [] : [request.user.id]
  const result = await pool.query(
    `SELECT r.*, s.title AS service_title, r.agreed_amount AS service_price,
       customer.name AS customer_name, customer.email AS customer_email,
       provider.name AS provider_name, p.id AS payment_id,
       p.status AS payment_status, p.amount AS payment_amount,
       p.receipt_number AS payment_receipt, p.created_at AS payment_created_at
     FROM service_requests r
     JOIN services s ON s.id = r.service_id
     JOIN users customer ON customer.id = r.customer_id
     LEFT JOIN users provider ON provider.id = r.provider_id
     LEFT JOIN LATERAL (
       SELECT id, status, amount, receipt_number, created_at
       FROM payments WHERE request_id = r.id ORDER BY created_at DESC LIMIT 1
     ) p ON TRUE
     WHERE ${ownerColumn}
     ORDER BY r.created_at DESC
     LIMIT 200`,
    values,
  )
  response.json(result.rows)
})

app.get('/api/wallet', authenticate(pool), requireRole('customer'), async (request, response) => {
  const [transactionsResult, totalResult] = await Promise.all([
    pool.query(
      `SELECT p.id AS payment_id, p.request_id, p.status AS payment_status,
         p.amount AS payment_amount, p.receipt_number AS payment_receipt,
         p.created_at AS payment_created_at, s.title AS service_title,
         provider.name AS provider_name
       FROM payments p
       JOIN service_requests r ON r.id = p.request_id
       JOIN services s ON s.id = r.service_id
       LEFT JOIN users provider ON provider.id = r.provider_id
       WHERE r.customer_id = $1
       ORDER BY p.created_at DESC
       LIMIT 200`,
      [request.user.id],
    ),
    pool.query(
      `SELECT COALESCE(SUM(p.amount), 0) AS total_paid
       FROM payments p
       JOIN service_requests r ON r.id = p.request_id
       WHERE r.customer_id = $1 AND p.status = 'paid'`,
      [request.user.id],
    ),
  ])
  response.json({
    available_balance: 0,
    total_paid: totalResult.rows[0].total_paid,
    transactions: transactionsResult.rows,
  })
})

app.patch(
  '/api/requests/:id',
  authenticate(pool),
  requireRole('freelancer', 'admin'),
  requireNumericParam('id'),
  async (request, response) => {
    const { status } = request.body || {}
    if (!['Accepted', 'Declined', 'Completed'].includes(status)) {
      return response.status(400).json({ error: 'Choose a valid request status.' })
    }
    const result = await pool.query(
      `UPDATE service_requests SET status = $1
     WHERE id = $2
       AND ($3 = 'admin' OR provider_id = $4)
       AND (($1 IN ('Accepted', 'Declined') AND status = 'Submitted')
         OR ($1 = 'Completed' AND status = 'Accepted'))
     RETURNING *`,
      [status, request.params.id, request.user.role, request.user.id],
    )
    if (!result.rowCount)
      return response.status(404).json({ error: 'That request was not found or you cannot update it.' })
    const notificationData = await pool.query(
      `SELECT r.id, r.status, s.title AS service_title,
       customer.name AS customer_name, customer.email AS customer_email,
       provider.name AS provider_name, provider.email AS provider_email
     FROM service_requests r
     JOIN services s ON s.id = r.service_id
     JOIN users customer ON customer.id = r.customer_id
     LEFT JOIN users provider ON provider.id = r.provider_id
     WHERE r.id = $1`,
      [result.rows[0].id],
    )
    const notification = notificationData.rows[0]
    const statusMessage = `The request for "${notification.service_title}" is now ${notification.status.toLowerCase()}.`
    void notifyEmail(
      notification.customer_email,
      `Request ${notification.status.toLowerCase()}: ${notification.service_title}`,
      `Hello ${notification.customer_name},\n\n${statusMessage}\n\nSign in to Hustle Hub to view your request.`,
      'request status to customer',
    )
    void notifyEmail(
      notification.provider_email,
      `Request ${notification.status.toLowerCase()}: ${notification.service_title}`,
      `Hello ${notification.provider_name},\n\n${statusMessage}\n\nSign in to Hustle Hub to view your request.`,
      'request status to freelancer',
    )
    response.json(result.rows[0])
  },
)

app.post(
  '/api/requests/:id/payment',
  authenticate(pool),
  requireRole('customer'),
  paymentLimiter,
  requireNumericParam('id'),
  async (request, response) => {
    const phone = normalizeMpesaPhone(request.body?.phone)
    if (!phone)
      return response.status(400).json({
        error: 'Enter a valid Kenyan Safaricom phone number, such as 0712345678.',
      })

    const requestResult = await pool.query(
      `SELECT r.id, r.status, r.agreed_amount AS price
     FROM service_requests r
     JOIN services s ON s.id = r.service_id
     WHERE r.id = $1 AND r.customer_id = $2`,
      [request.params.id, request.user.id],
    )
    const serviceRequest = requestResult.rows[0]
    if (!serviceRequest) return response.status(404).json({ error: 'That request was not found.' })
    if (serviceRequest.status !== 'Accepted') {
      return response.status(409).json({
        error: 'Payment is available after the freelancer accepts your request.',
      })
    }
    const amount = Number(serviceRequest.price)
    if (!Number.isSafeInteger(amount) || amount < 1) {
      return response.status(400).json({
        error: 'This listing price cannot be processed as a whole KSh amount.',
      })
    }

    let settings
    try {
      settings = mpesaSettings()
    } catch (error) {
      return response.status(503).json({ error: error.message })
    }

    const existing = await pool.query(
      `SELECT id, status FROM payments WHERE request_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [serviceRequest.id],
    )
    if (existing.rows[0]?.status === 'paid') {
      return response.status(409).json({ error: 'This service request has already been paid.' })
    }
    if (existing.rows[0]?.status === 'pending') {
      return response.status(409).json({
        error: 'A payment request is already in progress. Check your phone or wait for its status to update.',
      })
    }

    const paymentId = randomUUID()
    const callbackToken = randomBytes(32).toString('hex')
    const callbackTokenHash = createHash('sha256').update(callbackToken).digest('hex')
    try {
      await pool.query(
        `INSERT INTO payments (id, request_id, callback_token_hash, phone, amount)
       VALUES ($1, $2, $3, $4, $5)`,
        [paymentId, serviceRequest.id, callbackTokenHash, phone, amount],
      )
    } catch (error) {
      if (error.code === '23505') {
        return response.status(409).json({
          error: 'A payment for this request is already in progress or has been completed.',
        })
      }
      throw error
    }

    try {
      const checkout = await startMpesaCheckout(settings, {
        amount,
        phone,
        callbackUrl: `${settings.callbackBaseUrl}/api/mpesa/callback/${callbackToken}`,
        requestId: serviceRequest.id,
      })
      const updated = await pool.query(
        `UPDATE payments
       SET checkout_request_id = $1, merchant_request_id = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, status, amount, phone`,
        [checkout.CheckoutRequestID, checkout.MerchantRequestID, paymentId],
      )
      response.status(202).json({
        payment: updated.rows[0],
        customer_message: checkout.CustomerMessage || 'Check your phone and enter your M-Pesa PIN to approve.',
      })
    } catch (error) {
      if (error.paymentStateUnknown) {
        return response.status(202).json({
          payment: { id: paymentId, status: 'pending', amount, phone },
          customer_message: error.message,
        })
      }
      await pool.query(
        `UPDATE payments SET status = 'failed', result_description = $1, updated_at = NOW() WHERE id = $2`,
        [error.message.slice(0, 255), paymentId],
      )
      response.status(502).json({ error: error.message })
    }
  },
)

app.get(
  '/api/requests/:id/payment',
  authenticate(pool),
  requireRole('customer'),
  requireNumericParam('id'),
  async (request, response) => {
    const result = await pool.query(
      `SELECT p.id, p.status, p.amount, p.phone, p.receipt_number, p.result_description
     FROM payments p
     JOIN service_requests r ON r.id = p.request_id
     WHERE p.request_id = $1 AND r.customer_id = $2
     ORDER BY p.created_at DESC LIMIT 1`,
      [request.params.id, request.user.id],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'No payment has been started for this request.' })
    response.json({ payment: result.rows[0] })
  },
)

app.post('/api/mpesa/callback/:callbackToken', async (request, response) => {
  if (!/^[\da-f]{64}$/i.test(request.params.callbackToken)) {
    return response.status(404).json({ ResultCode: 1, ResultDesc: 'Unknown payment.' })
  }
  const callback = request.body?.Body?.stkCallback
  if (!callback?.CheckoutRequestID || callback.ResultCode == null || !Number.isInteger(Number(callback.ResultCode))) {
    return response.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid payment callback.' })
  }
  const resultCode = Number(callback.ResultCode)
  const metadata = callbackMetadata(request.body)
  const receipt = typeof metadata.MpesaReceiptNumber === 'string' ? metadata.MpesaReceiptNumber : null
  const amount = Number(metadata.Amount)
  const phone = String(metadata.PhoneNumber || '')
  const description = String(callback.ResultDesc || 'Payment result received.').slice(0, 255)
  const result = await pool.query(
    `UPDATE payments
     SET checkout_request_id = COALESCE(checkout_request_id, $2),
         merchant_request_id = COALESCE(merchant_request_id, $8),
         status = CASE
           WHEN $3 = 0 AND $5 IS NOT NULL AND $6 = amount AND $7 = phone THEN 'paid'
           ELSE 'failed'
         END,
         receipt_number = CASE WHEN $3 = 0 AND $5 IS NOT NULL AND $6 = amount AND $7 = phone THEN $5 ELSE NULL END,
         result_description = $4,
         updated_at = NOW()
     WHERE callback_token_hash = $1 AND (checkout_request_id IS NULL OR checkout_request_id = $2) AND status = 'pending'
     RETURNING id`,
    [
      createHash('sha256').update(request.params.callbackToken).digest('hex'),
      callback.CheckoutRequestID,
      resultCode,
      description,
      receipt,
      amount,
      phone,
      callback.MerchantRequestID || null,
    ],
  )
  if (!result.rowCount) console.warn('Ignored unmatched or duplicate M-Pesa callback.')
  response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
})

app.get('/api/favorites', authenticate(pool), requireRole('customer'), async (request, response) => {
  const result = await pool.query(`SELECT service_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`, [
    request.user.id,
  ])
  response.json(result.rows.map((row) => String(row.service_id)))
})

app.put(
  '/api/favorites/:serviceId',
  authenticate(pool),
  requireRole('customer'),
  requireNumericParam('serviceId'),
  async (request, response) => {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, service_id)
     SELECT $1, s.id FROM services s
     LEFT JOIN users u ON u.id = s.provider_user_id
     WHERE s.id = $2 AND s.status = 'active'
       AND (s.provider_user_id IS NULL OR u.status = 'active')
     ON CONFLICT DO NOTHING
     RETURNING service_id`,
      [request.user.id, request.params.serviceId],
    )
    if (!result.rowCount) {
      const exists = await pool.query(
        `SELECT 1 FROM services s LEFT JOIN users u ON u.id = s.provider_user_id
       WHERE s.id = $1 AND s.status = 'active' AND (s.provider_user_id IS NULL OR u.status = 'active')`,
        [request.params.serviceId],
      )
      if (!exists.rowCount) return response.status(404).json({ error: 'That service is no longer available.' })
    }
    response.status(204).end()
  },
)

app.delete(
  '/api/favorites/:serviceId',
  authenticate(pool),
  requireRole('customer'),
  requireNumericParam('serviceId'),
  async (request, response) => {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND service_id = $2', [
      request.user.id,
      request.params.serviceId,
    ])
    response.status(204).end()
  },
)

app.get('/api/admin/summary', authenticate(pool), requireAdmin, async (request, response) => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users)::int AS users,
      (SELECT COUNT(*) FROM users WHERE role = 'freelancer' AND status = 'active')::int AS freelancers,
      (SELECT COUNT(*) FROM users WHERE status = 'suspended')::int AS suspended_users,
      (SELECT COUNT(*) FROM services WHERE status = 'active')::int AS active_services,
      (SELECT COUNT(*) FROM services WHERE status = 'removed')::int AS removed_services,
      (SELECT COUNT(*) FROM service_requests)::int AS requests,
      (SELECT COUNT(*) FROM service_requests WHERE status = 'Submitted')::int AS submitted_requests,
      (SELECT COUNT(*) FROM service_requests WHERE status = 'Accepted')::int AS accepted_requests,
      (SELECT COUNT(*) FROM service_requests WHERE status = 'Completed')::int AS completed_requests,
      (SELECT COUNT(*) FROM payments)::int AS payments,
      (SELECT COUNT(*) FROM payments WHERE status = 'paid')::int AS paid_payments,
      (SELECT COUNT(*) FROM payments WHERE status = 'pending')::int AS pending_payments,
      (SELECT COUNT(*) FROM payments WHERE status = 'failed')::int AS failed_payments,
      COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'paid'), 0) AS paid_amount
  `)
  response.json(result.rows[0])
})

app.get('/api/admin/users', authenticate(pool), requireAdmin, async (request, response) => {
  const { page, pageSize, offset } = adminPagination(request.query)
  const values = []
  const filters = []
  const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : ''
  const roleFilter = typeof request.query.role === 'string' ? request.query.role : 'all'
  const statusFilter = typeof request.query.status === 'string' ? request.query.status : 'all'
  if (search) {
    values.push(`%${search}%`)
    filters.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`)
  }
  if (roleFilter !== 'all') {
    if (!['customer', 'freelancer', 'admin'].includes(roleFilter)) return response.status(400).json({ error: 'Choose a valid account type.' })
    values.push(roleFilter)
    filters.push(`role = $${values.length}`)
  }
  if (statusFilter !== 'all') {
    if (!['active', 'pending', 'suspended'].includes(statusFilter)) return response.status(400).json({ error: 'Choose a valid account status.' })
    values.push(statusFilter)
    filters.push(`status = $${values.length}`)
  }
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const count = await pool.query(`SELECT COUNT(*)::int AS total FROM users ${whereClause}`, values)
  const result = await pool.query(
    `SELECT ${publicUserFields}, status FROM users ${whereClause}
     ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, pageSize, offset],
  )
  response.json({ items: result.rows, total: count.rows[0].total, page, pageSize })
})

app.get('/api/admin/services', authenticate(pool), requireAdmin, async (request, response) => {
  const { page, pageSize, offset } = adminPagination(request.query)
  const values = []
  const filters = []
  const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : ''
  const statusFilter = typeof request.query.status === 'string' ? request.query.status : 'all'
  if (search) {
    values.push(`%${search}%`)
    filters.push(`(s.title ILIKE $${values.length} OR s.category ILIKE $${values.length} OR s.provider_name ILIKE $${values.length} OR s.location ILIKE $${values.length})`)
  }
  if (statusFilter !== 'all') {
    if (!['active', 'removed'].includes(statusFilter)) return response.status(400).json({ error: 'Choose a valid listing status.' })
    values.push(statusFilter)
    filters.push(`s.status = $${values.length}`)
  }
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const count = await pool.query(`SELECT COUNT(*)::int AS total FROM services s ${whereClause}`, values)
  const result = await pool.query(
    `SELECT s.id, s.title, s.category, s.provider_name, s.location, s.price, s.status, s.created_at,
       u.email AS provider_email
     FROM services s
     LEFT JOIN users u ON u.id = s.provider_user_id
     ${whereClause}
     ORDER BY s.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, pageSize, offset],
  )
  response.json({ items: result.rows, total: count.rows[0].total, page, pageSize })
})

app.get('/api/admin/requests', authenticate(pool), requireAdmin, async (request, response) => {
  const { page, pageSize, offset } = adminPagination(request.query)
  const values = []
  const filters = []
  const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : ''
  const statusFilter = typeof request.query.status === 'string' ? request.query.status : 'all'
  if (search) {
    values.push(`%${search}%`)
    filters.push(`(s.title ILIKE $${values.length} OR customer.name ILIKE $${values.length} OR customer.email ILIKE $${values.length} OR provider.name ILIKE $${values.length} OR CAST(r.id AS TEXT) ILIKE $${values.length})`)
  }
  if (statusFilter !== 'all') {
    if (!['Submitted', 'Accepted', 'Declined', 'Completed'].includes(statusFilter)) return response.status(400).json({ error: 'Choose a valid request status.' })
    values.push(statusFilter)
    filters.push(`r.status = $${values.length}`)
  }
  const joins = `FROM service_requests r
    JOIN services s ON s.id = r.service_id
    JOIN users customer ON customer.id = r.customer_id
    LEFT JOIN users provider ON provider.id = r.provider_id`
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const count = await pool.query(`SELECT COUNT(*)::int AS total ${joins} ${whereClause}`, values)
  const result = await pool.query(
    `SELECT r.id, r.status, r.location, r.preferred_date, r.agreed_amount AS service_price, r.created_at,
       s.title AS service_title, customer.name AS customer_name, customer.email AS customer_email,
       provider.name AS provider_name, provider.email AS provider_email
     ${joins}
     ${whereClause}
     ORDER BY r.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, pageSize, offset],
  )
  response.json({ items: result.rows, total: count.rows[0].total, page, pageSize })
})

app.get('/api/admin/payments', authenticate(pool), requireAdmin, async (request, response) => {
  const { page, pageSize, offset } = adminPagination(request.query)
  const values = []
  const filters = []
  const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : ''
  const statusFilter = typeof request.query.status === 'string' ? request.query.status : 'all'
  if (search) {
    values.push(`%${search}%`)
    filters.push(`(s.title ILIKE $${values.length} OR customer.name ILIKE $${values.length} OR customer.email ILIKE $${values.length} OR p.receipt_number ILIKE $${values.length} OR CAST(p.request_id AS TEXT) ILIKE $${values.length})`)
  }
  if (statusFilter !== 'all') {
    if (!['pending', 'paid', 'failed'].includes(statusFilter)) return response.status(400).json({ error: 'Choose a valid payment status.' })
    values.push(statusFilter)
    filters.push(`p.status = $${values.length}`)
  }
  const joins = `FROM payments p
    JOIN service_requests r ON r.id = p.request_id
    JOIN services s ON s.id = r.service_id
    JOIN users customer ON customer.id = r.customer_id`
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const count = await pool.query(`SELECT COUNT(*)::int AS total ${joins} ${whereClause}`, values)
  const result = await pool.query(
    `SELECT p.id, p.request_id, p.amount, p.status, p.receipt_number, p.result_description, p.created_at, p.updated_at,
       s.title AS service_title, customer.name AS customer_name, customer.email AS customer_email
     ${joins}
     ${whereClause}
     ORDER BY p.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, pageSize, offset],
  )
  response.json({ items: result.rows, total: count.rows[0].total, page, pageSize })
})

app.get('/api/admin/trends', authenticate(pool), requireAdmin, async (request, response) => {
  const requestedDays = Number.parseInt(request.query.days, 10)
  const days = Number.isSafeInteger(requestedDays) ? Math.min(Math.max(requestedDays, 7), 90) : 30
  const result = await pool.query(
    `WITH dates AS (
       SELECT generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, '1 day')::date AS day
     ), signups AS (
       SELECT created_at::date AS day, COUNT(*)::int AS total FROM users GROUP BY 1
     ), listings AS (
       SELECT created_at::date AS day, COUNT(*)::int AS total FROM services GROUP BY 1
     ), requests AS (
       SELECT created_at::date AS day, COUNT(*)::int AS total FROM service_requests GROUP BY 1
     ), payments AS (
       SELECT created_at::date AS day, COUNT(*)::int AS total FROM payments GROUP BY 1
     ), paid_payments AS (
       SELECT updated_at::date AS day, SUM(amount) AS paid_amount
       FROM payments WHERE status = 'paid' GROUP BY 1
     )
     SELECT dates.day,
       COALESCE(signups.total, 0)::int AS signups,
       COALESCE(listings.total, 0)::int AS listings,
       COALESCE(requests.total, 0)::int AS requests,
       COALESCE(payments.total, 0)::int AS payments,
       COALESCE(paid_payments.paid_amount, 0) AS paid_amount
     FROM dates
     LEFT JOIN signups USING (day)
     LEFT JOIN listings USING (day)
     LEFT JOIN requests USING (day)
     LEFT JOIN payments USING (day)
     LEFT JOIN paid_payments USING (day)
     ORDER BY dates.day`,
    [days],
  )
  response.json(result.rows)
})

app.patch(
  '/api/admin/services/:id/status',
  authenticate(pool),
  requireAdmin,
  requireNumericParam('id'),
  async (request, response) => {
    if (request.body?.status !== 'active') {
      return response.status(400).json({ error: 'Choose active to restore a removed listing.' })
    }
    const result = await pool.query(
      `UPDATE services SET status = 'active' WHERE id = $1 AND status = 'removed' RETURNING id, status`,
      [request.params.id],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'That listing was not found.' })
    response.json(result.rows[0])
  },
)

app.patch(
  '/api/admin/users/:id',
  authenticate(pool),
  requireAdmin,
  requireNumericParam('id'),
  async (request, response) => {
    const { status } = request.body || {}
    if (!['active', 'suspended'].includes(status)) {
      return response.status(400).json({ error: 'Choose a valid account status.' })
    }
    if (String(request.user.id) === request.params.id && status === 'suspended') {
      return response.status(400).json({ error: 'You cannot suspend your own administrator account.' })
    }
    const result = await pool.query(
      `UPDATE users SET status = $1, updated_at = NOW()
     WHERE id = $2 AND role <> 'admin'
     RETURNING id, name, email, role, status`,
      [status, request.params.id],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'That non-administrator account was not found.' })
    void notifyEmail(
      result.rows[0].email,
      `Your Hustle Hub account was ${status}`,
      `Hello ${result.rows[0].name},\n\nAn administrator changed your account status to ${status}. If you believe this is a mistake, contact Hustle Hub support.`,
      'admin account moderation',
    )
    response.json(result.rows[0])
  },
)

app.delete(
  '/api/admin/services/:id',
  authenticate(pool),
  requireAdmin,
  requireNumericParam('id'),
  async (request, response) => {
    const result = await pool.query(
      `UPDATE services SET status = 'removed' WHERE id = $1 AND status = 'active' RETURNING id`,
      [request.params.id],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'That listing was not found.' })
    const listing = await pool.query(
      `SELECT s.title, u.name, u.email
     FROM services s
     LEFT JOIN users u ON u.id = s.provider_user_id
     WHERE s.id = $1`,
      [request.params.id],
    )
    if (listing.rows[0]?.email) {
      void notifyEmail(
        listing.rows[0].email,
        `Your listing was removed: ${listing.rows[0].title}`,
        `Hello ${listing.rows[0].name},\n\nAn administrator removed your listing "${listing.rows[0].title}" from the Hustle Hub marketplace. Contact Hustle Hub support if you believe this is a mistake.`,
        'admin listing moderation',
      )
    }
    response.status(204).end()
  },
)

app.use((error, request, response, next) => {
  console.error('API request failed:', error)
  if (response.headersSent) return next(error)
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must contain valid JSON.' })
  }
  if (error.type === 'entity.too.large') {
    const isImageUpload =
      request.path === '/api/profile/photo' ||
      /^\/api\/services\/\d+\/photo$/.test(request.path) ||
      /^\/api\/common-service-photos\/[a-z0-9-]+\/photo$/.test(request.path)
    const message = isImageUpload ? 'Uploaded images must be 1 MB or smaller.' : 'The request body is too large.'
    return response.status(413).json({ error: message })
  }
  response.status(500).json({ error: 'The server could not complete that request.' })
})

try {
  await initializeDatabase()
  app.listen(port, () => console.log(`Hustle Hub listening on port ${port}`))
} catch (error) {
  console.error('Could not start Hustle Hub API:', error)
  await pool.end()
  process.exitCode = 1
}
