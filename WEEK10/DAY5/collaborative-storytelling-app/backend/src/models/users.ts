import bcrypt from "bcryptjs"
import type { User } from "../../../types/src/index.js"
import { pool } from "../db/pool.js"

export const publicUser = (row: { id: number; username: string; email: string }): User => ({
  id: row.id,
  username: row.username,
  email: row.email,
})

export async function createUser(username: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12)
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, passwordHash],
  )
  return publicUser(result.rows[0])
}

export async function findUserByEmail(email: string) {
  const result = await pool.query(
    "SELECT id, username, email, password_hash FROM users WHERE email = $1",
    [email],
  )
  return result.rows[0] as
    | { id: number; username: string; email: string; password_hash: string }
    | undefined
}

export async function findUserById(id: number) {
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [id],
  )
  return result.rows[0] ? publicUser(result.rows[0]) : null
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export async function searchUsers(query: string, currentUserId: number) {
  const result = await pool.query(
    `SELECT id, username, email
     FROM users
     WHERE id <> $1 AND (email ILIKE $2 OR username ILIKE $2)
     ORDER BY username
     LIMIT 8`,
    [currentUserId, `%${query}%`],
  )
  return result.rows.map(publicUser)
}
