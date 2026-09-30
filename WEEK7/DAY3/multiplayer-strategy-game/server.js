const express = require("express");
const path = require("node:path");
const crypto = require("node:crypto");

const app = express();
const port = Number(process.env.PORT) || 3001;
const users = new Map();
const tokens = new Map();
const games = new Map();
const obstacles = [
	[2, 0], [2, 1], [2, 2], [2, 3], [5, 1], [5, 2], [5, 3], [7, 2], [7, 3], [7, 4],
	[1, 5], [2, 5], [3, 5], [5, 6], [6, 6], [7, 6], [3, 8], [4, 8], [5, 8], [8, 7],
];
const directions = {
	up: [0, -1],
	down: [0, 1],
	left: [-1, 0],
	right: [1, 0],
};

app.use(express.json());
app.use((req, res, next) => {
	if (req.body === undefined) req.body = {};
	next();
});
app.use(express.static(path.join(__dirname, "public")));

function publicUser(user) {
	return { id: user.id, username: user.username };
}

function requireAuth(req, res, next) {
	const authorization = req.get("authorization") || "";
	const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
	const userId = tokens.get(token);
	const user = userId ? [...users.values()].find((item) => item.id === userId) : null;
	if (!user) return res.status(401).json({ error: "Please log in to continue" });
	if (token) req.user = user;
	next();
}

function passwordHash(password, salt) {
	return crypto.scryptSync(password, salt, 64);
}

function createToken(user) {
	const token = crypto.randomBytes(32).toString("base64url");
	tokens.set(token, user.id);
	return token;
}

function findGameForPlayer(game, userId) {
	return game.players.find((player) => player.userId === userId);
}

function gameView(game) {
	return {
		id: game.id,
		gridSize: 10,
		status: game.status,
		players: game.players.map((player) => ({
			...publicUser(player),
			color: player.color,
			position: game.positions[player.userId],
			base: game.bases[player.userId],
		})),
		obstacles: game.obstacles,
		currentTurnUserId: game.currentTurnUserId,
		winnerUserId: game.winnerUserId,
		turn: game.turn,
		log: game.log.slice(-12),
	};
}

function gameForRequest(req, res) {
	const game = games.get(req.params.id);
	if (!game) {
		res.status(404).json({ error: "Game not found" });
		return null;
	}
	if (!findGameForPlayer(game, req.user.id)) {
		res.status(403).json({ error: "You are not a player in this game" });
		return null;
	}
	return game;
}

function isInsideBoard(position) {
	return position.x >= 0 && position.x < 10 && position.y >= 0 && position.y < 10;
}

function isBlocked(game, position, movingUserId) {
	if (game.obstacles.some(([x, y]) => x === position.x && y === position.y)) return true;
	if (game.players.some((player) => {
		const base = game.bases[player.userId];
		return player.userId !== movingUserId && base.x === position.x && base.y === position.y;
	})) return false;
	if (game.players.some((player) => {
		const base = game.bases[player.userId];
		return player.userId === movingUserId && base.x === position.x && base.y === position.y;
	})) return true;
	return game.players.some((player) => {
		const current = game.positions[player.userId];
		return player.userId !== movingUserId && current.x === position.x && current.y === position.y;
	});
}

function advanceTurn(game, userId, action) {
	const nextPlayer = game.players.find((player) => player.userId !== userId);
	game.currentTurnUserId = nextPlayer?.userId ?? null;
	game.turn += 1;
	game.log.push({ text: action, turn: game.turn - 1 });
}

