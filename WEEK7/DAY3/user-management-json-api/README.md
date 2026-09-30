# User Management API

Express API and two HTML forms backed by `users.json`. Passwords are stored as bcrypt hashes and omitted from all user read responses.

Run `npm install`, then `npm start`; open `http://localhost:3002/register.html` or `http://localhost:3002/login.html`. Set `PORT` to change the default port.

Routes: `POST /register`, `POST /login`, `GET /users`, `GET /users/:id`, and `PUT /users/:id`. The user-list and update routes are unauthenticated for demonstration. User data is stored locally in `users.json`.