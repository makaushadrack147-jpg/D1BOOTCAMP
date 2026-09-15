// Exercise 1:
const mappedNumbers = [1, 2, 3].map((num) => {
	if (typeof num === "number") return num * 2;
	return;
});
console.log(mappedNumbers);

// Exercise 2: 
const reducedNumbers = [[0, 1], [2, 3]].reduce(
	(acc, cur) => acc.concat(cur),
	[1, 2],
);
console.log(reducedNumbers);

// Exercise 3:
const arrayNum = [1, 2, 4, 5, 8, 9];
const doubledNumbers = arrayNum.map((num, i) => {
	console.log(`num: ${num}, i: ${i}`);
	return num * 2;
});
console.log(doubledNumbers);

// Exercise 4.1
const array = [[1], [2], [3], [[[4]]], [[[5]]]];
const flattenedArray = array.flat(2);
console.log(flattenedArray);

// Exercise 4.2
const greeting = [
	["Hello", "young", "grasshopper!"],
	["you", "are"],
	["learning", "fast!"],
];
const joinedGreeting = greeting.map((words) => words.join(" "));
console.log(joinedGreeting);

// Exercise 4.3
console.log(joinedGreeting.join(" "));

// Exercise 4.4
const trapped = [[[[[[[[[[[[[[[[[[[[[[[[[[3]]]]]]]]]]]]]]]]]]]]]]]]]];
console.log(trapped.flat(Infinity));
