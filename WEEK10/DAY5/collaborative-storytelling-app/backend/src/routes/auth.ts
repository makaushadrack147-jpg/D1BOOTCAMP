import { Router, type Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config.js"
import { asyncHandler } from "../helpers/asyncHandler.js"
import { authenticate } from "../middleware/authenticate.js"
import { findUserByEmail, findUserById, createUser, verifyPassword } from "../models/users.js"
import type { AuthResponse } from "../../../types/src/index.js"

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function issueTokens(userId: number) {
  return {
    accessToken: jwt.sign({ userId }, config.jwtSecret, { expiresIn: "15m" }),
    refreshToken: jwt.sign({ userId }, config.refreshSecret, { expiresIn: "7d" }),
  }
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: config.production,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

router.post("/register", asyncHandler(async (req, res) => {
  const username = typeof req.body.username === "string" ? req.body.username.trim() : ""
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
  const password = typeof req.body.password === "string" ? req.body.password : ""
  if (username.length < 2 || username.length > 50 || !emailPattern.test(email) || password.length < 8 || password.length > 72) {
    res.status(400).json({ message: "Enter a username (2–50 characters), a valid email, and a password of at least 8 characters." })
    return
  }
  if (await findUserByEmail(email)) {
    res.status(409).json({ message: "An account with that email already exists." })
    return
  }
  const user = await createUser(username, email, password)
  const tokens = issueTokens(user.id)
  setRefreshCookie(res, tokens.refreshToken)
  const response: AuthResponse = { accessToken: tokens.accessToken, user }
  res.status(201).json(response)
}))

router.post("/login", asyncHandler(async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
  const password = typeof req.body.password === "string" ? req.body.password : ""
  if (!emailPattern.test(email) || !password) {
    res.status(400).json({ message: "Enter a valid email and password." })
    return
  }
  const row = await findUserByEmail(email)
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    res.status(401).json({ message: "Email or password is incorrect." })
    return
  }
  const tokens = issueTokens(row.id)
  setRefreshCookie(res, tokens.refreshToken)
  res.json({
    accessToken: tokens.accessToken,
    user: { id: row.id, username: row.username, email: row.email },
  } satisfies AuthResponse)
}))

router.post("/refresh", asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken as string | undefined
  if (!token) {
    res.status(401).json({ message: "Your session has expired. Please sign in again." })
    return
  }
  let userId: number
  try {
    const payload = jwt.verify(token, config.refreshSecret)
    if (typeof payload === "string" || typeof payload.userId !== "number") throw new Error("Invalid token")
    userId = payload.userId
  } catch {
    res.clearCookie("refreshToken", { path: "/api/auth", sameSite: "lax", secure: config.production })
    res.status(401).json({ message: "Your session has expired. Please sign in again." })
    return
  }
  const user = await findUserById(userId)
  if (!user) {
    res.clearCookie("refreshToken", { path: "/api/auth", sameSite: "lax", secure: config.production })
    res.status(401).json({ message: "Your session has expired. Please sign in again." })
    return
  }
  const tokens = issueTokens(user.id)
  setRefreshCookie(res, tokens.refreshToken)
  res.json({ accessToken: tokens.accessToken, user } satisfies AuthResponse)
}))

router.post("/logout", authenticate, (_req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth", sameSite: "lax", secure: config.production })
  res.status(204).end()
})

export default router
