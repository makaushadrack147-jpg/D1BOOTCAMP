import type { ErrorRequestHandler, RequestHandler } from "express"

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "That page could not be found." })
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("Request failed", error)
  if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
    res.status(409).json({ message: "That email address is already registered." })
    return
  }
  res.status(500).json({ message: "Something went wrong. Please try again." })
}
