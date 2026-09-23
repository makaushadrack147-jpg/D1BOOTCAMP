"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapType(value) {
    if (typeof value === "number") {
        return (value * value);
    }
    return value.length;
}
console.log(mapType(5));
console.log(mapType("TypeScript"));
// Exercise 2:
function getProperty(object, key) {
    return object[key];
}
const book = {
    title: "TypeScript Basics",
    pages: 120,
};
console.log(getProperty(book, "title"));
console.log(getProperty(book, "pages"));
function multiplyProperty(object, key, factor) {
    const value = object[key];
    if (value === undefined) {
        throw new Error(`Property ${String(key)} does not contain a number.`);
    }
    return value * factor;
}
const dimensions = { width: 10, height: 5 };
const scores = { first: 8, second: 12 };
console.log(multiplyProperty(dimensions, "width", 3));
console.log(multiplyProperty(scores, "second", 2));
//# sourceMappingURL=exercise%20xp%20ninja.js.map