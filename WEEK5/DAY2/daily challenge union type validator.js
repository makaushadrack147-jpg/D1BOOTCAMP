"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateUnionType(value, allowedTypes) {
    return allowedTypes.includes(typeof value);
}
const userName = "Alice";
const userAge = 25;
const isActive = true;
console.log(validateUnionType(userName, ["string", "number"]));
console.log(validateUnionType(userAge, ["string", "number"]));
console.log(validateUnionType(isActive, ["string", "number"]));
true;
true;
false;
//# sourceMappingURL=daily%20challenge%20union%20type%20validator.js.map