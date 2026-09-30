const socket = io();
const welcomeView = document.querySelector("#welcome-view");
const chatView = document.querySelector("#chat-view");
const joinForm = document.querySelector("#join-form");
const joinError = document.querySelector("#join-error");
const usernameInput = document.querySelector("#username-input");
const roomSelect = document.querySelector("#room-select");
const leaveButton = document.querySelector("#leave-button");
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const messageList = document.querySelector("#message-list");
const peopleList = document.querySelector("#people-list");
const peopleCount = document.querySelector("#people-count");
const roomTitle = document.querySelector("#room-title");
const roomKicker = document.querySelector("#room-kicker");
const roomPresence = document.querySelector("#room-presence");
const connectionLabel = document.querySelector("#connection-label");
const toast = document.querySelector("#message-toast");
const roomTitles = { commons: "The commons", studio: "The studio", afterhours: "After hours" };
const roomCounts = new Map();
let username = "";
let currentRoom = "";
let selfId = "";
let unreadCount = 0;
let toastTimeout;

function showToast(text) {
	toast.textContent = text;
	toast.classList.add("visible");
	clearTimeout(toastTimeout);
	toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function setRoom(room) {
	currentRoom = room;
	roomTitle.textContent = roomTitles[room] ?? `#${room}`;
	roomKicker.textContent = room.toUpperCase();
	document.querySelectorAll(".room-link").forEach((button) => {
		button.classList.toggle("active", button.dataset.room === room);
	});
}

function addDateMarker() {
	const marker = document.createElement("div");
	marker.className = "date-marker";
	marker.textContent = "TODAY";
	messageList.append(marker);
}

function renderMessage(message) {
	if (message.type === "system") {
		const row = document.createElement("div");
		row.className = "message-row system";
		const text = document.createElement("span");
		text.textContent = message.text;
		row.append(text);
		messageList.append(row);
		return;
	}

	const own = message.userId === selfId;
	const row = document.createElement("article");
	row.className = `message-row${own ? " own" : ""}`;
	const avatar = document.createElement("span");
	avatar.className = "message-avatar";
	avatar.textContent = (message.username || "?").trim().charAt(0).toUpperCase();
	const content = document.createElement("div");
	content.className = "message-content";
	const meta = document.createElement("div");
	meta.className = "message-meta";
	const name = document.createElement("strong");
	name.textContent = own ? "You" : message.username;
	const time = document.createElement("time");
	time.dateTime = message.createdAt;
	time.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt));
	meta.append(name, time);
	const bubble = document.createElement("div");
	bubble.className = "message-bubble";
	bubble.textContent = message.text;
	content.append(meta, bubble);
	row.append(avatar, content);
	messageList.append(row);

	if (!own && document.hidden) {
		unreadCount += 1;
		document.title = `(${unreadCount}) ${roomTitles[currentRoom] ?? "Chat"} · Commonroom`;
	}
	if (!own && !document.hasFocus()) showToast(`${message.username}: ${message.text}`);
	messageList.scrollTop = messageList.scrollHeight;
}

function updatePeople(users) {
	peopleList.replaceChildren();
	peopleCount.textContent = String(users.length);
	roomCounts.set(currentRoom, users.length);
	document.querySelectorAll("[data-room-count]").forEach((item) => {
		item.textContent = String(roomCounts.get(item.dataset.roomCount) ?? 0);
	});
	roomPresence.textContent = `${users.length} ${users.length === 1 ? "person" : "people"} here`;
	for (const user of users) {
		const item = document.createElement("li");
		item.className = "person-row";
		const avatar = document.createElement("span");
		avatar.className = "person-avatar";
		avatar.textContent = user.username.trim().charAt(0).toUpperCase();
		const name = document.createElement("span");
		name.textContent = user.username;
		item.append(avatar, name);
		if (user.id === selfId) {
			const you = document.createElement("span");
			you.className = "you-tag";
			you.textContent = "you";
			item.append(you);
		}
		peopleList.append(item);
	}
}

joinForm.addEventListener("submit", (event) => {
	event.preventDefault();
	username = usernameInput.value.trim();
	if (username.length < 2) {
		joinError.textContent = "Your name needs at least two characters.";
		return;
	}
	joinError.textContent = "";
	socket.emit("room:join", { username, room: roomSelect.value });
});

document.querySelectorAll(".room-link").forEach((button) => {
	button.addEventListener("click", () => {
		if (button.dataset.room !== currentRoom) socket.emit("room:join", { username, room: button.dataset.room });
	});
});

leaveButton.addEventListener("click", () => socket.emit("room:leave"));

messageForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const text = messageInput.value.trim();
	if (!text || !currentRoom) return;
	socket.emit("chat:send", text);
	messageInput.value = "";
	messageInput.style.height = "auto";
	messageInput.focus();
});

messageInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter" && !event.shiftKey) {
		event.preventDefault();
		messageForm.requestSubmit();
	}
});

messageInput.addEventListener("input", () => {
	messageInput.style.height = "auto";
	messageInput.style.height = `${Math.min(messageInput.scrollHeight, 105)}px`;
});

socket.on("connect", () => {
	connectionLabel.textContent = "CONNECTED";
	roomPresence.textContent = currentRoom ? "Connected" : "Ready to join";
});

socket.on("disconnect", () => {
	connectionLabel.textContent = "RECONNECTING…";
	roomPresence.textContent = "Reconnecting";
});

socket.on("room:error", (message) => {
	joinError.textContent = message;
	showToast(message);
});

socket.on("room:joined", (room) => {
	username = room.username;
	selfId = room.selfId;
	setRoom(room.room);
	messageList.replaceChildren();
	addDateMarker();
	welcomeView.classList.add("hidden");
	chatView.classList.remove("hidden");
	leaveButton.classList.remove("hidden");
	document.querySelector("#profile-name").textContent = username;
	document.querySelector("#profile-avatar").textContent = username.charAt(0).toUpperCase();
	if (window.Notification && Notification.permission === "default") Notification.requestPermission();
	messageInput.focus();
});

socket.on("room:history", (messages) => messages.forEach(renderMessage));
socket.on("room:users", updatePeople);
socket.on("chat:message", renderMessage);

socket.on("room:left", () => {
	currentRoom = "";
	username = "";
	selfId = "";
	peopleList.replaceChildren();
	peopleCount.textContent = "0";
	chatView.classList.add("hidden");
	welcomeView.classList.remove("hidden");
	leaveButton.classList.add("hidden");
	joinError.textContent = "";
	usernameInput.focus();
});

document.addEventListener("visibilitychange", () => {
	if (!document.hidden) {
		unreadCount = 0;
		document.title = "Commonroom | Chat";
	}
});