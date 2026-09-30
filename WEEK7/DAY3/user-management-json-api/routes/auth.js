const express = require("express");
const bcrypt = require("bcrypt");
const store = require("../storage/usersStore");

const router = express.Router();

function validEmail(value) {
	return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function publicUser(user) {
	const { password, ...profile } = user;
	return profile;
}

router.post("/register", async (req, res) => {
	const { name, lastName, email, username, password } = req.body ?? {};
	if ([name, lastName, username].some((value) => typeof value !== "string" || !value.trim()) ||
		!validEmail(email) || typeof password !== "string" || password.length < 8) {
		return res.status(400).json({ error: "Complete all fields with a valid email and a password of at least 8 characters" });
	}

	const profile = {
		name: name.trim(),
		lastName: lastName.trim(),
		email: email.trim().toLowerCase(),
		username: username.trim(),
	};
	const result = await store.mutate(async (users) => {
		if (users.some((user) => user.username.toLowerCase() === profile.username.toLowerCase() || user.email === profile.email)) {
			return { save: false, value: "duplicate" };
		}
		for (const user of users) {
			if (await bcrypt.compare(password, user.password)) return { save: false, value: "duplicate" };
		}

		const user = { id: store.createId(), ...profile, password: await bcrypt.hash(password, 12) };
		users.push(user);
		return { save: true, value: publicUser(user) };
	});
	if (result === "duplicate") return res.status(409).json({ error: "Username, email, or password already exists" });
	res.status(201).json({ message: "User registered successfully", user: result });
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body ?? {};
	if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
		return res.status(400).json({ error: "Username and password are required" });
	}

	const users = await store.read();
	const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ error: "Invalid username or password" });
	}
	res.json({ message: `Welcome, ${user.name}!`, user: publicUser(user) });
});

module.exports = router;