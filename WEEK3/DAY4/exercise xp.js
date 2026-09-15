// Exercise 1:

	function checkLocalValue() {
		let value = 8;
		if (value > 1) {
			value = 4;
		}
		alert(`local value: ${value}`);
	}

	checkLocalValue(); // value is 4 because 8 is greater than 1.
	// With const, assigning 4 would cause a TypeError.

{
	let sharedValue = 10;

	function updateSharedValue() {
		sharedValue = 20;
	}

	function showSharedValue() {
		alert(`shared value: ${sharedValue}`);
	}

	showSharedValue(); // 10
	updateSharedValue();
	showSharedValue(); // 20
	// With const, updateSharedValue() would fail when it assigns 20.
}

{
	function createWindowValue() {
		window.exerciseValue = "welcome";
	}

	function readWindowValue() {
		alert(`window value: ${exerciseValue}`);
	}

	createWindowValue();
	// A browser global property can be read as exerciseValue here.
	readWindowValue(); // "welcome"
}

{
	const outsideValue = "outside";

	function showLocalValue() {
		const insideValue = "inside";
		alert(`function value: ${insideValue}`);
	}

	showLocalValue(); // "inside": the function uses its own local variable.
	// Changing insideValue from let to const makes no difference here.
}

{
	const originalValue = 6;
	if (true) {
		const blockValue = 9;
		alert(`block value: ${blockValue}`); // 9
	}
	alert(`outer value: ${originalValue}`); // 6
	// Separate blocks may contain separate const variables without conflict.
}

// Exercise 2:
const battleResult = () => true;
const points = battleResult() ? 10 : 1;
console.log("Experience points:", points);

// Exercise 3: Is it a string?
const checkString = item => typeof item === "string";
console.log("String test 1:", checkString("JavaScript"));
console.log("String test 2:", checkString(42));

// Exercise 4: Find the sum
const addNumbers = (numberOne, numberTwo) => numberOne + numberTwo;
console.log("Sum:", addNumbers(12, 8));

// Exercise 5: Kg and grams
function convertWeight(kilograms) {
	return kilograms * 1000;
}
console.log("Declaration:", convertWeight(3));

const convertWeightExpression = function (kilograms) {
	return kilograms * 1000;
};
console.log("Expression:", convertWeightExpression(4));

// Declarations are hoisted; expressions are created when execution reaches them.
const convertWeightArrow = kilograms => kilograms * 1000;
console.log("Arrow:", convertWeightArrow(5));

// Exercise 6: 
(function (children, spouse, city, career) {
	showOnPage(`You will be a ${career} in ${city}, and married to ${spouse} with ${children} kids.`);
})(2, "Morgan", "Lisbon", "photographer");

// Exercise 7: 
(function (visitor) {
	const member = document.createElement("div");
	const avatar = document.createElement("img");
	avatar.src = "https://i.pravatar.cc/80?img=32";
	avatar.alt = `${visitor}'s profile picture`;
	avatar.width = 48;
	avatar.height = 48;
	member.append(avatar, document.createTextNode(`Welcome, ${visitor}`));
	document.querySelector("#navbar").append(member);
})("John");

// Exercise 8: Part I
{
	function makeJuice(size) {
		function addIngredients(first, second, third) {
			showOnPage(`The client wants a ${size} juice, containing ${first}, ${second}, ${third}.`);
		}

		addIngredients("mango", "mint", "pineapple");
	}
	makeJuice("small");
}

// Exercise 8:Part II
{
	function makeJuice(size) {
		const ingredients = [];

		function addIngredients(first, second, third) {
			ingredients.push(first, second, third);
		}

		function displayJuice() {
			showOnPage(`The client wants a ${size} juice, containing ${ingredients.join(", ")}.`);
		}

		addIngredients("pear", "celery", "lime");
		addIngredients("kiwi", "cucumber", "basil");
		displayJuice();
	}
	makeJuice("large");
}

function showOnPage(message) {
	const result = document.querySelector("#runtime-output");
	const line = document.createElement("p");
	line.textContent = message;
	result.append(line);
}
