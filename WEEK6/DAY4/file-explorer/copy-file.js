const fs = require("fs");

fs.copyFileSync("source.txt", "destination.txt");
console.log("Copied source.txt to destination.txt");
