// Exercise 1 :
function isBlank(str) {
  return str.length === 0;
}

console.log(isBlank(''));
console.log(isBlank('abc'));

// Exercise 2 : 
function abbrevName(name) {
  const parts = name.split(' ');
  return `${parts[0]} ${parts[1][0]}.`;
}

console.log(abbrevName('Robin Singh'));

// Exercise 3 : 
function swapCase(str) {
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      result += char.toLowerCase();
    } else {
      result += char.toUpperCase();
    }
  }

  return result;
}

console.log(swapCase('The Quick Brown Fox'));

// Exercise 4 : 
function isOmnipresent(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].includes(value)) {
      return false;
    }
  }
  return true;
}

console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 1));
console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 6));

// Exercise 5 :
if (typeof document !== 'undefined') {
  let table = document.body.firstElementChild;
  let rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].cells.length; j++) {
      if (i === j) {
        rows[i].cells[j].style.backgroundColor = 'red';
      }
    }
  }
}

console.log('DOM-based diagonal coloring code is ready for the provided HTML table.');
