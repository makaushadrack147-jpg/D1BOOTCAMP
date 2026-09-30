# Blog API

PostgreSQL-backed Express API. The server creates the `posts` table in the `postgres` database when it starts.

Set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` for your PostgreSQL server. `PGDATABASE` defaults to `postgres`, and `PORT` defaults to `3000`. Alternatively, set `DATABASE_URL`.

Run `npm install`, then `npm start`.

Routes: `GET /posts`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, and `DELETE /posts/:id`. Create and update requests use JSON with `title` and/or `content`.