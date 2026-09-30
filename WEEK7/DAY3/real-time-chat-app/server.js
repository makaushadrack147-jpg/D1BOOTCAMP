const express = require("express");
const http = require("node:http");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = Number(process.env.PORT) || 3000;
const sessions = new Map();
const roomHistory = new Map();
const historyLimit = 80;

app.use(express.static(path.join(__dirname, "public")));

function getRoomUsers(room) {
	return [...sessions.entries()]
		.filter(([, session]) => session.room === room)
		.map(([id, session]) => ({ id, username: session.username }))
		.sort((first, second) => first.username.localeCompare(second.username));
}

function emitRoomUsers(room) {
	io.to(room).emit("room:users", getRoomUsers(room));
}

function publishMessage(room, message) {
	const history = roomHistory.get(room) ?? [];
	history.push(message);
	if (history.length > historyLimit) history.splice(0, history.length - historyLimit);
	roomHistory.set(room, history);
	io.to(room).emit("chat:message", message);
}

function leaveRoom(socket, notify = true) {
	const session = sessions.get(socket.id);
	if (!session) return;

	sessions.delete(socket.id);
	socket.leave(session.room);
	if (notify) {
		emitRoomUsers(session.room);
		publishMessage(session.room, {
			id: randomUUID(),
			type: "system",
			text: `${session.username} left the room`,
			createdAt: new Date().toISOString(),
		});
	}
}

io.on("connection", (socket) => {
	socket.on("room:join", ({ username, room } = {}) => {
		const cleanUsername = typeof username === "string" ? username.trim() : "";
		const cleanRoom = typeof room === "string" ? room.trim().toLowerCase() : "";
		if (!/^[\p{L}\p{N}_ -]{2,24}$/u.test(cleanUsername)) {
			socket.emit("room:error", "Choose a username with 2-24 letters, numbers, spaces, _ or -.");
			return;
		}
		if (!/^[a-z0-9-]{2,24}$/.test(cleanRoom)) {
			socket.emit("room:error", "Room names must be 2-24 letters, numbers, or hyphens.");
			return;
		}

		leaveRoom(socket);
		sessions.set(socket.id, { username: cleanUsername, room: cleanRoom });
		socket.join(cleanRoom);
		socket.emit("room:joined", { username: cleanUsername, room: cleanRoom, selfId: socket.id });
		socket.emit("room:history", roomHistory.get(cleanRoom) ?? []);
		emitRoomUsers(cleanRoom);
		publishMessage(cleanRoom, {
			id: randomUUID(),
			type: "system",
			text: `${cleanUsername} joined the room`,
			createdAt: new Date().toISOString(),
		});
	});

	socket.on("room:leave", () => {
		leaveRoom(socket);
		socket.emit("room:left");
	});

	socket.on("chat:send", (text) => {
		const session = sessions.get(socket.id);
		if (!session || typeof text !== "string") return;
		const cleanText = text.trim();
		if (!cleanText || cleanText.length > 1000) return;

		publishMessage(session.room, {
			id: randomUUID(),
			type: "user",
			username: session.username,
			userId: socket.id,
			text: cleanText,
			createdAt: new Date().toISOString(),
		});
	});

	socket.on("disconnect", () => leaveRoom(socket));
});

if (require.main === module) {
	server.listen(port, () => {
		console.log(`Chat server running at http://localhost:${port}`);
	});
}

module.exports = { app, server, io };