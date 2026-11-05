import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const sessionCookieName = 'hustle_hub_session'
export const sessionDurationSeconds = 60 * 60 * 24 * 7

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const derivedKey = await scrypt(password, salt, 64)
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password, storedHash) {
  const [saltHex, keyHex] = storedHash.split(':')
  if (!/^[a-f0-9]{32}$/i.test(saltHex) || !/^[a-f0-9]{128}$/i.test(keyHex)) return false
  const expectedKey = Buffer.from(keyHex, 'hex')
  const actualKey = await scrypt(password, Buffer.from(saltHex, 'hex'), expectedKey.length)
  return timingSafeEqual(expectedKey, actualKey)
}

export function hashSessionToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

export function readSessionToken(request) {
  const cookie = request.headers.cookie?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`))
  const token = cookie?.slice(sessionCookieName.length + 1)
  return token && /^[a-f0-9]{64}$/i.test(token) ? token : null
}

export function setSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  response.setHeader(
    'Set-Cookie',
    `${sessionCookieName}=${token}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${sessionDurationSeconds}${secure}`,
  )
}

export function clearSessionCookie(response) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  response.setHeader(
    'Set-Cookie',
    `${sessionCookieName}=; Path=/api; HttpOnly; SameSite=Strict; Max-Age=0${secure}`,
  )
}

export function authenticate(pool) {
  return async (request, response, next) => {
    const token = readSessionToken(request)
    if (!token) return response.status(401).json({ error: 'Sign in to continue.' })
    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.role, u.status,
           u.bio, u.skills, u.contact_phone, u.available, u.profile_photo_updated_at
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
        [hashSessionToken(token)],
      )
      if (!result.rowCount || result.rows[0].status === 'suspended') {
        return response.status(401).json({ error: 'Your session is no longer valid. Please sign in again.' })
      }
      request.user = result.rows[0]
      return next()
    } catch (error) {
      return next(error)
    }
  }
}

export function requireAdmin(request, response, next) {
  if (request.user?.role !== 'admin' || request.user?.status !== 'active') {
    return response.status(403).json({ error: 'Administrator access is required.' })
  }
  return next()
}

export async function createSession(pool, response, userId) {
  const token = randomBytes(32).toString('hex')
  await pool.query(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [hashSessionToken(token), userId],
  )
  setSessionCookie(response, token)
}
