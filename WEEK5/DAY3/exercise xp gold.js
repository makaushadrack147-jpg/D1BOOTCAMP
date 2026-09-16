"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//exercise 1:
class Employee {
    name;
    salary;
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
    getDetails() {
        return `Name: ${this.name}, Salary: ${this.salary}`;
    }
}
class Manager extends Employee {
    department;
    constructor(name, salary, department) {
        super(name, salary);
        this.department = department;
    }
    getDetails() {
        return `Name: ${this.name}, Salary: ${this.salary}, Department: ${this.department}`;
    }
}
const manager = new Manager("John", 80000, "IT");
console.log(manager.getDetails());
//exercise 2:
class Car {
    make;
    model;
    year;
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    getCarDetails() {
        return `Make: ${this.make}, Model: ${this.model}, Year: ${this.year}`;
    }
}
const car = new Car("Toyota", "Corolla", 2022);
console.log(car.getCarDetails(), car.year = 2025);
console.log(car.getCarDetails());
//# sourceMappingURL=exercise%20xp%20gold.js.map