const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json());

const books = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", publishedYear: 1937 },
  { id: 2, title: "1984", author: "George Orwell", publishedYear: 1949 },
];

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/api/books/:bookId", (req, res) => {
  const book = books.find((item) => item.id === Number(req.params.bookId));

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author, publishedYear } = req.body;

  if (!title || !author || publishedYear === undefined) {
    return res.status(400).json({ error: "Title, author, and publishedYear are required" });
  }

  const book = {
    id: books.length ? Math.max(...books.map((item) => item.id)) + 1 : 1,
    title,
    author,
    publishedYear,
  };
  books.push(book);

  res.status(201).json(book);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Book API running on port ${port}`);
  });
}

module.exports = app;