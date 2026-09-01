const numbers = [5, 0, 9, 1, 7, 4, 2, 6, 3, 8];

// 1. Convert array to string using toString()
console.log("toString():", numbers.toString());

// 2. Convert array to string using join() with different separators
console.log("join('+'):", numbers.join("+"));
console.log("join(' '):", numbers.join(" "));
console.log("join(''):", numbers.join(""));

// Bonus: Bubble Sort in descending order using nested loops
let bubbleNumbers = [...numbers];

for (let i = 0; i < bubbleNumbers.length; i++) {
  for (let j = 0; j < bubbleNumbers.length - 1 - i; j++) {
    // If current value is smaller than the next value, swap them
    if (bubbleNumbers[j] < bubbleNumbers[j + 1]) {
      let temp = bubbleNumbers[j];
      bubbleNumbers[j] = bubbleNumbers[j + 1];
      bubbleNumbers[j + 1] = temp;
    }

    console.log(`Step ${i + 1}-${j + 1}:`, [...bubbleNumbers]);
  }
}

console.log("Final sorted array:", bubbleNumbers);
