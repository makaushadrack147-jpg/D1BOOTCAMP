# Real-time Chat

An Express and Socket.IO chat app with named rooms, active-user lists, join/leave notices, and short in-memory room history.

Run `npm install` and `npm start`, then open `http://localhost:3000` in more than one browser tab to try a conversation. Set `PORT` to use a different port.

Usernames are 2-24 letters, numbers, spaces, underscores, or hyphens. Room names are 2-24 letters, numbers, or hyphens. Messages are limited to 1,000 characters. Chat history is kept in memory and resets when the server restarts.