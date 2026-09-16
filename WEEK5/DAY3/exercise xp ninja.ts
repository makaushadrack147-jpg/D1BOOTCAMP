//exercise:1
class Employee {
    public name: string;
    private age: number;
    protected salary: number;

    constructor(name: string, age: number, salary: number) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    protected calculateBonus(): number {
        return this.salary * 0.10;
    }

    public getSalaryDetails(): string {
        return `${this.name}'s salary is ${this.salary}`;
    }
}

class Manager extends Employee {

    constructor(name: string, age: number, salary: number) {
        super(name, age, salary);
    }

    public getSalaryDetails(): string {
        const bonus = this.calculateBonus();

        return `${this.name}'s salary is ${this.salary}, bonus is ${bonus}`;
    }
}

class ExecutiveManager extends Manager {

    public approveBudget(amount: number): string {
        return `${this.name} approved a budget of $${amount}`;
    }
}

// Create an object
const executive = new ExecutiveManager(
    "John",
    35,
    50000
);

console.log(executive.name);
console.log(executive.getSalaryDetails());
console.log(executive.approveBudget(100000));

//exercise:2
class Shape {
    static totalShapes: number = 0;

    constructor() {
        Shape.totalShapes++;
    }

    static getType(): string {
        return "Shape";
    }
}

class Circle extends Shape {
    radius: number;

    constructor(radius: number) {
        super();
        this.radius = radius;
    }

    area(): number {
        return Math.PI * this.radius * this.radius;
    }

    static getType(): string {
        return "Circle";
    }
}

class Square extends Shape {
    side: number;

    constructor(side: number) {
        super();
        this.side = side;
    }

    area(): number {
        return this.side * this.side;
    }

    static getType(): string {
        return "Square";
    }
}

//exercise:3
interface Calculator {
    a: number;
    b: number;

    operate(operation: (x: number, y: number) => number): number;
}

class AdvancedCalculator implements Calculator {
    a: number;
    b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    operate(operation: (x: number, y: number) => number): number {
        return operation(this.a, this.b);
    }

    add(): number {
        return this.operate((x, y) => x + y);
    }

    subtract(): number {
        return this.operate((x, y) => x - y);
    }

    multiply(): number {
        return this.operate((x, y) => x * y);
    }
}

const calculator = new AdvancedCalculator(20, 5);

console.log("Addition:", calculator.add());
console.log("Subtraction:", calculator.subtract());
console.log("Multiplication:", calculator.multiply());
//exercise:4
class Device {
    readonly serialNumber: string;

    constructor(serialNumber: string) {
        this.serialNumber = serialNumber;
    }

    getInfo(): string {
        return `Serial Number: ${this.serialNumber}`;
    }
}

class Laptop extends Device {
    model: string;
    price: number;

    constructor(
        serialNumber: string,
        model: string,
        price: number
    ) {
        super(serialNumber);

        this.model = model;
        this.price = price;
    }

    getInfo(): string {
        return `Serial Number: ${this.serialNumber}, Model: ${this.model}, Price: $${this.price}`;
    }
}

const laptop = new Laptop(
    "SN123456",
    "Lenovo ThinkPad",
    1200
);

console.log(laptop.getInfo());
//exercise:5
interface Product {
    readonly name: string;
    price: number;
    discount?: number;
}

interface Electronics extends Product {
    warrantyPeriod: number;
}

class Smartphone implements Electronics {
    readonly name: string;
    price: number;
    discount?: number;
    warrantyPeriod: number;

    constructor(
        name: string,
        price: number,
        warrantyPeriod: number,
        discount?: number
    ) {
        this.name = name;
        this.price = price;
        if (discount !== undefined) {
            this.discount = discount;
        }
        this.warrantyPeriod = warrantyPeriod;
    }

    getFinalPrice(): number {
        if (this.discount !== undefined) {
            return this.price - (this.price * this.discount / 100);
        }

        return this.price;
    }
}

const phone1 = new Smartphone(
    "Samsung Galaxy S25",
    1000,
    24,
    10
);

const phone2 = new Smartphone(
    "iPhone 17",
    1200,
    12
);

console.log(phone1.name);
console.log("Original price:", phone1.price);
if (phone1.discount !== undefined) {
    console.log("Discount:", phone1.discount + "%");
}
console.log("Final price:", phone1.getFinalPrice());
console.log("Warranty:", phone1.warrantyPeriod, "months");

console.log("----------------");

console.log(phone2.name);
console.log("Original price:", phone2.price);
if (phone2.discount !== undefined) {
    console.log("Discount:", phone2.discount + "%");
}
console.log("Final price:", phone2.getFinalPrice());
console.log("Warranty:", phone2.warrantyPeriod, "months");