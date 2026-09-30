const posts = require("../models/postModel");

function parseId(value) {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}

function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}

async function getAll(req, res) {
	res.json(await posts.getAll());
}

async function getById(req, res) {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "Post id must be a positive integer" });

	const post = await posts.getById(id);
	if (!post) return res.status(404).json({ error: "Post not found" });
	res.json(post);
}

async function create(req, res) {
	const { title, content } = req.body;
	if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
		return res.status(400).json({ error: "A non-empty title and content are required" });
	}

	const post = await posts.create({ title: title.trim(), content: content.trim() });
	res.status(201).json(post);
}

async function update(req, res) {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "Post id must be a positive integer" });

	const { title, content } = req.body;
	if (
		(title === undefined && content === undefined) ||
		(title !== undefined && !isNonEmptyString(title)) ||
		(content !== undefined && !isNonEmptyString(content))
	) {
		return res.status(400).json({ error: "Provide a non-empty title and/or content" });
	}

	const post = await posts.update(id, {
		title: title === undefined ? undefined : title.trim(),
		content: content === undefined ? undefined : content.trim(),
	});
	if (!post) return res.status(404).json({ error: "Post not found" });
	res.json(post);
}

async function remove(req, res) {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "Post id must be a positive integer" });

	if (!(await posts.remove(id))) return res.status(404).json({ error: "Post not found" });
	res.status(204).end();
}

module.exports = { getAll, getById, create, update, remove };