const authView = document.querySelector("#auth-view");
const lobbyView = document.querySelector("#lobby-view");
const gameView = document.querySelector("#game-view");
const authForm = document.querySelector("#auth-form");
const authError = document.querySelector("#auth-error");
const authSubmitLabel = document.querySelector("#auth-submit-label");
const authTitle = document.querySelector("#auth-title");
const gameList = document.querySelector("#game-list");
const emptyGames = document.querySelector("#empty-games");
const gameBoard = document.querySelector("#game-board");
const attackButton = document.querySelector("#attack-button");
const actionHint = document.querySelector("#action-hint");
const actionError = document.querySelector("#action-error");
const networkStatus = document.querySelector("#network-status");
const authTabs = document.querySelectorAll(".auth-tab");
let authMode = "login";
let token = localStorage.getItem("outpost-token") || "";
let username = localStorage.getItem("outpost-username") || "";
let currentGame = null;
let pollTimer = null;
let lobbyTimer = null;
let busy = false;

async function api(path, options = {}) {
	const response = await fetch(path, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});
	const data = response.status === 204 ? null : await response.json();
	if (!response.ok) throw new Error(data?.error || "Request failed");
	return data;
}

function showView(view) {
	for (const item of [authView, lobbyView, gameView]) item.classList.toggle("hidden", item !== view);
	document.querySelector("#account-strip").classList.toggle("hidden", view === authView);
}

function setAuthMode(mode) {
	authMode = mode;
	const registering = mode === "register";
	authTitle.textContent = registering ? "Create a callsign" : "Enter the field";
	authSubmitLabel.textContent = registering ? "CREATE ACCOUNT" : "SIGN IN";
	document.querySelector("#password").autocomplete = registering ? "new-password" : "current-password";
	authTabs.forEach((tab) => {
		const active = tab.dataset.authMode === mode;
		tab.classList.toggle("active", active);
		tab.setAttribute("aria-selected", String(active));
	});
}

authTabs.forEach((tab) => tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode)));

authForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	authError.textContent = "";
	const form = new FormData(authForm);
	try {
		const result = await api(`/api/auth/${authMode === "register" ? "register" : "login"}`, {
			method: "POST",
			body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
			headers: {},
		});
		token = result.token;
		username = result.user.username;
		localStorage.setItem("outpost-token", token);
		localStorage.setItem("outpost-username", username);
		await enterLobby();
	} catch (error) {
		authError.textContent = error.message;
	}
});

function updateAccount() {
	document.querySelector("#account-name").textContent = username.toUpperCase();
}

async function enterLobby() {
	updateAccount();
	showView(lobbyView);
	await refreshGames();
	clearInterval(lobbyTimer);
	lobbyTimer = setInterval(() => refreshGames().catch(() => {}), 3500);
	const savedGameId = localStorage.getItem("outpost-game-id");
	if (savedGameId) {
		try {
			await openGame(savedGameId);
		} catch {
			localStorage.removeItem("outpost-game-id");
		}
	}
}

async function refreshGames() {
	const openGames = await api("/api/games");
	gameList.replaceChildren();
	emptyGames.classList.toggle("hidden", openGames.length > 0);
	document.querySelector("#lobby-count").textContent = `${String(openGames.length).padStart(2, "0")} OPEN`;
	for (const game of openGames) {
		const card = document.createElement("article");
		card.className = "game-card";
		const detail = document.createElement("div");
		const host = document.createElement("strong");
		host.textContent = game.host.username;
		const code = document.createElement("span");
		code.textContent = `FIELD ${game.id.slice(0, 6).toUpperCase()} · OPEN`;
		detail.append(host, code);
		const join = document.createElement("button");
		join.type = "button";
		join.textContent = "JOIN FIELD";
		join.addEventListener("click", async () => {
			join.disabled = true;
			try {
				await api(`/api/games/${game.id}/join`, { method: "POST", body: "{}" });
				await openGame(game.id);
			} catch (error) {
				join.disabled = false;
				window.alert(error.message);
				await refreshGames();
			}
		});
		card.append(detail, join);
		gameList.append(card);
	}
}

