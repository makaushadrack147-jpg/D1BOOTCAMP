const axios = require("axios");

async function fetchAndDisplayPostTitles() {
  const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
  for (const post of response.data) {
    console.log(post.title);
  }
}

module.exports = fetchAndDisplayPostTitles;
