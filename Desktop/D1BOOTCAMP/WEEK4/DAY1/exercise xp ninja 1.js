// Exercise 1: 
const data = [
	{ name: "Butters", age: 3, type: "dog" },
	{ name: "Cuty", age: 5, type: "rabbit" },
	{ name: "Lizzy", age: 6, type: "dog" },
	{ name: "Red", age: 1, type: "cat" },
	{ name: "Joey", age: 3, type: "dog" },
	{ name: "Rex", age: 10, type: "dog" },
];

let dogAgeSum = 0;

for (const animal of data) {
	if (animal.type === "dog") {
		dogAgeSum += animal.age * 7;
	}
}

console.log(dogAgeSum);

const dogAgeSumWithReduce = data.reduce(
	(total, animal) =>
		animal.type === "dog" ? total + animal.age * 7 : total,
	0,
);
console.log(dogAgeSumWithReduce);

// Exercise 2: 
const userEmail3 = " cannotfillemailformcorrectly@gmail.com ";
const cleanedEmail = userEmail3.trim();
console.log(cleanedEmail);

// Exercise 3: 
const users = [
	{ firstName: "Bradley", lastName: "Bouley", role: "Full Stack Resident" },
	{ firstName: "Chloe", lastName: "Alnaji", role: "Full Stack Resident" },
	{ firstName: "Jonathan", lastName: "Baughn", role: "Enterprise Instructor" },
	{ firstName: "Michael", lastName: "Herman", role: "Lead Instructor" },
	{ firstName: "Robert", lastName: "Hajek", role: "Full Stack Resident" },
	{ firstName: "Wes", lastName: "Reid", role: "Instructor" },
	{ firstName: "Zach", lastName: "Klabunde", role: "Instructor" },
];

const usersByFullName = {};

for (const user of users) {
	usersByFullName[`${user.firstName} ${user.lastName}`] = user.role;
}

console.log(usersByFullName);

// Exercise 4: Array to Object
const letters = ["x", "y", "z", "z"];
const letterCountsWithLoop = {};

for (const letter of letters) {
	letterCountsWithLoop[letter] = (letterCountsWithLoop[letter] || 0) + 1;
}

console.log(letterCountsWithLoop);

const letterCountsWithReduce = letters.reduce((counts, letter) => {
	counts[letter] = (counts[letter] || 0) + 1;
	return counts;
}, {});

console.log(letterCountsWithReduce);
