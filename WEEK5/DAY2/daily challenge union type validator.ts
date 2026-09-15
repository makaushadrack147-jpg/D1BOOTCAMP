function validateUnionType(value: any, allowedTypes: string[]): boolean {
	return allowedTypes.includes(typeof value);
}

const userName = "Alice";
const userAge = 25;
const isActive = true;

console.log(validateUnionType(userName, ["string", "number"]));
console.log(validateUnionType(userAge, ["string", "number"]));
console.log(validateUnionType(isActive, ["string", "number"]));
true
true
false