import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config.js"

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null

  if (!token) {
    res.status(401).json({ message: "Please sign in to continue." })
    return
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (typeof payload === "string" || typeof payload.userId !== "number") {
      res.status(401).json({ message: "Your session is invalid. Please sign in again." })
      return
    }
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ message: "Your session has expired. Please sign in again." })
  }
}
