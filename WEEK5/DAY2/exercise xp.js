"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exercise 1: 
console.log("Hello, World!");
// Exercise 2:
const age = 20;
const name = "Shadrack";
console.log(name, age);
// Exercise 3:
const id = 101;
console.log("ID:", id);
// Exercise 4:
function describeNumber(value) {
    if (value > 0) {
        return "Positive";
    }
    else if (value < 0) {
        return "Negative";
    }
    else {
        return "Zero";
    }
}
console.log(describeNumber(10));
console.log(describeNumber(-3));
console.log(describeNumber(0));
// Exercise 5:
function getDetails(personName, personAge) {
    return [
        personName,
        personAge,
        `Hello, ${personName}! You are ${personAge} years old.`,
    ];
}
const details = getDetails("Alice", 25);
console.log(details);
function createPerson(personName, personAge) {
    return { name: personName, age: personAge };
}
console.log(createPerson("Bob", 30));
// Exercise 7:
if (typeof document !== "undefined") {
    const input = document.getElementById("name-input");
    if (input) {
        input.value = "Alice";
        console.log("Input value:", input.value);
    }
}
else {
    console.log("DOM example skipped outside a browser.");
}
// Exercise 8:
function getAction(role) {
    switch (role) {
        case "admin":
            return "Manage users and settings";
        case "editor":
            return "Edit content";
        case "viewer":
            return "View content";
        case "guest":
            return "Limited access";
        default:
            return "Invalid role";
    }
}
console.log(getAction("admin"));
console.log(getAction("editor"));
console.log(getAction("viewer"));
console.log(getAction("guest"));
console.log(getAction("unknown"));
function greet(personName) {
    return personName ? `Hello, ${personName}!` : "Hello, World!";
}
console.log(greet("Alice"));
console.log(greet());
//# sourceMappingURL=exercise%20xp.js.map