document.querySelector("#create-game").addEventListener("click", async () => {
	try {
		const game = await api("/api/games", { method: "POST", body: "{}" });
		await openGame(game.id);
	} catch (error) {
		window.alert(error.message);
	}
});

document.querySelector("#refresh-games").addEventListener("click", () => refreshGames().catch((error) => window.alert(error.message)));

async function openGame(id) {
	clearInterval(lobbyTimer);
	currentGame = await api(`/api/games/${id}`);
	localStorage.setItem("outpost-game-id", id);
	showView(gameView);
	renderGame();
	clearInterval(pollTimer);
	pollTimer = setInterval(async () => {
		try {
			currentGame = await api(`/api/games/${id}`);
			networkStatus.textContent = "FIELD LINK ACTIVE";
			renderGame();
		} catch (error) {
			networkStatus.textContent = "FIELD LINK LOST";
			actionError.textContent = error.message;
		}
	}, 1400);
}

function manhattan(first, second) {
	return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

function renderGame() {
	if (!currentGame) return;
	const me = currentGame.players.find((player) => player.username === username);
	const opponent = currentGame.players.find((player) => player.username !== username);
	if (!me) return;
	const isMyTurn = currentGame.status === "active" && currentGame.currentTurnUserId === me.id;
	document.querySelector("#game-code").textContent = `MATCH ${currentGame.id.slice(0, 6).toUpperCase()}`;
	document.querySelector("#game-title").textContent = currentGame.status === "waiting" ? "Waiting for a rival" : currentGame.status === "finished" ? "Field secured" : "The field is live.";
	document.querySelector("#player-one-label").textContent = `${currentGame.players[0].username.toUpperCase()} / A`;
	document.querySelector("#player-two-label").textContent = opponent ? `${opponent.username.toUpperCase()} / B` : "AWAITING RIVAL";
	document.querySelector("#turn-number").textContent = `TURN ${String(currentGame.turn).padStart(2, "0")}`;
	if (currentGame.status === "waiting") {
		document.querySelector("#turn-label").textContent = "Waiting for player 2";
		document.querySelector("#turn-detail").textContent = "Share this field ID with a rival: " + currentGame.id.slice(0, 8).toUpperCase();
		actionHint.textContent = "Your rival needs to join before the first turn.";
	} else if (currentGame.status === "finished") {
		const winner = currentGame.players.find((player) => player.id === currentGame.winnerUserId);
		document.querySelector("#turn-label").textContent = winner?.id === me.id ? "Victory. Base secured." : `${winner?.username ?? "Rival"} captured the base`;
		document.querySelector("#turn-detail").textContent = "Return to the lobby to play another field.";
		actionHint.textContent = "This match is complete.";
	} else {
		document.querySelector("#turn-label").textContent = isMyTurn ? "Your move" : `${opponent?.username ?? "Rival"} is moving`;
		document.querySelector("#turn-detail").textContent = isMyTurn ? "Move one square or attack an adjacent base." : "Waiting for the other commander.";
		actionHint.textContent = isMyTurn ? "Select one adjacent square to move." : "Orders unlock when your turn begins.";
	}
	document.querySelector("#turn-card").classList.toggle("my-turn", isMyTurn);
	const canAttack = isMyTurn && opponent && manhattan(me.position, opponent.base) === 1;
	attackButton.disabled = !canAttack;
	gameBoard.replaceChildren();
	const baseCells = new Map(currentGame.players.map((player) => [`${player.base.x},${player.base.y}`, player]));
	const unitCells = new Map(currentGame.players.map((player) => [`${player.position.x},${player.position.y}`, player]));
	const obstacleCells = new Set(currentGame.obstacles.map(([x, y]) => `${x},${y}`));
	for (let y = 0; y < 10; y += 1) {
		for (let x = 0; x < 10; x += 1) {
			const key = `${x},${y}`;
			const cell = document.createElement("button");
			cell.type = "button";
			cell.className = "cell";
			cell.setAttribute("role", "gridcell");
			cell.setAttribute("aria-label", `Row ${y + 1}, column ${String.fromCharCode(65 + x)}`);
			if (obstacleCells.has(key)) {
				cell.classList.add("obstacle");
				cell.setAttribute("aria-label", `Obstacle at row ${y + 1}, column ${String.fromCharCode(65 + x)}`);
				cell.disabled = true;
			}
			const base = baseCells.get(key);
			if (base) {
				cell.classList.add(base.color === "ember" ? "base-ember" : "base-tide");
				cell.setAttribute("aria-label", `${base.username}'s base`);
				if (base.id === me.id) cell.disabled = true;
			}
			const unit = unitCells.get(key);
			if (unit) {
				const marker = document.createElement("span");
				marker.className = `unit-marker ${unit.color}`;
				const label = document.createElement("span");
				label.textContent = unit.id === me.id ? "YOU" : "R";
				marker.append(label);
				cell.append(marker);
				cell.setAttribute("aria-label", `${unit.username}, row ${y + 1}, column ${String.fromCharCode(65 + x)}`);
				cell.disabled = true;
			}
			const distance = Math.abs(me.position.x - x) + Math.abs(me.position.y - y);
			if (isMyTurn && distance === 1 && !cell.disabled) cell.classList.add("valid-move");
			cell.disabled ||= !isMyTurn || distance !== 1 || currentGame.status !== "active";
			cell.addEventListener("click", () => moveTo(x, y));
			gameBoard.append(cell);
		}
	}
	const log = document.querySelector("#game-log");
	log.replaceChildren();
	for (const entry of [...currentGame.log].reverse()) {
		const item = document.createElement("li");
		item.textContent = entry.text;
		log.append(item);
	}
	const players = document.querySelector("#match-players");
	players.replaceChildren();
	for (const player of currentGame.players) {
		const row = document.createElement("div");
		row.className = "match-player";
		const chip = document.createElement("span");
		chip.className = `player-chip ${player.color}`;
		chip.textContent = player.color === "ember" ? "A" : "B";
		const name = document.createElement("span");
		name.textContent = player.id === me.id ? `${player.username} (you)` : player.username;
		row.append(chip, name);
		players.append(row);
	}
}

async function moveTo(x, y) {
	const me = currentGame.players.find((player) => player.username === username);
	const dx = x - me.position.x;
	const dy = y - me.position.y;
	const direction = dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "down" : "up";
	await sendOrder(`/api/games/${currentGame.id}/moves`, { direction });
}

async function sendOrder(path, body = {}) {
	if (busy) return;
	busy = true;
	actionError.textContent = "";
	try {
		currentGame = await api(path, { method: "POST", body: JSON.stringify(body) });
		renderGame();
	} catch (error) {
		actionError.textContent = error.message;
		try {
			currentGame = await api(`/api/games/${currentGame.id}`);
			renderGame();
		} catch {}
	} finally {
		busy = false;
	}
}

attackButton.addEventListener("click", () => {
	if (currentGame) sendOrder(`/api/games/${currentGame.id}/attack`);
});

document.querySelector("#back-lobby").addEventListener("click", async () => {
	clearInterval(pollTimer);
	currentGame = null;
	localStorage.removeItem("outpost-game-id");
	showView(lobbyView);
	await refreshGames();
	lobbyTimer = setInterval(() => refreshGames().catch(() => {}), 3500);
});

document.querySelector("#logout-button").addEventListener("click", () => {
	clearInterval(pollTimer);
	clearInterval(lobbyTimer);
	token = "";
	username = "";
	currentGame = null;
	localStorage.removeItem("outpost-token");
	localStorage.removeItem("outpost-username");
	localStorage.removeItem("outpost-game-id");
	showView(authView);
});

async function initialize() {
	if (!token) return;
	try {
		await enterLobby();
	} catch {
		token = "";
		username = "";
		localStorage.removeItem("outpost-token");
		localStorage.removeItem("outpost-username");
		localStorage.removeItem("outpost-game-id");
		showView(authView);
	}
}

initialize();