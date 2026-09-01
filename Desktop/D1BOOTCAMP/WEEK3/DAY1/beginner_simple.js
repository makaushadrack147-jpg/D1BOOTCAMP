// 🎯 Simple Beginner JavaScript Code

console.log("=== Welcome to JavaScript! ===\n");

// 1. Variables and Data Types
console.log("--- 1. Variables and Data Types ---");
let name = "Alice";
let age = 25;
let isStudent = true;
let score = 95.5;

console.log(`Name: ${name}`);
console.log(`Age: ${age}`);
console.log(`Is Student: ${isStudent}`);
console.log(`Score: ${score}`);


// 2. Basic Math Operations
console.log("\n--- 2. Basic Math ---");
let num1 = 10;
let num2 = 3;

console.log(`${num1} + ${num2} = ${num1 + num2}`);
console.log(`${num1} - ${num2} = ${num1 - num2}`);
console.log(`${num1} * ${num2} = ${num1 * num2}`);
console.log(`${num1} / ${num2} = ${num1 / num2}`);
console.log(`${num1} % ${num2} = ${num1 % num2}`); // Modulo (remainder)


// 3. Strings
console.log("\n--- 3. Working with Strings ---");
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;

console.log(`Full Name: ${fullName}`);
console.log(`Length of name: ${fullName.length}`);
console.log(`Uppercase: ${fullName.toUpperCase()}`);
console.log(`Lowercase: ${fullName.toLowerCase()}`);


// 4. Arrays (Lists)
console.log("\n--- 4. Arrays ---");
let fruits = ["apple", "banana", "orange", "grape"];

console.log(`Fruits: ${fruits}`);
console.log(`First fruit: ${fruits[0]}`);
console.log(`Last fruit: ${fruits[fruits.length - 1]}`);
console.log(`Number of fruits: ${fruits.length}`);


// 5. Simple Loop
console.log("\n--- 5. Simple Loop ---");
console.log("Counting from 1 to 5:");

for (let i = 1; i <= 5; i++) {
    console.log(i);
}


// 6. If/Else Statement
console.log("\n--- 6. If/Else ---");
let temperature = 25;

if (temperature > 30) {
    console.log("It's hot!");
} else if (temperature > 15) {
    console.log("It's warm and comfortable");
} else {
    console.log("It's cold!");
}


// 7. Function (Basic)
console.log("\n--- 7. Functions ---");

function greet(userName) {
    return `Hello, ${userName}! Welcome!`;
}

console.log(greet("Bob"));
console.log(greet("Sarah"));


// 8. Summary
console.log("\n=== Great! You learned the basics! ===");
