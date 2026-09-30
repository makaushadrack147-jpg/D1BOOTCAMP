const db = require("../config/db");

async function initialize() {
	await db.query(`
		CREATE TABLE IF NOT EXISTS posts (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`);
}

async function getAll() {
	const result = await db.query("SELECT id, title, content, created_at AS \"createdAt\" FROM posts ORDER BY id");
	return result.rows;
}

async function getById(id) {
	const result = await db.query(
		"SELECT id, title, content, created_at AS \"createdAt\" FROM posts WHERE id = $1",
		[id],
	);
	return result.rows[0];
}

async function create({ title, content }) {
	const result = await db.query(
		"INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at AS \"createdAt\"",
		[title, content],
	);
	return result.rows[0];
}

async function update(id, { title, content }) {
	const result = await db.query(
		`UPDATE posts
		 SET title = COALESCE($2, title), content = COALESCE($3, content)
		 WHERE id = $1
		 RETURNING id, title, content, created_at AS "createdAt"`,
		[id, title ?? null, content ?? null],
	);
	return result.rows[0];
}

async function remove(id) {
	const result = await db.query("DELETE FROM posts WHERE id = $1 RETURNING id", [id]);
	return result.rowCount > 0;
}

module.exports = { initialize, getAll, getById, create, update, remove };