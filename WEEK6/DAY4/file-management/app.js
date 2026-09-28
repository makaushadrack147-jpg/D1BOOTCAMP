const path = require("path");
const { readFile, writeFile } = require("./fileManager");

const helloFile = path.join(__dirname, "Hello World.txt");
const byeFile = path.join(__dirname, "Bye World.txt");
const helloContent = readFile(helloFile);

console.log(`Read from Hello World.txt: ${helloContent.trim()}`);

writeFile(byeFile, "Writing to the file");
console.log("Wrote to Bye World.txt: Writing to the file");
