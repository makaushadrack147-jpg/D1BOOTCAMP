# User Management API

Express API with PostgreSQL-backed registration, login, and user management. The tables are created in the `postgres` database when the server starts.

Set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` for your PostgreSQL server. `PGDATABASE` defaults to `postgres`; `PORT` defaults to `4000`. Alternatively, set `DATABASE_URL`.

Run `npm install`, then `npm start`.

Routes: `POST /register`, `POST /login`, `GET /users`, `GET /users/:id`, and `PUT /users/:id`. Registration accepts `username`, `password`, and optional `email`, `first_name`, and `last_name`. Login accepts `username` and `password`. User updates accept `username`, `email`, `first_name`, and/or `last_name`.