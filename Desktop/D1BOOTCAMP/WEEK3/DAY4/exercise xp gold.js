// Exercise 1:
//  flat adds underscores and mountain adds a peak shape.
// Prediction: landscape() returns "____/''''\\____".
const landscape = () => {
	let result = "";

	const flat = x => {
		for (let count = 0; count < x; count++) {
			result += "_";
		}
	};

	const mountain = x => {
		result += "/";
		for (let counter = 0; counter < x; counter++) {
			result += "'";
		}
		result += "\\";
	};

	flat(4);
	mountain(4);
	flat(4);

	return result;
};

console.log("Exercise 1:", landscape());

// Exercise 2:
//  addTo returns a function that remembers x = 10.
const addTo = x => y => x + y;
const addToTen = addTo(10);

// Prediction: 10 + 3 returns 13.
console.log("Exercise 2:", addToTen(3));

// Exercise 3:
//  the first call stores a = 30, and the second supplies b = 1.
const curriedSum = a => b => a + b;

// Prediction: 30 + 1 returns 31.
console.log("Exercise 3:", curriedSum(30)(1));

// Exercise 4: 
// makeSum creates a reusable function with a fixed first number.
const makeSum = a => b => a + b;
const add5 = makeSum(5);

// Prediction: add5(12) returns 17.
console.log("Exercise 4:", add5(12));

// Exercise 5:
//  compose applies g first, then passes its result to f.
const compose = (f, g) => a => f(g(a));
const add1 = number => number + 1;
const add5ToNumber = number => number + 5;

// Prediction: 10 + 5, then + 1, returns 16.
console.log("Exercise 5:", compose(add1, add5ToNumber)(10));
