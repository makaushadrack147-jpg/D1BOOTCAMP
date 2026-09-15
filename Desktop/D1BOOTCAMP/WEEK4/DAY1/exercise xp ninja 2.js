// Exercise 1: 
const menu = [
	{ type: "starter", name: "Houmous with Pita" },
	{ type: "starter", name: "Vegetable Soup with Houmous peas" },
	{ type: "dessert", name: "Chocolate Cake" },
];

const hasDessert = menu.some((course) => course.type === "dessert");
console.log(hasDessert ? "The menu has a dessert." : "The menu has no dessert.");

const areAllStarters = menu.every((course) => course.type === "starter");
console.log(areAllStarters);

const hasMainCourse = menu.some((course) => course.type === "main course");

if (!hasMainCourse) {
	menu.push({ type: "main course", name: "Vegetable Lasagna" });
}

console.log(menu);

const vegetarian = ["vegetable", "houmous", "eggs", "vanilla", "potatoes"];

menu.forEach((course) => {
	const courseName = course.name.toLowerCase();
	course.vegetarian = vegetarian.some((word) => courseName.includes(word));
});

console.log(menu);

// Exercise 2: 
function stringChop(string, chunkLength) {
	const chunks = [];

	for (let index = 0; index < string.length; index += chunkLength) {
		chunks.push(string.slice(index, index + chunkLength));
	}

	return chunks;
}

console.log(stringChop("developers", 2));

// Exercise 3: 
function searchWord(string, word) {
	const matches = string.match(new RegExp(`\\b${word}\\b`, "gi"));
	const count = matches ? matches.length : 0;
	return `'${word}' was found ${count} times.`;
}

console.log(searchWord("The quick brown fox", "fox"));

// Exercise 4:
function reverseArray(array) {
	for (let left = 0, right = array.length - 1; left < right; left++, right--) {
		[array[left], array[right]] = [array[right], array[left]];
	}

	return array;
}

console.log(reverseArray([1, 2, 3, 4, 5]));
console.log(reverseArray([1, 2]));
console.log(reverseArray([]));
console.log(reverseArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
