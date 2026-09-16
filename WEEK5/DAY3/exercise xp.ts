//exercise 1:

class Employee {
    private name: string;
    private salary: number;
    public position: string;
    protected department: string;

    constructor(
        name: string,
        salary: number,
        position: string,
        department: string
    ) {
        this.name = name;
        this.salary = salary;
        this.position = position;
        this.department = department;
    }

    public getEmployeeInfo(): string {
        return `Name: ${this.name}, Position: ${this.position}`;
    }
}

const employee1 = new Employee(
    "John",
    50000,
    "Software Developer",
    "IT"
);

console.log(employee1.getEmployeeInfo());
console.log(employee1.position);

//exercise 2:
class Product {
    readonly id: number;
    public name: string;
    public price: number;

    constructor(id: number, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public getProductInfo(): string {
        return `${this.name} costs $${this.price}`;
    }
}

const product1 = new Product(101, "Laptop", 800);

console.log(product1.getProductInfo());
console.log("Product ID:", product1.id);

//exercise 3:

class Animal {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    public makeSound(): string {
        return "Some animal sound";
    }
}

class Dog extends Animal {

    public makeSound(): string {
        return "Bark";
    }
}

const dog1 = new Dog("Buddy");

console.log("Dog name:", dog1.name);
console.log("Dog sound:", dog1.makeSound());
//exercise 4:

class Calculator {

    static add(a: number, b: number): number {
        return a + b;
    }

    static subtract(a: number, b: number): number {
        return a - b;
    }
}

console.log("Addition:", Calculator.add(10, 5));
console.log("Subtraction:", Calculator.subtract(10, 5));

//exercise 5:
interface User {
    readonly id: number;
    name: string;
    email: string;
}

interface PremiumUser extends User {
    membershipLevel?: string;
}

function printUserDetails(user: PremiumUser): void {
    console.log("ID:", user.id);
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    
    if (user.membershipLevel) {
        console.log("Membership Level:", user.membershipLevel);
    }
}

const user1: PremiumUser = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    membershipLevel: "Gold"
};

printUserDetails(user1);