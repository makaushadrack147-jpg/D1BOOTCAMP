const colors = ["Blue", "Green", "Violet", "Orange", "Red"];

// Exercise 1:
colors.forEach((color, index) => {
	console.log(`${index + 1}# choice is ${color}.`);
});

console.log(colors.includes("Violet") ? "Yeah" : "No...");

// Exercise 2:
const ordinal = ["th", "st", "nd", "rd"];

colors.forEach((color, index) => {
	const number = index + 1;
	const suffix = number <= 3 ? ordinal[number] : ordinal[0];
	console.log(`${number}${suffix} choice is ${color}.`);
});

// Exercise 3: 
const fruits = ["apple", "orange"];
const vegetables = ["carrot", "potato"];

const result = ["bread", ...vegetables, "chicken", ...fruits];
console.log(result);

const country = "USA";
console.log([...country]);

const newArray = [...[,,]];
console.log(newArray);

// Exercise 4:
const users = [
	{ firstName: "Bradley", lastName: "Bouley", role: "Full Stack Resident" },
	{ firstName: "Chloe", lastName: "Alnaji", role: "Full Stack Resident" },
	{ firstName: "Jonathan", lastName: "Baughn", role: "Enterprise Instructor" },
	{ firstName: "Michael", lastName: "Herman", role: "Lead Instructor" },
	{ firstName: "Robert", lastName: "Hajek", role: "Full Stack Resident" },
	{ firstName: "Wes", lastName: "Reid", role: "Instructor" },
	{ firstName: "Zach", lastName: "Klabunde", role: "Instructor" },
];

const welcomeStudents = users.map((user) => `Hello ${user.firstName}`);
console.log(welcomeStudents);

const fullStackResidents = users.filter(
	(user) => user.role === "Full Stack Resident",
);
console.log(fullStackResidents);

const fullStackResidentLastNames = users
	.filter((user) => user.role === "Full Stack Resident")
	.map((user) => user.lastName);
console.log(fullStackResidentLastNames);

// Exercise 5: 
const epic = ["a", "long", "time", "ago", "in a", "galaxy", "far far", "away"];
const epicSentence = epic.reduce((sentence, word) => `${sentence} ${word}`);
console.log(epicSentence);

// Exercise 6:
const students = [
	{ name: "Ray", course: "Computer Science", isPassed: true },
	{ name: "Liam", course: "Computer Science", isPassed: false },
	{ name: "Jenner", course: "Information Technology", isPassed: true },
	{ name: "Marco", course: "Robotics", isPassed: true },
	{ name: "Kimberly", course: "Artificial Intelligence", isPassed: false },
	{ name: "Jamie", course: "Big Data", isPassed: false },
];

const passedStudents = students.filter((student) => student.isPassed);
console.log(passedStudents);

students
	.filter((student) => student.isPassed)
	.forEach((student) => {
		console.log(
			`Good job ${student.name}, you passed the course in ${student.course}`,
		);
	});
