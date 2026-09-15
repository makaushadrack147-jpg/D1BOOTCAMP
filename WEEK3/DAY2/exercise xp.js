
// Exercise 1 :
function displayNumbersDivisible(divisor = 23) {
  let sum = 0;
  const divisibleNumbers = [];

  for (let i = 0; i <= 500; i++) {
    if (i % divisor === 0) {
      divisibleNumbers.push(i);
      sum += i;
      console.log(i);
    }
  }

  console.log("Sum :", sum);
  return divisibleNumbers;
}

console.log("Exercise 1 - default divisor 23");
displayNumbersDivisible();
console.log("Exercise 1 - bonus divisors");
displayNumbersDivisible(3);
displayNumbersDivisible(45);


// Exercise 2: 

const stock = {
  banana: 6,
  apple: 0,
  pear: 12,
  orange: 32,
  blueberry: 1
};

const prices = {
  banana: 4,
  apple: 2,
  pear: 1,
  orange: 1.5,
  blueberry: 10
};

const shoppingList = ["banana", "orange", "apple"];

function myBill() {
  let total = 0;

  for (let i = 0; i < shoppingList.length; i++) {
    const item = shoppingList[i];

    if (item in stock) {
      if (stock[item] > 0) {
        total += prices[item];
        stock[item] -= 1;
      }
    }
  }

  return total;
}

console.log("Exercise 2");
console.log(myBill());
console.log(stock);


// Exercise 3: 

function changeEnough(itemPrice, amountOfChange) {
  const coinValues = [0.25, 0.1, 0.05, 0.01];
  let total = 0;

  for (let i = 0; i < amountOfChange.length; i++) {
    total += amountOfChange[i] * coinValues[i];
  }

  return total >= itemPrice;
}

console.log("Exercise 3");
console.log(changeEnough(4.25, [25, 20, 5, 0]));
console.log(changeEnough(14.11, [2, 100, 0, 0]));
console.log(changeEnough(0.75, [0, 0, 20, 5]));

// Exercise 4: 

function hotelCost() {
  let nights;

  while (true) {
    nights = Number(prompt("How many nights would you like to stay?"));
    if (!isNaN(nights) && nights > 0) {
      return nights * 140;
    }
    console.log("Please enter a valid number of nights.");
  }
}

function planeRideCost() {
  let destination;

  while (true) {
    destination = prompt("Where are you flying to?");
    if (typeof destination === "string" && destination.trim() !== "") {
      const normalized = destination.trim().toLowerCase();
      if (normalized === "london") return 183;
      if (normalized === "paris") return 220;
      return 300;
    }
    console.log("Please enter a valid destination.");
  }
}

function rentalCarCost() {
  let days;

  while (true) {
    days = Number(prompt("How many days would you like to rent the car?"));
    if (!isNaN(days) && days > 0) {
      let total = days * 40;
      if (days > 10) {
        total *= 0.95;
      }
      return total;
    }
    console.log("Please enter a valid number of days.");
  }
}

function totalVacationCost() {
  if (typeof prompt === "undefined") {
    console.log("Exercise 4 requires a browser prompt. Skipping interactive vacation calculator.");
    return;
  }

  const hotel = hotelCost();
  const plane = planeRideCost();
  const car = rentalCarCost();
  const total = hotel + plane + car;

  console.log("The car cost:", car);
  console.log("The hotel cost:", hotel);
  console.log("The plane tickets cost:", plane);
  console.log("The total vacation cost:", total);

  return total;
}

console.log("Exercise 4");
// totalVacationCost();

// Exercise 5:

if (typeof document !== "undefined") {
  const div = document.getElementById("container");
  console.log(div);

  const allLists = document.querySelectorAll(".list");

  if (allLists.length >= 2) {
    const firstList = allLists[0];
    const secondList = allLists[1];

    const firstPete = firstList.querySelectorAll("li")[1];
    if (firstPete) {
      firstPete.textContent = "Richard";
    }

    const secondListItems = secondList.querySelectorAll("li");
    if (secondListItems.length >= 2) {
      secondListItems[1].remove();
    }

    const firstLiOfEachList = document.querySelectorAll(".list li");
    firstLiOfEachList.forEach((li) => {
      if (li.parentElement === firstList || li.parentElement === secondList) {
        const firstItems = li.parentElement.querySelectorAll("li");
        if (firstItems[0] === li) {
          li.textContent = "Shadrack";
        }
      }
    });

    allLists.forEach((ul) => {
      ul.classList.add("student_list");
    });

    firstList.classList.add("university", "attendance");

    div.style.backgroundColor = "lightblue";
    div.style.padding = "10px";

    const lastLiInFirstList = firstList.querySelectorAll("li");
    const danItem = lastLiInFirstList[lastLiInFirstList.length - 1];
    if (danItem) {
      danItem.style.display = "none";
    }

    const richard = document.querySelector("li:nth-of-type(2)");
    if (richard) {
      richard.style.border = "2px solid black";
    }

    document.body.style.fontSize = "18px";

    if (div.style.backgroundColor === "lightblue") {
      alert("Hello John and Shadrack");
    }
  }
}

// Exercise 6: 

if (typeof document !== "undefined") {
  const navBar = document.getElementById("navBar");
  if (navBar) {
    navBar.setAttribute("id", "socialNetworkNavigation");

    const ul = navBar.querySelector("ul");
    if (ul) {
      const newItem = document.createElement("li");
      const newText = document.createTextNode("Logout");
      newItem.appendChild(newText);
      ul.appendChild(newItem);

      const firstLink = ul.firstElementChild.querySelector("a");
      const lastLink = ul.lastElementChild.querySelector("a");
      console.log(firstLink.textContent);
      console.log(lastLink.textContent);
    }
  }
}


// Exercise 7:

if (typeof document !== "undefined") {
  const section = document.querySelector(".listBooks");
  if (section) {
    const allBooks = [
      {
        title: "Harry Potter",
        author: "J.K. Rowling",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        alreadyRead: true
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        alreadyRead: false
      }
    ];

    allBooks.forEach((book) => {
      const bookDiv = document.createElement("div");
      const titleElement = document.createElement("p");
      const authorElement = document.createElement("p");
      const imageElement = document.createElement("img");

      titleElement.textContent = `${book.title} written by ${book.author}`;
      authorElement.textContent = `Author: ${book.author}`;
      imageElement.src = book.image;
      imageElement.width = 100;

      if (book.alreadyRead) {
        titleElement.style.color = "red";
        authorElement.style.color = "red";
      }

      bookDiv.appendChild(titleElement);
      bookDiv.appendChild(authorElement);
      bookDiv.appendChild(imageElement);
      section.appendChild(bookDiv);
    });
  }
}

console.log("Exercise 5, 6, and 7 are DOM-based and will run in a browser with the matching HTML structure.");
