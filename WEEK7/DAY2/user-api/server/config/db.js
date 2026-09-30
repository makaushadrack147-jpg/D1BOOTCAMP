const { Pool } = require("pg");

const pool = process.env.DATABASE_URL
	? new Pool({ connectionString: process.env.DATABASE_URL })
	: new Pool({
		host: process.env.PGHOST || "localhost",
		port: Number(process.env.PGPORT) || 5432,
		database: process.env.PGDATABASE || "postgres",
		user: process.env.PGUSER || "postgres",
		password: process.env.PGPASSWORD || "",
	});

async function initialize() {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email TEXT UNIQUE,
			username TEXT NOT NULL UNIQUE,
			first_name TEXT,
			last_name TEXT
		)
	`);
	await pool.query(`
		CREATE TABLE IF NOT EXISTS hashpwd (
			id SERIAL PRIMARY KEY,
			username TEXT NOT NULL UNIQUE REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE,
			password TEXT NOT NULL
		)
	`);
}

module.exports = { pool, initialize };