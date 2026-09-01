// Exercise 1: 
const randomNumber = Math.floor(Math.random() * 100) + 1;
console.log("Random number:", randomNumber);

for (let i = 0; i <= randomNumber; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}

// Exercise 2:
function capitalize(string) {
  let even = "";
  let odd = "";

  for (let i = 0; i < string.length; i++) {
    if (i % 2 === 0) {
      even += string[i].toUpperCase();
      odd += string[i].toLowerCase();
    } else {
      even += string[i].toLowerCase();
      odd += string[i].toUpperCase();
    }
  }

  return [even, odd];
}

console.log(capitalize("abcdef"));

// Exercise 3: 
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}

console.log(isPalindrome("madam"));
console.log(isPalindrome("hello"));

// Exercise 4:
function biggestNumberInArray(arrayNumber) {
  if (!Array.isArray(arrayNumber) || arrayNumber.length === 0) {
    return 0;
  }

  let biggest = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < arrayNumber.length; i++) {
    const current = Number(arrayNumber[i]);
    if (!isNaN(current) && current > biggest) {
      biggest = current;
    }
  }

  return biggest === Number.NEGATIVE_INFINITY ? 0 : biggest;
}

console.log(biggestNumberInArray([-1, 0, 3, 100, 99, 2, 99]));
console.log(biggestNumberInArray(['a', 3, 4, 2]));
console.log(biggestNumberInArray([]));

// Exercise 5: 
function uniqueElements(array) {
  const unique = [];

  for (let i = 0; i < array.length; i++) {
    let isDuplicate = false;

    for (let j = 0; j < unique.length; j++) {
      if (array[i] === unique[j]) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      unique.push(array[i]);
    }
  }

  return unique;
}

console.log(uniqueElements([1, 2, 3, 3, 3, 3, 4, 5]));

// Exercise 6:
function createCalendar(year, month) {
  if (typeof document === 'undefined') {
    console.log('Calendar requires the DOM. Skipping browser-only creation.');
    return;
  }

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const headerRow = document.createElement('tr');

  weekdays.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  let row = document.createElement('tr');
  let dayCount = 1;

  for (let i = 0; i < 42; i++) {
    const cell = document.createElement('td');

    if (i < firstDayIndex || dayCount > daysInMonth) {
      cell.textContent = '';
    } else {
      cell.textContent = dayCount;
      dayCount++;
    }

    row.appendChild(cell);

    if ((i + 1) % 7 === 0) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  document.body.appendChild(table);

  return table;
}

console.log('Calendar function ready for browser use.');
