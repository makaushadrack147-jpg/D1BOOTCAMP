//exercise 1:
class Employee {
    protected name: string;
    protected salary: number;

    constructor(name: string, salary: number) {
        this.name = name;
        this.salary = salary;
    }

    getDetails(): string {
        return `Name: ${this.name}, Salary: ${this.salary}`;
    }
}

class Manager extends Employee {
    public department: string;

    constructor(name: string, salary: number, department: string) {
        super(name, salary);
        this.department = department;
    }

    getDetails(): string {
        return `Name: ${this.name}, Salary: ${this.salary}, Department: ${this.department}`;
    }
}

const manager = new Manager("John", 80000, "IT");

console.log(manager.getDetails());

//exercise 2:
class Car {
    public readonly make: string;
    private readonly model: string;
    public year: number;

    constructor(make: string, model: string, year: number) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    getCarDetails(): string {
        return `Make: ${this.make}, Model: ${this.model}, Year: ${this.year}`;
    }
}

const car = new Car("Toyota", "Corolla", 2022);
car.year = 2025;

console.log(car.getCarDetails());

//exercise 3:
class MathUtils {
    static PI: number = 3.14159;

    static circumference(radius: number): number {
        return 2 * MathUtils.PI * radius;
    }
}

const result = MathUtils.circumference(5);

console.log("Circumference:", result);

//exercise4:
interface Operation {
    operate(a: number, b: number): number;
}

class Addition implements Operation {
    operate(a: number, b: number): number {
        return a + b;
    }
}

class Multiplication implements Operation {
    operate(a: number, b: number): number {
        return a * b;
    }
}

const addition = new Addition();
const multiplication = new Multiplication();

console.log("Addition:", addition.operate(10, 5));
console.log("Multiplication:", multiplication.operate(10, 5));

//exercise 5:
interface Shape {
    color: string;
    getArea(): number;
}

interface Rectangle extends Shape {
    readonly width: number;
    readonly height: number;
    getPerimeter(): number;
}

class MyRectangle implements Rectangle {
    color: string;
    readonly width: number;
    readonly height: number;

    constructor(
        color: string,
        width: number,
        height: number
    ) {
        this.color = color;
        this.width = width;
        this.height = height;
    }

    getArea(): number {
        return this.width * this.height;
    }

    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }
}

const rectangle = new MyRectangle("Blue", 10, 5);

console.log("Color:", rectangle.color);
console.log("Width:", rectangle.width);
console.log("Height:", rectangle.height);
console.log("Area:", rectangle.getArea());
console.log("Perimeter:", rectangle.getPerimeter());