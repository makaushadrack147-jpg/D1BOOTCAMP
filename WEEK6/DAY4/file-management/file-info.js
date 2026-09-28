const fs = require("fs");
const path = require("path");

function displayFileInfo() {
  const filePath = path.join(__dirname, "data", "example.txt");
  const exists = fs.existsSync(filePath);

  console.log(`File exists: ${exists}`);
  if (!exists) {
    return;
  }

  const fileStats = fs.statSync(filePath);
  console.log(`File size: ${fileStats.size} bytes`);
  console.log(`Creation time: ${fileStats.birthtime.toISOString()}`);
}

module.exports = displayFileInfo;
