const db = require("../config/db");

async function initialize() {
	await db.query(`
		CREATE TABLE IF NOT EXISTS books (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			author TEXT NOT NULL,
			published_year INTEGER NOT NULL
		)
	`);
}

const fields = 'id, title, author, published_year AS "publishedYear"';

async function getAll() {
	const result = await db.query(`SELECT ${fields} FROM books ORDER BY id`);
	return result.rows;
}

async function getById(id) {
	const result = await db.query(`SELECT ${fields} FROM books WHERE id = $1`, [id]);
	return result.rows[0];
}

async function create({ title, author, publishedYear }) {
	const result = await db.query(
		`INSERT INTO books (title, author, published_year)
		 VALUES ($1, $2, $3)
		 RETURNING ${fields}`,
		[title, author, publishedYear],
	);
	return result.rows[0];
}

async function update(id, { title, author, publishedYear }) {
	const result = await db.query(
		`UPDATE books
		 SET title = COALESCE($2, title),
		     author = COALESCE($3, author),
		     published_year = COALESCE($4, published_year)
		 WHERE id = $1
		 RETURNING ${fields}`,
		[id, title ?? null, author ?? null, publishedYear ?? null],
	);
	return result.rows[0];
}

async function remove(id) {
	const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING id", [id]);
	return result.rowCount > 0;
}

module.exports = { initialize, getAll, getById, create, update, remove };