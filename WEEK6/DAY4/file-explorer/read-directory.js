const fs = require("fs");

const files = fs.readdirSync(".");
console.log("Files in file-explorer:");
for (const file of files) {
  console.log(file);
}
