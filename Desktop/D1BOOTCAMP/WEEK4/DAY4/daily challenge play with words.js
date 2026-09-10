// 1st daily challenge
function makeAllCaps(words) {
	return new Promise((resolve, reject) => {
		if (words.every(word => typeof word === "string")) {
			resolve(words.map(word => word.toUpperCase()));
		} else {
			reject("All items must be strings.");
		}
	});
}

function sortWords(words) {
	return new Promise((resolve, reject) => {
		if (words.length > 4) {
			resolve([...words].sort());
		} else {
			reject("The array must contain more than four words.");
		}
	});
}

makeAllCaps([1, "pear", "banana"])
	.then(arr => sortWords(arr))
	.then(result => console.log(result))
	.catch(error => console.log(error));

makeAllCaps(["apple", "pear", "banana"])
	.then(arr => sortWords(arr))
	.then(result => console.log(result))
	.catch(error => console.log(error));

makeAllCaps(["apple", "pear", "banana", "melon", "kiwi"])
	.then(arr => sortWords(arr))
	.then(result => console.log(result))
	.catch(error => console.log(error));

// 2nd daily challenge
const morse = `{
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "a": ".-",
  "b": "-...",
  "c": "-.-.",
  "d": "-..",
  "e": ".",
  "f": "..-.",
  "g": "--.",
  "h": "....",
  "i": "..",
  "j": ".---",
  "k": "-.-",
  "l": ".-..",
  "m": "--",
  "n": "-.",
  "o": "---",
  "p": ".--.",
  "q": "--.-",
  "r": ".-.",
  "s": "...",
  "t": "-",
  "u": "..-",
  "v": "...-",
  "w": ".--",
  "x": "-..-",
  "y": "-.--",
  "z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-"
}`;

function toJs() {
	return new Promise((resolve, reject) => {
		const morseJS = JSON.parse(morse);

		if (Object.keys(morseJS).length === 0) {
			reject("The Morse object is empty.");
		} else {
			resolve(morseJS);
		}
	});
}

function toMorse(morseJS, input) {
	return new Promise((resolve, reject) => {
		const word = input === undefined ? prompt("Enter a word or sentence:") : input;
		const characters = word.toLowerCase().split("");
		const translation = [];

		for (const character of characters) {
			if (!Object.hasOwn(morseJS, character)) {
				reject(`The character "${character}" is not in the Morse object.`);
				return;
			}
			translation.push(morseJS[character]);
		}

		resolve(translation);
	});
}

function joinWords(morseTranslation) {
	const translation = morseTranslation.join("\n");

	if (typeof document !== "undefined") {
		let output = document.getElementById("morse-output");

		if (!output) {
			output = document.createElement("pre");
			output.id = "morse-output";
			document.body.appendChild(output);
		}

		output.textContent = translation;
	}

	return translation;
}

if (typeof prompt !== "undefined") {
	toJs()
		.then(morseJS => toMorse(morseJS))
		.then(morseTranslation => joinWords(morseTranslation))
		.catch(error => console.log(error));
}
