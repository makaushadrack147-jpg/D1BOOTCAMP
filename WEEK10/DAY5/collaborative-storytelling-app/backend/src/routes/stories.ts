import { Router } from "express"
import { asyncHandler } from "../helpers/asyncHandler.js"
import { authenticate } from "../middleware/authenticate.js"
import { canEditStory, createStory, deleteStory, getStory, isStoryAuthor, listStories, updateStory } from "../models/stories.js"
import { createComment, listComments } from "../models/comments.js"

const router = Router()
router.use(authenticate)

router.get("/", asyncHandler(async (req, res) => {
  const ownOnly = req.query.own === "true"
  res.json(await listStories(req.userId!, ownOnly))
}))

router.post("/", asyncHandler(async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : ""
  const content = typeof req.body.content === "string" ? req.body.content.trim() : ""
  if (!title || title.length > 160 || !content || content.length > 50000) {
    res.status(400).json({ message: "A title (up to 160 characters) and story content are required." })
    return
  }
  res.status(201).json(await createStory(title, content, req.userId!))
}))

router.get("/:id", asyncHandler(async (req, res) => {
  const story = await getStory(Number(req.params.id))
  if (!story) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  res.json(story)
}))

router.patch("/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const title = typeof req.body.title === "string" ? req.body.title.trim() : ""
  const content = typeof req.body.content === "string" ? req.body.content.trim() : ""
  if (!Number.isSafeInteger(id) || id < 1 || !title || title.length > 160 || !content || content.length > 50000) {
    res.status(400).json({ message: "Check the story title and content, then try again." })
    return
  }
  const story = await getStory(id)
  if (!story) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  if (!(await canEditStory(id, req.userId!))) {
    res.status(403).json({ message: "Only the author and collaborators can edit this story." })
    return
  }
  res.json(await updateStory(id, title, content))
}))

router.delete("/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: "That story ID is invalid." })
    return
  }
  if (!(await getStory(id))) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  if (!(await isStoryAuthor(id, req.userId!))) {
    res.status(403).json({ message: "Only the author can delete this story." })
    return
  }
  await deleteStory(id)
  res.status(204).end()
}))

router.get("/:id/comments", asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const story = await getStory(id)
  if (!story) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  res.json(await listComments(id))
}))

router.post("/:id/comments", asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const content = typeof req.body.content === "string" ? req.body.content.trim() : ""
  if (!Number.isSafeInteger(id) || id < 1 || !content || content.length > 2000) {
    res.status(400).json({ message: "A comment between 1 and 2,000 characters is required." })
    return
  }
  if (!(await getStory(id))) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  res.status(201).json(await createComment(id, req.userId!, content))
}))

export default router
