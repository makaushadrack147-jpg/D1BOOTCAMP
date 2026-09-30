const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

const router = express.Router();
const tasksFile = path.join(__dirname, "..", "tasks.json");
let writeQueue = Promise.resolve();
let temporaryFileId = 0;

async function readTasks() {
	const contents = await fs.readFile(tasksFile, "utf8");
	const tasks = JSON.parse(contents);
	if (!Array.isArray(tasks)) throw new Error("Task storage must contain a JSON array");
	return tasks;
}

async function saveTasks(tasks) {
	const temporaryFile = `${tasksFile}.${process.pid}.${temporaryFileId++}.tmp`;
	try {
		await fs.writeFile(temporaryFile, `${JSON.stringify(tasks, null, 2)}\n`, "utf8");
		await fs.rename(temporaryFile, tasksFile);
	} catch (error) {
		await fs.unlink(temporaryFile).catch(() => {});
		throw error;
	}
}

function mutateTasks(operation) {
	const result = writeQueue.then(async () => {
		const tasks = await readTasks();
		const outcome = operation(tasks);
		if (outcome.save) await saveTasks(tasks);
		return outcome.value;
	});
	writeQueue = result.then(() => undefined, () => undefined);
	return result;
}

function parseId(value) {
	const id = Number(value);
	return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isValidTaskField(field, value) {
	if (field === "title") return typeof value === "string" && value.trim().length > 0;
	if (field === "description") return typeof value === "string";
	if (field === "completed") return typeof value === "boolean";
	return false;
}

router.get("/", async (req, res) => {
	res.json(await readTasks());
});

router.get("/:id", async (req, res) => {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "Task id must be a positive integer" });

	const tasks = await readTasks();
	const task = tasks.find((item) => item.id === id);
	if (!task) return res.status(404).json({ error: "Task not found" });
	res.json(task);
});

router.post("/", async (req, res) => {
	const { title, description = "", completed = false } = req.body;
	if (
		!isValidTaskField("title", title) ||
		!isValidTaskField("description", description) ||
		!isValidTaskField("completed", completed)
	) {
		return res.status(400).json({ error: "Provide a non-empty title, a string description, and a boolean completed value" });
	}

	const task = await mutateTasks((tasks) => {
		const id = tasks.reduce((highest, item) => Math.max(highest, Number(item.id) || 0), 0) + 1;
		const createdTask = {
			id,
			title: title.trim(),
			description,
			completed,
			createdAt: new Date().toISOString(),
		};
		tasks.push(createdTask);
		return { save: true, value: createdTask };
	});
	res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "Task id must be a positive integer" });

	const entries = Object.entries(req.body);
	if (entries.length === 0 || entries.some(([field, value]) => !isValidTaskField(field, value))) {
		return res.status(400).json({ error: "Provide at least one valid title, description, or completed value" });
	}

	const task = await mutateTasks((tasks) => {
		const existing = tasks.find((item) => item.id === id);
		if (!existing) return { save: false, value: null };

		for (const [field, value] of entries) {
			existing[field] = field === "title" ? value.trim() : value;
		}
		existing.updatedAt = new Date().toISOString();
		return { save: true, value: existing };
	});
	if (!task) return res.status(404).json({ error: "Task not found" });
	res.json(task);
});

router.delete("/:id", async (req, res) => {
	const id = parseId(req.params.id);
	if (!id) return res.status(400).json({ error: "Task id must be a positive integer" });

	const deleted = await mutateTasks((tasks) => {
		const index = tasks.findIndex((item) => item.id === id);
		if (index === -1) return { save: false, value: false };
		tasks.splice(index, 1);
		return { save: true, value: true };
	});
	if (!deleted) return res.status(404).json({ error: "Task not found" });
	res.status(204).end();
});

module.exports = router;