// Exercise 1:
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, number) => total + number, 0);
console.log(sum);

// Exercise 2: 
const values = [1, 2, 2, 3, 4, 4, 5];
const uniqueValues = [...new Set(values)];
console.log(uniqueValues);

// Exercise 3: 
const mixedValues = [NaN, 0, 15, false, -22, "", undefined, 47, null];
const filteredValues = mixedValues.filter(
	(value) => Boolean(value) && !Number.isNaN(value),
);
console.log(filteredValues);

// Exercise 4:
function repeat(string, numberOfTimes = 1) {
	return string.repeat(numberOfTimes);
}

console.log(repeat("Ha!", 3));

// Exercise 5: 
const startLine = "     ||<- Start line";
let turtle = "🐢";
let rabbit = "🐇";

turtle = turtle.padStart(9, " ");
rabbit = rabbit.padStart(9, " ");

console.log(startLine);
console.log(turtle);
console.log(rabbit);

turtle = turtle.trim().padEnd(9, "=");
console.log(turtle);
