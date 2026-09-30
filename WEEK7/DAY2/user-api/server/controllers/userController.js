const bcrypt = require("bcrypt");
const users = require("../models/userModel");

const profileFields = ["email", "username", "first_name", "last_name"];

function validUsername(value) {
	return typeof value === "string" && value.trim().length > 0;
}

function validOptionalProfile(body) {
	return profileFields.every((field) => body[field] === undefined || typeof body[field] === "string");
}

function parseId(value) {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}

async function register(req, res) {
	const { username, password, email, first_name, last_name } = req.body;
	if (!validUsername(username) || typeof password !== "string" || password.length < 8) {
		return res.status(400).json({ error: "A username and password of at least 8 characters are required" });
	}
	if (!validOptionalProfile({ email, first_name, last_name })) {
		return res.status(400).json({ error: "Profile fields must be strings" });
	}

	const passwordHash = await bcrypt.hash(password, 12);
	const user = await users.create(
		{
			username: username.trim(),
			email: email?.trim() || null,
			first_name: first_name?.trim() || null,
			last_name: last_name?.trim() || null,
		},
		passwordHash,
	);
	res.status(201).json(user);
}

async function login(req, res) {
	const { username, password } = req.body;
	if (!validUsername(username) || typeof password !== "string") {
		return res.status(400).json({ error: "A username and password are required" });
	}

	const normalizedUsername = username.trim();
	const passwordHash = await users.getPasswordHash(normalizedUsername);
	if (!passwordHash || !(await bcrypt.compare(password, passwordHash))) {
		return res.status(401).json({ error: "Invalid username or password" });
	}
	res.json({ message: "Login successful" });
}

async function getAll(req, res) {
	res.json(await users.getAll());
}

async function getById(req, res) {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "User id must be a positive integer" });

	const user = await users.getById(id);
	if (!user) return res.status(404).json({ error: "User not found" });
	res.json(user);
}

async function update(req, res) {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "User id must be a positive integer" });

	if (!validOptionalProfile(req.body)) {
		return res.status(400).json({ error: "Profile fields must be strings" });
	}
	const fields = Object.fromEntries(
		profileFields
			.filter((field) => req.body[field] !== undefined)
			.map((field) => [field, req.body[field].trim() || null]),
	);
	if (Object.keys(fields).length === 0 || (fields.username !== undefined && !fields.username)) {
		return res.status(400).json({ error: "Provide at least one valid profile field" });
	}

	const user = await users.update(id, fields);
	if (!user) return res.status(404).json({ error: "User not found" });
	res.json(user);
}

module.exports = { register, login, getAll, getById, update };