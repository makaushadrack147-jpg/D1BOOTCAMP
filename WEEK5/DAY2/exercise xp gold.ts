// Exercise 1: 
function processValue(value: string | number): string {
	if (typeof value === "number") {
		return `$${value.toFixed(2)}`;
	}

	return value.split("").reverse().join("");
}

console.log(processValue(100));
console.log(processValue("TypeScript"));

// Exercise 2: 
function sumNumbersInArray(values: Array<number | string>): number {
	return values.reduce((sum: number, value: number | string) => {
		return typeof value === "number" ? sum + value : sum;
	}, 0);
}

console.log(sumNumbersInArray([10, "20", 30, "40"]));
console.log(sumNumbersInArray(["one", "two", 5]));

// Exercise 3:
type AdvancedUser = {
	name: string;
	age: number;
	address?: string;
};

function introduceAdvancedUser(user: AdvancedUser): string {
	const introduction = `My name is ${user.name} and I am ${user.age} years old.`;
	return user.address ? `${introduction} I live at ${user.address}.` : introduction;
}

console.log(introduceAdvancedUser({ name: "Alice", age: 25 }));
console.log(introduceAdvancedUser({ name: "Bob", age: 30, address: "123 Main Street" }));

// Exercise 4: 
function welcomeUser(name: string, greeting: string = "Hello"): string {
	return `${greeting}, ${name}!`;
}

console.log(welcomeUser("Alice"));
console.log(welcomeUser("Bob", "Welcome"));
