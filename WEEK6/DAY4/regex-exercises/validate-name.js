const readline = require("readline");

function isValidFullName(fullName) {
  return /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(fullName);
}

if (require.main === module) {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  prompt.question("Enter your full name: ", (answer) => {
    console.log(isValidFullName(answer) ? "Valid name" : "Invalid name");
    prompt.close();
  });
}

module.exports = isValidFullName;
