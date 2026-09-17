// Exercise 1:
type Person = {
	name: string;
	age: number;
};

type Address = {
	street: string;
	city: string;
};

type PersonWithAddress = Person & Address;

const personWithAddress: PersonWithAddress = {
	name: "Alice",
	age: 28,
	street: "Main Street",
	city: "London",
};

console.log(personWithAddress);

// Exercise 2:
function describeValue(value: number | string): string {
	if (typeof value === "number") {
		return "This is a number";
	}

	return "This is a string";
}

console.log(describeValue(42));
console.log(describeValue("hello"));

// Exercise 3: 
const someValue: any = "TypeScript";
const stringValue = someValue as string;

console.log(stringValue.toUpperCase());

// Exercise 4: 
function getFirstElement(values: (number | string)[]): string {
	return values[0] as string;
}

console.log(getFirstElement(["first", 2, "third"]));
console.log(getFirstElement(["hello", 10]));

// Exercise 5: 
function logLength<T extends { length: number }>(value: T): void {
	console.log("Length:", value.length);
}

logLength("TypeScript");
logLength([1, 2, 3]);

// Exercise 6:
type Job = {
	position: string;
	department: string;
};

type Manager = Job & {
	position: "Manager";
};

type Developer = Job & {
	position: "Developer";
};

type Employee = Person & (Manager | Developer);

function describeEmployee(employee: Employee): string {
	if (employee.position === "Manager") {
		return `${employee.name} is a manager in the ${employee.department} department.`;
	}

	return `${employee.name} is a developer in the ${employee.department} department.`;
}

const manager: Employee = {
	name: "Jordan",
	age: 35,
	position: "Manager",
	department: "Operations",
};

const developer: Employee = {
	name: "Sam",
	age: 26,
	position: "Developer",
	department: "Engineering",
};

console.log(describeEmployee(manager));
console.log(describeEmployee(developer));

// Exercise 7: Type assertions and generic constraints
function formatInput<T extends { toString(): string }>(input: T): string {
	const formattedInput = input.toString() as string;
	return formattedInput;
}

console.log(formatInput(123));
console.log(formatInput("formatted"));
