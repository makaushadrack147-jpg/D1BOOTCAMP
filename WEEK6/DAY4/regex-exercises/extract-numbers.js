function returnNumbers(text) {
  return text.match(/\d/g)?.join("") ?? "";
}

console.log(returnNumbers("k5k3q2g5z6x9bn"));

module.exports = returnNumbers;
