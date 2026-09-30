const { pool } = require("../config/db");

const publicFields = "id, email, username, first_name, last_name";

async function create(user, passwordHash) {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const result = await client.query(
			`INSERT INTO users (email, username, first_name, last_name)
			 VALUES ($1, $2, $3, $4)
			 RETURNING ${publicFields}`,
			[user.email ?? null, user.username, user.first_name ?? null, user.last_name ?? null],
		);
		await client.query(
			"INSERT INTO hashpwd (username, password) VALUES ($1, $2)",
			[user.username, passwordHash],
		);
		await client.query("COMMIT");
		return result.rows[0];
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
}

async function getPasswordHash(username) {
	const result = await pool.query("SELECT password FROM hashpwd WHERE username = $1", [username]);
	return result.rows[0]?.password;
}

async function getAll() {
	const result = await pool.query(`SELECT ${publicFields} FROM users ORDER BY id`);
	return result.rows;
}

async function getById(id) {
	const result = await pool.query(`SELECT ${publicFields} FROM users WHERE id = $1`, [id]);
	return result.rows[0];
}

async function update(id, fields) {
	const columns = { email: "email", username: "username", first_name: "first_name", last_name: "last_name" };
	const values = Object.entries(fields);
	const assignments = values.map(([key], index) => `${columns[key]} = $${index + 1}`);
	const parameters = values.map(([, value]) => value);
	parameters.push(id);

	const result = await pool.query(
		`UPDATE users SET ${assignments.join(", ")} WHERE id = $${parameters.length} RETURNING ${publicFields}`,
		parameters,
	);
	return result.rows[0];
}

module.exports = { create, getPasswordHash, getAll, getById, update };