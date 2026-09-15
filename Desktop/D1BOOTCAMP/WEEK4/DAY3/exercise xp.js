const marioGame = {
	detail: 'An amazing game!',
	characters: {
		mario: {
			description: 'Small and jumpy. Likes princesses.',
			height: 10,
			weight: 3,
			speed: 12
		},
		bowser: {
			description: 'Big and green, Hates princesses.',
			height: 16,
			weight: 6,
			speed: 4
		},
		princessPeach: {
			description: 'Beautiful princess.',
			height: 12,
			weight: 2,
			speed: 2
		}
	}
};

// JSON.stringify converts the JavaScript object, including its nested objects,
// into one JSON string while preserving the nested structure.
const marioJson = JSON.stringify(marioGame);

// The third and fourth arguments pretty-print the JSON with two-space indentation.
const prettyMarioJson = JSON.stringify(marioGame, null, 2);

console.log(marioJson);
console.log(prettyMarioJson);

// Add a breakpoint here to inspect the JSON values in the browser debugger.
console.log(JSON.parse(marioJson));
