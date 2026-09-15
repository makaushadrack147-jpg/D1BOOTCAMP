// Exercise 1:
const person = {
	name: 'John Doe',
	age: 25,
	location: {
		country: 'Canada',
		city: 'Vancouver',
		coordinates: [49.2827, -123.1207]
	}
};

const {
	name,
	location: { country, city, coordinates: [lat, lng] }
} = person;

console.log(`I am ${name} from ${city}, ${country}. Latitude(${lat}), Longitude(${lng})`);

// Exercise 2: 
function displayStudentInfo({ first, last }) {
	return `Your full name is ${first} ${last}`;
}

console.log(displayStudentInfo({ first: 'Elie', last: 'Schoppik' }));

// Exercise 3: 
const users = { user1: 18273, user2: 92833, user3: 90315 };
const userEntries = Object.entries(users);
const doubledUserEntries = userEntries.map(([user, id]) => [user, id * 2]);

console.log(userEntries);
console.log(doubledUserEntries);

// Exercise 4:
class Person {
	constructor(personName) {
		this.name = personName;
	}
}

const member = new Person('John');
console.log(typeof member); // object

// Exercise 5:
class Dog {
	constructor(dogName) {
		this.name = dogName;
	}
}

class Labrador extends Dog {
	constructor(dogName, size) {
		super(dogName);
		this.size = size;
	}
}

console.log('The successful Dog constructor is option 2.');

// Exercise 6.1: 
console.log(false); // [2] === [2]
console.log(false); // {} === {}

// Exercise 6.2:
const object1 = { number: 5 };
const object2 = object1;
const object3 = object2;
const object4 = { number: 5 };

object1.number = 4;

console.log(object2.number); // 4
console.log(object3.number); // 4
console.log(object4.number); // 5

// Exercise 6.3: 
class Animal {
	constructor(animalName, animalType, animalColor) {
		this.name = animalName;
		this.type = animalType;
		this.color = animalColor;
	}
}

class Mammal extends Animal {
	sound(animalSound) {
		return `${animalSound} I'm a ${this.type}, named ${this.name} and I'm ${this.color}`;
	}
}

const farmerCow = new Mammal('Lily', 'cow', 'brown and white');
console.log(farmerCow.sound('Moooo'));
