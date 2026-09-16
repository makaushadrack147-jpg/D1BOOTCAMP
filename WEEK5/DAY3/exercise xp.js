"use strict";
//exercise 1:
Object.defineProperty(exports, "__esModule", { value: true });
class Employee {
    name;
    salary;
    position;
    department;
    constructor(name, salary, position, department) {
        this.name = name;
        this.salary = salary;
        this.position = position;
        this.department = department;
    }
    getEmployeeInfo() {
        return `Name: ${this.name}, Position: ${this.position}`;
    }
}
const employee1 = new Employee("John", 50000, "Software Developer", "IT");
console.log(employee1.getEmployeeInfo());
console.log(employee1.position);
//exercise 2:
class Product {
    id;
    name;
    price;
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    getProductInfo() {
        return `${this.name} costs $${this.price}`;
    }
}
const product1 = new Product(101, "Laptop", 800);
console.log(product1.getProductInfo());
console.log("Product ID:", product1.id);
//exercise 3:
class Animal {
    name;
    constructor(name) {
        this.name = name;
    }
    makeSound() {
        return "Some animal sound";
    }
}
class Dog extends Animal {
    makeSound() {
        return "Bark";
    }
}
const dog1 = new Dog("Buddy");
console.log("Dog name:", dog1.name);
console.log("Dog sound:", dog1.makeSound());
//exercise 4:
class Calculator {
    static add(a, b) {
        return a + b;
    }
    static subtract(a, b) {
        return a - b;
    }
}
console.log("Addition:", Calculator.add(10, 5));
console.log("Subtraction:", Calculator.subtract(10, 5));
function printUserDetails(user) {
    console.log("ID:", user.id);
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    if (user.membershipLevel) {
        console.log("Membership Level:", user.membershipLevel);
    }
}
const user1 = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    membershipLevel: "Gold"
};
printUserDetails(user1);
//# sourceMappingURL=exercise%20xp.js.map