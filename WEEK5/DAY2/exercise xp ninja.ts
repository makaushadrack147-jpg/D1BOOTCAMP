// Exercise 1:
type MappedType<T extends number | string> = T extends number ? number : number;

function mapType<T extends number | string>(value: T): MappedType<T> {
	if (typeof value === "number") {
		return (value * value) as MappedType<T>;
	}

	return value.length as MappedType<T>;
}

console.log(mapType(5));
console.log(mapType("TypeScript"));

// Exercise 2:
function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
	return object[key];
}

const book = {
	title: "TypeScript Basics",
	pages: 120,
};

console.log(getProperty(book, "title"));
console.log(getProperty(book, "pages"));

// Exercise 3: 
interface HasNumericProperty {
	[key: string]: number;
}

function multiplyProperty<T extends HasNumericProperty, K extends keyof T>(
	object: T,
	key: K,
	factor: number,
): number {
	const value = object[key];
	if (value === undefined) {
		throw new Error(`Property ${String(key)} does not contain a number.`);
	}

	return value * factor;
}

const dimensions = { width: 10, height: 5 };
const scores = { first: 8, second: 12 };

console.log(multiplyProperty(dimensions, "width", 3));
console.log(multiplyProperty(scores, "second", 2));
