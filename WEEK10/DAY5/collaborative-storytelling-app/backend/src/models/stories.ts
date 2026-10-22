import type { Contributor, Story } from "../../../types/src/index.js"
import { pool } from "../db/pool.js"

type StoryRow = {
  id: number
  title: string
  content: string
  author_id: number
  author_name: string
  created_at: Date
  updated_at: Date
  contributors: Contributor[] | null
}

const toStory = (row: StoryRow): Story => ({
  id: row.id,
  title: row.title,
  content: row.content,
  authorId: row.author_id,
  authorName: row.author_name,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
  contributors: row.contributors ?? [],
})

const storySelect = `
  SELECT s.id, s.title, s.content, s.author_id, u.username AS author_name,
         s.created_at, s.updated_at,
         COALESCE(
           json_agg(json_build_object(
             'contributorId', c.id,
             'id', cu.id,
             'username', cu.username,
             'email', cu.email
           ))
             FILTER (WHERE cu.id IS NOT NULL),
           '[]'
         ) AS contributors
  FROM stories s
  JOIN users u ON u.id = s.author_id
  LEFT JOIN contributors c ON c.story_id = s.id
  LEFT JOIN users cu ON cu.id = c.user_id
`

export async function listStories(userId: number, ownOnly: boolean) {
  const result = await pool.query(
    `${storySelect}
     WHERE ($2::boolean = false OR s.author_id = $1 OR EXISTS (
       SELECT 1 FROM contributors own_c
       WHERE own_c.story_id = s.id AND own_c.user_id = $1
     ))
     GROUP BY s.id, u.username
     ORDER BY s.updated_at DESC`,
    [userId, ownOnly],
  )
  return result.rows.map(toStory)
}

export async function getStory(id: number) {
  const result = await pool.query(
    `${storySelect}
     WHERE s.id = $1
     GROUP BY s.id, u.username`,
    [id],
  )
  return result.rows[0] ? toStory(result.rows[0]) : null
}

export async function createStory(title: string, content: string, authorId: number) {
  const result = await pool.query(
    `INSERT INTO stories (title, content, author_id)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [title, content, authorId],
  )
  return getStory(result.rows[0].id)
}

export async function updateStory(id: number, title: string, content: string) {
  await pool.query(
    `UPDATE stories SET title = $2, content = $3, updated_at = NOW()
     WHERE id = $1`,
    [id, title, content],
  )
  return getStory(id)
}

export async function deleteStory(id: number) {
  await pool.query("DELETE FROM stories WHERE id = $1", [id])
}

export async function canEditStory(storyId: number, userId: number) {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1 FROM stories WHERE id = $1 AND author_id = $2
       UNION ALL
       SELECT 1 FROM contributors WHERE story_id = $1 AND user_id = $2
     ) AS allowed`,
    [storyId, userId],
  )
  return result.rows[0].allowed as boolean
}

export async function isStoryAuthor(storyId: number, userId: number) {
  const result = await pool.query(
    "SELECT EXISTS (SELECT 1 FROM stories WHERE id = $1 AND author_id = $2) AS allowed",
    [storyId, userId],
  )
  return result.rows[0].allowed as boolean
}
