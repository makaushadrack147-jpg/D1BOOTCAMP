import { Router } from "express"
import { asyncHandler } from "../helpers/asyncHandler.js"
import { authenticate } from "../middleware/authenticate.js"
import { searchUsers } from "../models/users.js"

const router = Router()
router.get("/", authenticate, asyncHandler(async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : ""
  if (query.length < 2) {
    res.json([])
    return
  }
  res.json(await searchUsers(query.slice(0, 80), req.userId!))
}))

export default router
