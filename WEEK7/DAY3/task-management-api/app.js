const express = require("express");
const tasksRouter = require("./routes/tasks");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use("/tasks", tasksRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error);
	if (error.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Invalid JSON request body" });
	}
	res.status(500).json({ error: "Unable to access task storage" });
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Task API running at http://localhost:${port}`);
	});
}

module.exports = app;