const fs = require("node:fs");
const path = require("node:path");
const _ = require("lodash");

const notesFile = path.join(__dirname, "notes.json");

function getNotes() {
	try {
		const contents = fs.readFileSync(notesFile, "utf8");
		const notes = JSON.parse(contents);
		if (!Array.isArray(notes)) throw new Error("Notes data must be a JSON array");
		return notes;
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}

function saveNotes(notes) {
	fs.writeFileSync(notesFile, `${JSON.stringify(notes, null, 2)}\n`, "utf8");
}

function addNote(note) {
	const notes = getNotes();
	if (_.find(notes, { title: note.title })) return false;

	notes.push({ title: note.title, body: note.body });
	saveNotes(notes);
	return true;
}

function getNote(title) {
	return _.find(getNotes(), { title });
}

function getAllNotes() {
	return getNotes();
}

function removeNote(title) {
	const notes = getNotes();
	const originalLength = notes.length;
	_.remove(notes, { title });
	if (notes.length === originalLength) return false;

	saveNotes(notes);
	return true;
}

module.exports = { addNote, getNote, getAllNotes, removeNote };