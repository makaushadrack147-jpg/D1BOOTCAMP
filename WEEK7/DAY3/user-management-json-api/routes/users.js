const express = require("express");
const bcrypt = require("bcrypt");
const store = require("../storage/usersStore");

const router = express.Router();
const editableFields = ["name", "lastName", "email", "username", "password"];

function publicUser(user) {
	const { password, ...profile } = user;
	return profile;
}

function isValidField(field, value) {
	if (field === "email") return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
	if (field === "password") return typeof value === "string" && value.length >= 8;
	return typeof value === "string" && value.trim().length > 0;
}

router.get("/", async (req, res) => {
	const users = await store.read();
	res.json(users.map(publicUser));
});

router.get("/:id", async (req, res) => {
	const users = await store.read();
	const user = users.find((item) => item.id === req.params.id);
	if (!user) return res.status(404).json({ error: "User not found" });
	res.json(publicUser(user));
});

router.put("/:id", async (req, res) => {
	const fields = req.body ?? {};
	const updates = Object.entries(fields);
	if (updates.length === 0 || updates.some(([field, value]) => !editableFields.includes(field) || !isValidField(field, value))) {
		return res.status(400).json({ error: "Provide valid name, lastName, email, username, and/or password fields" });
	}

	const user = await store.mutate(async (users) => {
		const index = users.findIndex((item) => item.id === req.params.id);
		if (index === -1) return { save: false, value: null };

		const current = users[index];
		const normalizedUpdates = Object.fromEntries(updates.map(([field, value]) => [
			field,
			field === "email" ? value.trim().toLowerCase() : field === "password" ? value : value.trim(),
		]));
		if (normalizedUpdates.username && users.some((item) => item.id !== current.id && item.username.toLowerCase() === normalizedUpdates.username.toLowerCase())) {
			return { save: false, value: "duplicate" };
		}
		if (normalizedUpdates.email && users.some((item) => item.id !== current.id && item.email === normalizedUpdates.email)) {
			return { save: false, value: "duplicate" };
		}
		if (normalizedUpdates.password) {
			for (const item of users) {
				if (item.id !== current.id && await bcrypt.compare(normalizedUpdates.password, item.password)) {
					return { save: false, value: "duplicate" };
				}
			}
			normalizedUpdates.password = await bcrypt.hash(normalizedUpdates.password, 12);
		}

		Object.assign(current, normalizedUpdates);
		return { save: true, value: publicUser(current) };
	});
	if (user === "duplicate") return res.status(409).json({ error: "Username, email, or password already exists" });
	if (!user) return res.status(404).json({ error: "User not found" });
	res.json({ message: "User updated successfully", user });
});

module.exports = router;