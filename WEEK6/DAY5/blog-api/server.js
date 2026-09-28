const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

let posts = [
  { id: 1, title: "Getting started with Express", content: "Express makes it simple to build APIs with Node.js." },
  { id: 2, title: "RESTful route design", content: "Resources and HTTP methods give APIs a predictable structure." },
];

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const post = {
    id: posts.length ? Math.max(...posts.map((item) => item.id)) + 1 : 1,
    title,
    content,
  };
  posts.push(post);

  res.status(201).json(post);
});

app.put("/posts/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { title, content } = req.body;
  post.title = title ?? post.title;
  post.content = content ?? post.content;

  res.json(post);
});

app.delete("/posts/:id", (req, res) => {
  const postIndex = posts.findIndex((item) => item.id === Number(req.params.id));

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  const [deletedPost] = posts.splice(postIndex, 1);
  res.json(deletedPost);
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Blog API running on port ${port}`);
  });
}

module.exports = app;