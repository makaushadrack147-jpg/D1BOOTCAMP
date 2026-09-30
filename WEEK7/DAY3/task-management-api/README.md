# Task Management API

An Express API that stores tasks in `tasks.json`.

Run `npm install`, then `npm start`. The server listens on port `3000` by default; set `PORT` to change it.

- `GET /tasks` lists tasks.
- `GET /tasks/:id` returns one task.
- `POST /tasks` creates a task with a required non-empty `title`; `description` is optional and `completed` defaults to `false`.
- `PUT /tasks/:id` updates one or more of `title`, `description`, and `completed`.
- `DELETE /tasks/:id` deletes a task.

Requests that include task data must use `Content-Type: application/json`.