export {};

type User = {
	type: "user";
	name: string;
	age: number;
};

type Product = {
	type: "product";
	id: number;
	price: number;
};

type Order = {
	type: "order";
	orderId: string;
	amount: number;
};

function isUser(value: unknown): value is User {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const user = value as Partial<User>;
	return user.type === "user" && typeof user.name === "string" && typeof user.age === "number";
}

function isProduct(value: unknown): value is Product {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const product = value as Partial<Product>;
	return product.type === "product" && typeof product.id === "number" && typeof product.price === "number";
}

function isOrder(value: unknown): value is Order {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const order = value as Partial<Order>;
	return order.type === "order" && typeof order.orderId === "string" && typeof order.amount === "number";
}

function handleData(data: Array<User | Product | Order>): string[] {
	return data.map((item) => {
		if (isUser(item)) {
			return `Hello, ${item.name}! You are ${item.age} years old.`;
		}

		if (isProduct(item)) {
			return `Product ${item.id} costs $${item.price}.`;
		}

		if (isOrder(item)) {
			return `Order ${item.orderId} has an amount of $${item.amount}.`;
		}

		return "Unexpected data format.";
	});
}

const data: Array<User | Product | Order> = [
	{ type: "user", name: "Alice", age: 30 },
	{ type: "product", id: 101, price: 49.99 },
	{ type: "order", orderId: "ORD-1001", amount: 89.5 },
];

console.log(handleData(data));