app.post("/api/auth/register", (req, res) => {
	const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
	const password = req.body.password;
	if (!/^[\p{L}\p{N}_-]{3,20}$/u.test(username) || typeof password !== "string" || password.length < 8) {
		return res.status(400).json({ error: "Username must be 3-20 letters, numbers, _ or -; password must be at least 8 characters" });
	}
	const key = username.toLowerCase();
	if (users.has(key)) return res.status(409).json({ error: "That username is already taken" });

	const salt = crypto.randomBytes(16);
	const user = { id: crypto.randomUUID(), username, salt, hash: passwordHash(password, salt) };
	users.set(key, user);
	res.status(201).json({ token: createToken(user), user: publicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
	const username = typeof req.body.username === "string" ? req.body.username.trim().toLowerCase() : "";
	const password = req.body.password;
	const user = users.get(username);
	if (!user || typeof password !== "string") return res.status(401).json({ error: "Invalid username or password" });

	const suppliedHash = passwordHash(password, user.salt);
	if (!crypto.timingSafeEqual(suppliedHash, user.hash)) return res.status(401).json({ error: "Invalid username or password" });
	res.json({ token: createToken(user), user: publicUser(user) });
});

app.get("/api/games", requireAuth, (req, res) => {
	const waitingGames = [...games.values()]
		.filter((game) => game.status === "waiting" && !findGameForPlayer(game, req.user.id))
		.map((game) => ({ id: game.id, host: publicUser(game.players[0]), createdAt: game.createdAt }));
	res.json(waitingGames);
});

app.post("/api/games", requireAuth, (req, res) => {
	const id = crypto.randomUUID();
	const game = {
		id,
		status: "waiting",
		players: [{ ...publicUser(req.user), userId: req.user.id, color: "ember" }],
		positions: { [req.user.id]: { x: 0, y: 1 } },
		bases: { [req.user.id]: { x: 0, y: 0 } },
		obstacles: obstacles.map(([x, y]) => [x, y]),
		currentTurnUserId: null,
		winnerUserId: null,
		turn: 0,
		createdAt: new Date().toISOString(),
		log: [{ text: `${req.user.username} established an outpost`, turn: 0 }],
	};
	games.set(id, game);
	res.status(201).json(gameView(game));
});

app.post("/api/games/:id/join", requireAuth, (req, res) => {
	const game = games.get(req.params.id);
	if (!game) return res.status(404).json({ error: "Game not found" });
	if (game.status !== "waiting" || game.players.length !== 1) return res.status(409).json({ error: "This game is no longer open" });
	if (findGameForPlayer(game, req.user.id)) return res.status(409).json({ error: "You created this game; invite another player" });

	game.players.push({ ...publicUser(req.user), userId: req.user.id, color: "tide" });
	game.positions[req.user.id] = { x: 9, y: 8 };
	game.bases[req.user.id] = { x: 9, y: 9 };
	game.currentTurnUserId = game.players[0].userId;
	game.status = "active";
	game.log.push({ text: `${req.user.username} entered the field`, turn: 0 });
	res.json(gameView(game));
});

app.get("/api/games/:id", requireAuth, (req, res) => {
	const game = gameForRequest(req, res);
	if (game) res.json(gameView(game));
});

app.get("/api/games/:id/status", requireAuth, (req, res) => {
	const game = gameForRequest(req, res);
	if (game) res.json({ status: game.status, winnerUserId: game.winnerUserId, currentTurnUserId: game.currentTurnUserId, turn: game.turn });
});

app.post("/api/games/:id/moves", requireAuth, (req, res) => {
	const game = gameForRequest(req, res);
	if (!game) return;
	if (game.status !== "active") return res.status(409).json({ error: "This game is not active" });
	if (game.currentTurnUserId !== req.user.id) return res.status(409).json({ error: "It is the other player's turn" });
	const delta = directions[req.body.direction];
	if (!delta) return res.status(400).json({ error: "Choose up, down, left, or right" });

	const current = game.positions[req.user.id];
	const destination = { x: current.x + delta[0], y: current.y + delta[1] };
	if (!isInsideBoard(destination)) return res.status(400).json({ error: "That move leaves the board" });
	if (game.obstacles.some(([x, y]) => x === destination.x && y === destination.y)) return res.status(409).json({ error: "An obstacle blocks that square" });
	if (isBlocked(game, destination, req.user.id)) return res.status(409).json({ error: "That square is occupied" });

	game.positions[req.user.id] = destination;
	const opponent = game.players.find((player) => player.userId !== req.user.id);
	const enemyBase = game.bases[opponent.userId];
	if (destination.x === enemyBase.x && destination.y === enemyBase.y) {
		game.status = "finished";
		game.winnerUserId = req.user.id;
		game.currentTurnUserId = null;
		game.log.push({ text: `${req.user.username} captured the base`, turn: game.turn + 1 });
	} else {
		advanceTurn(game, req.user.id, `${req.user.username} moved ${req.body.direction}`);
	}
	res.json(gameView(game));
});

app.post("/api/games/:id/attack", requireAuth, (req, res) => {
	const game = gameForRequest(req, res);
	if (!game) return;
	if (game.status !== "active") return res.status(409).json({ error: "This game is not active" });
	if (game.currentTurnUserId !== req.user.id) return res.status(409).json({ error: "It is the other player's turn" });

	const opponent = game.players.find((player) => player.userId !== req.user.id);
	const position = game.positions[req.user.id];
	const base = game.bases[opponent.userId];
	const distance = Math.abs(position.x - base.x) + Math.abs(position.y - base.y);
	if (distance !== 1) return res.status(409).json({ error: "Move next to the opposing base before attacking" });

	game.status = "finished";
	game.winnerUserId = req.user.id;
	game.currentTurnUserId = null;
	game.turn += 1;
	game.log.push({ text: `${req.user.username} captured the base in an attack`, turn: game.turn });
	res.json(gameView(game));
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error);
	res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
	app.listen(port, () => console.log(`Outpost API running at http://localhost:${port}`));
}

module.exports = { app, games, users, tokens };