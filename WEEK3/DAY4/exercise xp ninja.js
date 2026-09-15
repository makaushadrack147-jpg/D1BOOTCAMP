const mergeWords = word => nextWord => {
	if (nextWord === undefined) {
		return word;
	}

	return mergeWords(`${word} ${nextWord}`);
};

console.log(mergeWords("Hello")());
console.log(mergeWords("There")("is")("no")("spoon.")());
