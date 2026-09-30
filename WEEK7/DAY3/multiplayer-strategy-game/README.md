# Outpost

A turn-based two-player base-capture game. Players register or log in, create or join a waiting match, then move one cardinal step at a time on a 10x10 board. Obstacles block movement; walking onto the opposing base or attacking it from an adjacent tile wins.

Run `npm install` and `npm start`, then open `http://localhost:3001` in two browser sessions. Set `PORT` to change the default port.

## REST API

- `POST /api/auth/register` and `POST /api/auth/login` accept `{ "username": "...", "password": "..." }` and return a bearer token.
- `GET /api/games` lists waiting matches.
- `POST /api/games` creates a match.
- `POST /api/games/:id/join` joins an open match.
- `GET /api/games/:id` returns the board and match state.
- `POST /api/games/:id/moves` accepts `{ "direction": "up|down|left|right" }`.
- `POST /api/games/:id/attack` captures the opposing base when the current player is adjacent to it.

All game endpoints require `Authorization: Bearer <token>`. Accounts, tokens, and active games are held in memory and reset when the server restarts; use a persistent database for deployment.