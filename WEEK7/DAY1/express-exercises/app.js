const express = require("express");
const indexRouter = require("./routes");
const todosRouter = require("./routes/todos");
const booksRouter = require("./routes/books");
const createQuizRouter = require("../daily challenge");
const createPostsRouter = require("../exercise xp gold");
const createEmojiGreetingRouter = require("../exercise xp ninja");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", createEmojiGreetingRouter(express));
app.use("/", indexRouter);
app.use("/todos", todosRouter);
app.use("/books", booksRouter);
app.use("/quiz", createQuizRouter(express));
app.use("/posts", createPostsRouter(express));

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Express exercises running at http://localhost:${port}`);
	});
}

module.exports = app;