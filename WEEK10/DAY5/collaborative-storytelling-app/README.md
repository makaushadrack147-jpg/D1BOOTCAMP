# Gathered — Collaborative Storytelling

A responsive React and TypeScript story library with a Node/Express API, PostgreSQL persistence, JWT access tokens, and HTTP-only refresh cookies.

## Project layout

- `frontend/` — Vite, React, Redux Toolkit, and React Router
- `backend/` — Express routes, controllers/models, PostgreSQL pool, and schema
- `types/` — shared TypeScript models

## Run locally

1. Install Node.js 20+ and PostgreSQL.
2. Create an empty database named `storytelling`.
3. Apply the schema with `psql -d storytelling -f backend/schema.sql` (or run `backend/schema.sql` in a PostgreSQL client).
4. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`, `JWT_SECRET`, and `REFRESH_SECRET` to local values.
5. Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:4000/api`.
6. From this directory run `npm install`, then `npm run dev`.
7. Open the Vite address shown in the terminal.

The frontend runs at `http://localhost:5173`; the API defaults to `http://localhost:4000`. `GET /api/health` can be used to check the API.

## Features

- Create accounts and sign in with bcrypt-hashed passwords.
- Keep the short-lived access token in Redux memory; refresh through a secure, HTTP-only cookie and replay a failed request once.
- Browse and filter the story library; create, edit, and delete stories.
- Search registered users and invite collaborators. Authors can delete and manage collaborators; authors and collaborators can edit.
- Leave notes on a story, switch between light and dark themes, and use the layout on mobile or desktop.
- Input validation and parameterized SQL queries are applied on the server.

## Scripts

- `npm run dev` — run frontend and backend together
- `npm run build` — build both workspaces
- `npm run dev -w backend` / `npm run dev -w frontend` — run one side independently
- `npm run start -w backend` — start the compiled backend

## Deployment

Deploy `backend/` as a Render web service. Use `npm install` as the build setup (from the monorepo root), `npm run build -w backend` as the build command, and `npm run start -w backend` as the start command. Set `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET`, `FRONTEND_URL`, and `NODE_ENV=production`.

Deploy `frontend/` as a Render static site, with the monorepo root available for install/build. Build using `npm run build -w frontend`, publish `frontend/dist`, and set `VITE_API_URL` to the deployed API URL plus `/api`. Set `FRONTEND_URL` on the backend to the deployed frontend origin. Use the database's internal connection URL when the service and database share a Render region.

Refresh cookies use `secure` in production and `SameSite=Lax`; use HTTPS for production deployment.
