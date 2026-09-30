const express = require("express");
const usersRouter = require("./server/routes/users");
const db = require("./server/config/db");

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(usersRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error);
	if (error.code === "23505") {
		return res.status(409).json({ error: "Username or email is already registered" });
	}
	if (error.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Invalid JSON request body" });
	}
	res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
	db.initialize()
		.then(() => {
			app.listen(port, () => {
				console.log(`User API running at http://localhost:${port}`);
			});
		})
		.catch(async (error) => {
			console.error("Failed to start the User API:", error);
			await db.pool.end();
			process.exitCode = 1;
		});
}

module.exports = app;