// Exercise 1 : 
const article = document.querySelector('article');
if (article) {
  const h1 = article.querySelector('h1');
  console.log(h1);

  const lastParagraph = article.querySelectorAll('p');
  if (lastParagraph.length > 0) {
    lastParagraph[lastParagraph.length - 1].remove();
  }

  const h2 = article.querySelector('h2');
  h2.addEventListener('click', () => {
    h2.style.backgroundColor = 'red';
  });

  const h3 = article.querySelector('h3');
  h3.addEventListener('click', () => {
    h3.style.display = 'none';
  });

  const button = document.createElement('button');
  button.textContent = 'Make paragraphs bold';
  button.addEventListener('click', () => {
    const paragraphs = article.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
      paragraph.style.fontWeight = 'bold';
    });
  });
  article.appendChild(button);

  h1.addEventListener('mouseover', () => {
    const randomSize = Math.floor(Math.random() * 101);
    h1.style.fontSize = `${randomSize}px`;
  });

  const secondParagraph = article.querySelectorAll('p')[1];
  if (secondParagraph) {
    secondParagraph.addEventListener('mouseover', () => {
      secondParagraph.style.opacity = '0';
      secondParagraph.style.transition = 'opacity 0.5s ease';
    });
  }
}

// Exercise 2 : 
const form = document.querySelector('form');
if (form) {
  console.log(form);

  const firstNameInput = document.getElementById('fname');
  const lastNameInput = document.getElementById('lname');
  console.log(firstNameInput);
  console.log(lastNameInput);

  const firstNameByName = document.getElementsByName('firstname')[0];
  const lastNameByName = document.getElementsByName('lastname')[0];
  console.log(firstNameByName);
  console.log(lastNameByName);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstNameValue = firstNameInput.value.trim();
    const lastNameValue = lastNameInput.value.trim();

    if (firstNameValue !== '' && lastNameValue !== '') {
      const ul = document.querySelector('.usersAnswer');
      const firstLi = document.createElement('li');
      const secondLi = document.createElement('li');

      firstLi.textContent = firstNameValue;
      secondLi.textContent = lastNameValue;

      ul.appendChild(firstLi);
      ul.appendChild(secondLi);
    }
  });
}

// Exercise 3 : 
let allBoldItems = [];

function getBoldItems() {
  const paragraph = document.querySelector('p');
  allBoldItems = paragraph ? paragraph.querySelectorAll('strong') : [];
}

function highlight() {
  getBoldItems();
  allBoldItems.forEach(item => {
    item.style.color = 'blue';
  });
}

function returnItemsToDefault() {
  getBoldItems();
  allBoldItems.forEach(item => {
    item.style.color = 'black';
  });
}

const sentenceParagraph = document.querySelector('p');
if (sentenceParagraph) {
  sentenceParagraph.addEventListener('mouseover', highlight);
  sentenceParagraph.addEventListener('mouseout', returnItemsToDefault);
}

// Exercise 4 :
const sphereForm = document.getElementById('MyForm');
if (sphereForm) {
  sphereForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const radiusInput = document.getElementById('radius');
    const volumeInput = document.getElementById('volume');
    const radius = Number(radiusInput.value);

    if (!isNaN(radius) && radius >= 0) {
      const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
      volumeInput.value = volume.toFixed(2);
    }
  });
}
