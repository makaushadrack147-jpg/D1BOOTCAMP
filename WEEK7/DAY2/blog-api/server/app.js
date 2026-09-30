const express = require("express");
const postsRouter = require("./routes/posts");

const app = express();

app.use(express.json());
app.use("/posts", postsRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error);
	res.status(500).json({ error: "Internal server error" });
});

module.exports = app;