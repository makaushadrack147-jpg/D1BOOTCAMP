import { pool } from "../db/pool.js"

export async function addContributor(storyId: number, userId: number) {
  const result = await pool.query(
    `INSERT INTO contributors (story_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (story_id, user_id) DO NOTHING
     RETURNING id`,
    [storyId, userId],
  )
  return result.rows[0]?.id as number | undefined
}

export async function removeContributor(id: number) {
  const result = await pool.query(
    "DELETE FROM contributors WHERE id = $1 RETURNING story_id",
    [id],
  )
  return result.rows[0]?.story_id as number | undefined
}

export async function contributorStory(id: number) {
  const result = await pool.query(
    "SELECT story_id FROM contributors WHERE id = $1",
    [id],
  )
  return result.rows[0]?.story_id as number | undefined
}

export async function getContributors(storyId: number) {
  const result = await pool.query(
    `SELECT c.id AS contributor_id, u.id, u.username, u.email
     FROM contributors c JOIN users u ON u.id = c.user_id
     WHERE c.story_id = $1 ORDER BY u.username`,
    [storyId],
  )
  return result.rows
}
