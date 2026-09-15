// Exercise 1: 

const people = ["Greg", "Mary", "Devon", "James"];

// Part I

// 1. Remove "Greg"
people.shift();

console.log(people);

// 2. Replace "James" with "Jason"
people[2] = "Jason";

console.log(people);

// 3. Add your name to the end
people.push("Shadrack");

console.log(people);

// 4. Find Mary's index
console.log(people.indexOf("Mary"));

// 5. Make a copy without Mary or your name
const copy = people.slice(1, 3);

console.log(copy);

// 6. Find the index of "Foo"
console.log(people.indexOf("Foo"));
// Returns -1 because "Foo" is not in the array.

// 7. Create a variable called last
const last = people[people.length - 1];

console.log(last);


// Part II - Loops

// 1. Print each person
for (let person of people) {
    console.log(person);
}

// 2. Stop after printing "Devon"
for (let person of people) {
    console.log(person);

    if (person === "Devon") {
        break;
    }
}


// Exercise 2:

// 1. Create an array of favorite colors
const colors = ["blue", "green", "purple", "orange", "red"];

// 2. Loop and console.log with index
console.log("\n--- Basic Version ---");
for (let i = 0; i < colors.length; i++) {
    console.log(`My #${i + 1} choice is ${colors[i]}`);
}

// 3. Bonus: Use ordinal suffixes (1st, 2nd, 3rd, 4th, 5th)
console.log("\n--- Bonus Version with Ordinal Suffixes ---");
const suffixes = ["st", "nd", "rd", "th", "th"];

for (let i = 0; i < colors.length; i++) {
    console.log(`My ${i + 1}${suffixes[i]} choice is ${colors[i]}`);
}

// Exercise 3:
console.log("\n--- Exercise 3: Repeat the question ---");
console.log("Note: prompt() works in browsers. Here's a Node.js demonstration:\n");

// Demonstration of do...while loop (more relevant for this exercise)
console.log("Example 1: Using do...while (ask at least once)");
let testNum = 5;
let iterations = 0;

do {
    console.log(`  Number: ${testNum} (type: ${typeof testNum})`);
    if (testNum < 10) {
        testNum += 2;  // Simulate new input
        iterations++;
    }
} while (testNum < 10);

console.log(`  Final number: ${testNum} - Loop ended!\n`);

// Alternative using while loop
console.log("Example 2: Using regular while loop");
testNum = 3;

console.log(`  Number: ${testNum} (type: ${typeof testNum})`);
while (testNum < 10) {
    testNum += 3;  // Simulate new input
    console.log(`  Number: ${testNum} (type: ${typeof testNum})`);
}
console.log(`  Final number: ${testNum} - Loop ended!`);


// Exercise 4:

const building = {
    numberOfFloors: 4,
    numberOfAptByFloor: {
        firstFloor: 3,
        secondFloor: 4,
        thirdFloor: 9,
        fourthFloor: 2,
    },
    nameOfTenants: ["Sarah", "Dan", "David"],
    numberOfRoomsAndRent: {
        sarah: [3, 990],
        dan: [4, 1000],
        david: [1, 500],
    },
};

// 2. Console.log the number of floors
console.log(building.numberOfFloors);

// 3. Console.log apartments on floors 1 and 3
console.log(building.numberOfAptByFloor.firstFloor);
console.log(building.numberOfAptByFloor.thirdFloor);

// 4. Second tenant's name and number of rooms
console.log(building.nameOfTenants[1]);
console.log(building.numberOfRoomsAndRent.dan[0]);

// 5. Check the rents
if (building.numberOfRoomsAndRent.sarah[1] +
    building.numberOfRoomsAndRent.david[1] >
    building.numberOfRoomsAndRent.dan[1]) {

    building.numberOfRoomsAndRent.dan[1] = 1200;
}

console.log(building.numberOfRoomsAndRent.dan[1]);


// Exercise 5: 

// 1. Create a family object
const family = {
    father: "John",
    mother: "Mary",
    brother: "David",
    sister: "Sarah"
};

// 2. Print the keys
for (let key in family) {
    console.log(key);
}

// 3. Print the values
for (let key in family) {
    console.log(family[key]);
}


// Exercise 6:
const details = {
    my: "name",
    is: "Rudolf",
    the: "reindeer"
};

let sentence = "";

for (let key in details) {
    sentence += details[key] + " ";
}


//exercise 7:

const names = ["Jack", "Philip", "Sarah", "Amanda", "Bernard", "Kyle"];

// Get the first letter of each name
let letters = [];

for (let name of names) {
    letters.push(name[0]);
}

// Sort the letters alphabetically
letters.sort();

// Turn the letters into a string
let secretName = letters.join("");

console.log(secretName);

