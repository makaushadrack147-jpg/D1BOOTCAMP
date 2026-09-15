// Exercise 1:

// Display the value of the selected option
let genreSelect = document.getElementById('genres');
let selectedGenreDisplay = document.getElementById('selectedGenre');

// Display initial selected value
selectedGenreDisplay.textContent = genreSelect.value;

// Update display when selection changes
genreSelect.addEventListener('change', function() {
    selectedGenreDisplay.textContent = this.value;
});


// Exercise 2:

function removecolor() {
    let colorSelect = document.getElementById('colorSelect');
    let selectedIndex = colorSelect.selectedIndex;
    
    // Remove the selected option
    if (selectedIndex !== -1) {
        colorSelect.remove(selectedIndex);
    }
}

// Add click event listener to the button
let colorForm = document.getElementById('colorForm');
let removeButton = colorForm.querySelector('input[type="button"]');
removeButton.addEventListener('click', removecolor);


// Exercise 3:

let shoppingList = [];
let root = document.getElementById('root');

// Create form with input and button
let form = document.createElement('form');
form.id = 'shoppingForm';

let input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter item to buy...';
input.id = 'itemInput';

let addButton = document.createElement('input');
addButton.type = 'button';
addButton.value = 'AddItem';
addButton.addEventListener('click', addItem);

let clearButton = document.createElement('input');
clearButton.type = 'button';
clearButton.value = 'ClearAll';
clearButton.addEventListener('click', clearAll);

// Add elements to form
form.appendChild(input);
form.appendChild(addButton);
form.appendChild(clearButton);

// Add form to DOM
root.appendChild(form);

// Create a list to display shopping items
let shoppingListUL = document.createElement('ul');
shoppingListUL.id = 'shoppingListUL';
root.appendChild(shoppingListUL);

// Function to add item to shopping list
function addItem() {
    let input = document.getElementById('itemInput');
    let item = input.value.trim();
    
    if (item !== '') {
        shoppingList.push(item);
        input.value = ''; // Clear input field
        displayList();
    } else {
        alert('Please enter an item');
    }
}

// Function to clear all items
function clearAll() {
    shoppingList = [];
    displayList();
}

// Function to display the shopping list
function displayList() {
    let shoppingListUL = document.getElementById('shoppingListUL');
    shoppingListUL.innerHTML = ''; // Clear previous list
    
    shoppingList.forEach((item, index) => {
        let li = document.createElement('li');
        li.textContent = (index + 1) + '. ' + item;
        shoppingListUL.appendChild(li);
    });
}
