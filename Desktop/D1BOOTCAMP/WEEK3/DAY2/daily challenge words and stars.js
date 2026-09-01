const input = typeof prompt === "function"
  ? prompt("Enter several words separated by commas:")
  : "Hello, World, in, a, frame";

if (input === null || input.trim() === "") {
  console.log("No input provided.");
} else {
  const words = input
    .split(",")
    .map(word => word.trim())
    .filter(word => word !== "");

  const longestWord = words.reduce((longest, word) => Math.max(longest, word.length), 0);
  const border = "*".repeat(longestWord + 4);

  console.log(border);

  for (const word of words) {
    const spaces = " ".repeat(longestWord - word.length);
    console.log(`* ${word}${spaces} *`);
  }

  console.log(border);
}
