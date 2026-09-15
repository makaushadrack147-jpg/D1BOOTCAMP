const groceries = {
    fruits: ['pear', 'apple', 'banana'],
    vegetables: ['tomatoes', 'cucumber', 'salad'],
    totalPrice: '20$',
    other: {
        paid: true,
        meansOfPayment: ['cash', 'creditCard']
    }
};

const fruitList = document.querySelector('#fruit-list');
const fruitCount = document.querySelector('#fruit-count');
const cloneButton = document.querySelector('#clone-button');
const groceriesOutput = document.querySelector('#groceries-output');
const shoppingOutput = document.querySelector('#shopping-output');
const lesson = document.querySelector('#lesson');

function displayGroceries() {
    groceries.fruits.forEach((fruit) => {
        const item = document.createElement('li');
        item.textContent = fruit;
        fruitList.appendChild(item);
    });
    fruitCount.textContent = `${groceries.fruits.length} fruits`;
}

function cloneGroceries() {
    const shopping = groceries;
    shopping.totalPrice = '35$';
    shopping.other.paid = false;

    groceriesOutput.textContent = JSON.stringify(groceries, null, 2);
    shoppingOutput.textContent = JSON.stringify(shopping, null, 2);
    lesson.textContent = 'Both objects changed because shopping references groceries.';
}

cloneButton.addEventListener('click', cloneGroceries);
displayGroceries();
