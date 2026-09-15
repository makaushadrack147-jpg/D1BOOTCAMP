const params = new URLSearchParams(window.location.search);
const name = params.get('name') || '';
const lastName = params.get('lastname') || '';

const submittedData = document.querySelector('#submitted-data');
const message = document.createElement('p');
message.textContent = `Hello ${name} ${lastName}`;
submittedData.appendChild(message);
