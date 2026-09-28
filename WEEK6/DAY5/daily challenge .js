const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const port = Number(process.env.PORT) || 3000;
const rounds = new Map();
const players = new Map();

const emojis = [
	{ emoji: "😀", name: "Smile" },
	{ emoji: "🐶", name: "Dog" },
	{ emoji: "🌮", name: "Taco" },
	{ emoji: "🚀", name: "Rocket" },
	{ emoji: "🍉", name: "Watermelon" },
	{ emoji: "🦉", name: "Owl" },
	{ emoji: "🎸", name: "Guitar" },
	{ emoji: "🌈", name: "Rainbow" },
	{ emoji: "🐙", name: "Octopus" },
	{ emoji: "🔥", name: "Fire" },
	{ emoji: "🍕", name: "Pizza" },
	{ emoji: "🦋", name: "Butterfly" },
	{ emoji: "🧁", name: "Cupcake" },
	{ emoji: "🌵", name: "Cactus" },
	{ emoji: "🐢", name: "Turtle" },
	{ emoji: "⭐", name: "Star" },
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "emoji-game")));

app.get("/api/round", (req, res) => {
	const answer = emojis[Math.floor(Math.random() * emojis.length)];
	const distractors = emojis
		.filter((item) => item.name !== answer.name)
		.sort(() => Math.random() - 0.5)
		.slice(0, 3);
	const choices = [answer, ...distractors]
		.sort(() => Math.random() - 0.5)
		.map((item) => item.name);
	const roundId = randomUUID();

	rounds.set(roundId, { answer: answer.name, choices });
	res.json({ roundId, emoji: answer.emoji, choices });
});

app.post("/api/guess", (req, res) => {
	const { roundId, guess, playerId, playerName } = req.body;
	const round = rounds.get(roundId);

	if (!round || !round.choices?.includes(guess)) {
		return res.status(400).json({ error: "That round is no longer available." });
	}
	if (typeof playerId !== "string" || playerId.length > 80) {
		return res.status(400).json({ error: "A valid player ID is required." });
	}
	if (typeof playerName !== "string" || !playerName.trim()) {
		return res.status(400).json({ error: "Enter a player name first." });
	}

	rounds.delete(roundId);
	const correct = guess === round.answer;
	const player = players.get(playerId) || {
		name: playerName.trim().slice(0, 18),
		score: 0,
		played: 0,
	};
	player.name = playerName.trim().slice(0, 18);
	player.played += 1;
	if (correct) player.score += 1;
	players.set(playerId, player);

	res.json({
		correct,
		answer: round.answer,
		score: player.score,
		played: player.played,
	});
});

app.get("/api/leaderboard", (req, res) => {
	const leaderboard = [...players.values()]
		.sort((first, second) => second.score - first.score || first.played - second.played)
		.slice(0, 5);

	res.json(leaderboard);
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "emoji-game", "index.html"));
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Emoji quiz running at http://localhost:${port}`);
	});
}

module.exports = app;
