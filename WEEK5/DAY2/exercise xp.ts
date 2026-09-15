export {};

// Exercise 1: 
console.log("Hello, World!");

// Exercise 2:
const age: number = 20;
const name: string = "Shadrack";
console.log(name, age);

// Exercise 3:
const id: string | number = 101;
console.log("ID:", id);

// Exercise 4:
function describeNumber(value: number): string {
	if (value > 0) {
		return "Positive";
	} else if (value < 0) {
		return "Negative";
	} else {
		return "Zero";
	}
}

console.log(describeNumber(10));
console.log(describeNumber(-3));
console.log(describeNumber(0));

// Exercise 5:
function getDetails(personName: string, personAge: number): [string, number, string] {
	return [
		personName,
		personAge,
		`Hello, ${personName}! You are ${personAge} years old.`,
	];
}

const details = getDetails("Alice", 25);
console.log(details);

// Exercise 6: 
type Person = {
	name: string;
	age: number;
};

function createPerson(personName: string, personAge: number): Person {
	return { name: personName, age: personAge };
}

console.log(createPerson("Bob", 30));

// Exercise 7:
if (typeof document !== "undefined") {
	const input = document.getElementById("name-input") as HTMLInputElement | null;
	if (input) {
		input.value = "Alice";
		console.log("Input value:", input.value);
	}
} else {
	console.log("DOM example skipped outside a browser.");
}

// Exercise 8:
function getAction(role: string): string {
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

// Exercise 9:
function greet(): string;
function greet(personName: string): string;
function greet(personName?: string): string {
	return personName ? `Hello, ${personName}!` : "Hello, World!";
}

console.log(greet("Alice"));
console.log(greet());
