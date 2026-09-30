const express = require("express");
const booksRouter = require("./server/routes/books");
const books = require("./server/models/bookModel");
const db = require("./server/config/db");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use("/api/books", booksRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error);
	res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
	books.initialize()
		.then(() => {
			app.listen(port, () => {
				console.log(`Book API running at http://localhost:${port}`);
			});
		})
		.catch(async (error) => {
			console.error("Failed to start the Book API:", error);
			await db.end();
			process.exitCode = 1;
		});
}

module.exports = app;