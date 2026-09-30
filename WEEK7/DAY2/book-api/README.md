# Book API

PostgreSQL-backed Express CRUD API. The server creates the `books` table in the `postgres` database when it starts.

Set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` for your PostgreSQL server. `PGDATABASE` defaults to `postgres`, and `PORT` defaults to `5000`. Alternatively, set `DATABASE_URL`.

Run `npm install`, then `npm start`.

Routes: `GET /api/books`, `GET /api/books/:bookId`, `POST /api/books`, `PUT /api/books/:bookId`, and `DELETE /api/books/:bookId`. Book JSON uses `title`, `author`, and integer `publishedYear` fields.