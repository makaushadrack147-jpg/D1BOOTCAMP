const books = require("../models/bookModel");

function parseId(value) {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}

function validText(value) {
	return typeof value === "string" && value.trim().length > 0;
}

function validYear(value) {
	return Number.isInteger(value) && value > 0;
}

async function getAll(req, res) {
	res.json(await books.getAll());
}

async function getById(req, res) {
	const id = parseId(req.params.bookId);
	if (!id) return res.status(400).json({ error: "Book id must be a positive integer" });

	const book = await books.getById(id);
	if (!book) return res.status(404).json({ error: "Book not found" });
	res.status(200).json(book);
}

async function create(req, res) {
	const { title, author, publishedYear } = req.body;
	if (!validText(title) || !validText(author) || !validYear(publishedYear)) {
		return res.status(400).json({ error: "A title, author, and integer publishedYear are required" });
	}

	const book = await books.create({ title: title.trim(), author: author.trim(), publishedYear });
	res.status(201).json(book);
}

async function update(req, res) {
	const id = parseId(req.params.bookId);
	if (!id) return res.status(400).json({ error: "Book id must be a positive integer" });

	const { title, author, publishedYear } = req.body;
	if (
		(title === undefined && author === undefined && publishedYear === undefined) ||
		(title !== undefined && !validText(title)) ||
		(author !== undefined && !validText(author)) ||
		(publishedYear !== undefined && !validYear(publishedYear))
	) {
		return res.status(400).json({ error: "Provide a valid title, author, and/or publishedYear" });
	}

	const book = await books.update(id, {
		title: title === undefined ? undefined : title.trim(),
		author: author === undefined ? undefined : author.trim(),
		publishedYear,
	});
	if (!book) return res.status(404).json({ error: "Book not found" });
	res.json(book);
}

async function remove(req, res) {
	const id = parseId(req.params.bookId);
	if (!id) return res.status(400).json({ error: "Book id must be a positive integer" });

	if (!(await books.remove(id))) return res.status(404).json({ error: "Book not found" });
	res.status(204).end();
}

module.exports = { getAll, getById, create, update, remove };