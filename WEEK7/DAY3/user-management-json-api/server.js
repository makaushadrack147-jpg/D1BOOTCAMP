const express = require("express");
const path = require("node:path");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const app = express();
const port = Number(process.env.PORT) || 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(authRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error);
	if (error.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Request body must be valid JSON" });
	}
	res.status(500).json({ error: "Unable to access user storage" });
});

if (require.main === module) {
	app.listen(port, () => console.log(`User API running at http://localhost:${port}`));
}

module.exports = app;