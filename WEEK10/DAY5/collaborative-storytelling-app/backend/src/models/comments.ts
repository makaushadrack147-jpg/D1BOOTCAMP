import type { Comment } from "../../../types/src/index.js"
import { pool } from "../db/pool.js"

export async function listComments(storyId: number): Promise<Comment[]> {
  const result = await pool.query(
    `SELECT c.id, c.story_id, c.user_id, u.username, c.content, c.created_at
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.story_id = $1 ORDER BY c.created_at`,
    [storyId],
  )
  return result.rows.map((row) => ({
    id: row.id,
    storyId: row.story_id,
    userId: row.user_id,
    username: row.username,
    content: row.content,
    createdAt: row.created_at.toISOString(),
  }))
}

export async function createComment(storyId: number, userId: number, content: string) {
  const result = await pool.query(
    `INSERT INTO comments (story_id, user_id, content)
     VALUES ($1, $2, $3) RETURNING id`,
    [storyId, userId, content],
  )
  const comments = await listComments(storyId)
  return comments.find((comment) => comment.id === result.rows[0].id)
}
