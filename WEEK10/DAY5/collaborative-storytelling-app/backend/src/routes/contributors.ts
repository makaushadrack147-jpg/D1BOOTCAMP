import { Router } from "express"
import { asyncHandler } from "../helpers/asyncHandler.js"
import { authenticate } from "../middleware/authenticate.js"
import { addContributor, contributorStory, getContributors, removeContributor } from "../models/contributors.js"
import { getStory, isStoryAuthor } from "../models/stories.js"

const router = Router()
router.use(authenticate)

router.post("/", asyncHandler(async (req, res) => {
  const storyId = Number(req.body.story_id)
  const userId = Number(req.body.user_id)
  if (!Number.isSafeInteger(storyId) || storyId < 1 || !Number.isSafeInteger(userId) || userId < 1) {
    res.status(400).json({ message: "A valid story and user are required." })
    return
  }
  if (!(await isStoryAuthor(storyId, req.userId!))) {
    res.status(403).json({ message: "Only the story author can invite collaborators." })
    return
  }
  if (!(await getStory(storyId))) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  const contributorId = await addContributor(storyId, userId)
  if (contributorId === undefined) {
    res.status(409).json({ message: "That person is already a collaborator." })
    return
  }
  res.status(201).json({ id: contributorId, storyId, userId })
}))

router.get("/:story_id", asyncHandler(async (req, res) => {
  const storyId = Number(req.params.story_id)
  if (!Number.isSafeInteger(storyId) || storyId < 1 || !(await getStory(storyId))) {
    res.status(404).json({ message: "That story could not be found." })
    return
  }
  res.json(await getContributors(storyId))
}))

router.delete("/:id", asyncHandler(async (req, res) => {
  const contributorId = Number(req.params.id)
  const storyId = await contributorStory(contributorId)
  if (!storyId) {
    res.status(404).json({ message: "That collaborator could not be found." })
    return
  }
  if (!(await isStoryAuthor(storyId, req.userId!))) {
    res.status(403).json({ message: "Only the story author can remove collaborators." })
    return
  }
  await removeContributor(contributorId)
  res.status(204).end()
}))

export default router
