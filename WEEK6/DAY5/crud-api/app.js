const express = require("express");
const { fetchPosts } = require("./data/dataService");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.get("/api/posts", async (req, res, next) => {
  try {
    const posts = await fetchPosts();
    console.log("Posts successfully retrieved and sent.");
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ error: "Unable to retrieve posts" });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`CRUD API running on port ${port}`);
  });
}

module.exports = app;