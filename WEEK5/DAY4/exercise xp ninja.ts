export {};

// Exercise 1: 
type Identifiable = {
	id: number;
};

type Described = {
	description: string;
};

class Container<T extends Identifiable & Described> {
	private items: T[] = [];

	add(item: T): void {
		this.items.push(item);
	}

	remove(): T | undefined {
		return this.items.pop();
	}

	list(): T[] {
		return [...this.items];
	}
}

type ContainerItem = Identifiable & Described & {
	category: string;
};

const container = new Container<ContainerItem>();
container.add({ id: 1, description: "Keyboard", category: "Hardware" });
container.add({ id: 2, description: "Notebook", category: "Stationery" });

console.log(container.list());
console.log(container.remove());

// Exercise 2: 
interface Response<T> {
	success: boolean;
	data: T;
	message?: string;
}

function parseResponse<T>(response: Response<unknown>): T {
	return response.data as T;
}

const rawResponse: Response<unknown> = {
	success: true,
	data: { id: 101, name: "Alice" },
};

const parsedUser = parseResponse<{ id: number; name: string }>(rawResponse);
console.log(parsedUser.name);

// Exercise 3: 
class Repository<T> {
	private items: T[] = [];

	add(item: T): void {
		this.items.push(item);
	}

	get(index: number): T | undefined {
		const item = this.items[index];
		return item as T | undefined;
	}

	list(): T[] {
		return [...this.items];
	}
}

const userRepository = new Repository<{ id: number; name: string }>();
userRepository.add({ id: 1, name: "Bob" });
userRepository.add({ id: 2, name: "Carol" });

console.log(userRepository.get(0));
console.log(userRepository.list());
