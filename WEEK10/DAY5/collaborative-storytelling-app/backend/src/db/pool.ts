import pg from "pg"
import { config } from "../config.js"

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.production ? { rejectUnauthorized: false } : undefined,
})

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error)
})
