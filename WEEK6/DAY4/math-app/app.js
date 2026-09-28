const _ = require("lodash");
const { add, multiply } = require("./math");

const numbers = [4, 6];
console.log(`Addition: ${add(...numbers)}`);
console.log(`Multiplication: ${multiply(...numbers)}`);
console.log(`Lodash sum: ${_.sum(numbers)}`);
