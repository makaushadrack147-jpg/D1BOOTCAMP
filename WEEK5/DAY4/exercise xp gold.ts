export {};

// Exercise 1: 
interface User {
	name: string;
	email: string;
}

interface Admin {
	adminLevel: number;
}

type AdminUser = User & Admin;

function getProperty(user: AdminUser, propertyName: string): unknown {
	if (propertyName in user) {
		return user[propertyName as keyof AdminUser];
	}

	return undefined;
}

const adminUser: AdminUser = {
	name: "Alice",
	email: "alice@example.com",
	adminLevel: 3,
};

console.log(getProperty(adminUser, "name"));
console.log(getProperty(adminUser, "adminLevel"));
console.log(getProperty(adminUser, "missing"));

// Exercise 2: 
function castToType<T>(value: unknown, constructor: (value: unknown) => T): T {
	return constructor(value);
}

const castNumber = castToType("42", Number);
const castBoolean = castToType("true", Boolean);

console.log(castNumber);
console.log(castBoolean);

// Exercise 3:
function getArrayLength<T extends number | string>(items: T[]): number {
	const typedItems = items as Array<number | string>;
	return typedItems.length;
}

console.log(getArrayLength([1, 2, 3]));
console.log(getArrayLength(["one", "two"]));

// Exercise 4: 
interface Storage<T> {
	add(item: T): void;
	get(index: number): T | undefined;
}

class Box<T> implements Storage<T> {
	private items: T[] = [];

	add(item: T): void {
		this.items.push(item);
	}

	get(index: number): T | undefined {
		return this.items[index];
	}
}

const numberBox = new Box<number>();
numberBox.add(10);
numberBox.add(20);

const stringBox = new Box<string>();
stringBox.add("first");
stringBox.add("second");

console.log(numberBox.get(1));
console.log(stringBox.get(0));

// Exercise 5: 
interface Item<T> {
	value: T;
}

class Queue<T> {
	private items: Item<T>[] = [];

	add(item: Item<T>): void {
		this.items.push(item);
	}

	remove(): Item<T> | undefined {
		return this.items.shift();
	}
}

const numberQueue = new Queue<number>();
numberQueue.add({ value: 1 });
numberQueue.add({ value: 2 });

const stringQueue = new Queue<string>();
stringQueue.add({ value: "first" });

console.log(numberQueue.remove());
console.log(stringQueue.remove());
