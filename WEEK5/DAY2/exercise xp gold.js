"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exercise 1: 
function processValue(value) {
    if (typeof value === "number") {
        return `$${value.toFixed(2)}`;
    }
    return value.split("").reverse().join("");
}
console.log(processValue(100));
console.log(processValue("TypeScript"));
// Exercise 2: 
function sumNumbersInArray(values) {
    return values.reduce((sum, value) => {
        return typeof value === "number" ? sum + value : sum;
    }, 0);
}
console.log(sumNumbersInArray([10, "20", 30, "40"]));
console.log(sumNumbersInArray(["one", "two", 5]));
function introduceAdvancedUser(user) {
    const introduction = `My name is ${user.name} and I am ${user.age} years old.`;
    return user.address ? `${introduction} I live at ${user.address}.` : introduction;
}
console.log(introduceAdvancedUser({ name: "Alice", age: 25 }));
console.log(introduceAdvancedUser({ name: "Bob", age: 30, address: "123 Main Street" }));
// Exercise 4: 
function welcomeUser(name, greeting = "Hello") {
    return `${greeting}, ${name}!`;
}
console.log(welcomeUser("Alice"));
console.log(welcomeUser("Bob", "Welcome"));
//# sourceMappingURL=exercise%20xp%20gold.js.map