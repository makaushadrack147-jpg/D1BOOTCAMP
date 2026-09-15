// Exercise 1:
const container = document.getElementById('container');

setTimeout(() => {
  alert('Hello World');
}, 2000);

setTimeout(() => {
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Hello World';
  container.appendChild(paragraph);
}, 2000);

let intervalId = setInterval(() => {
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Hello World';
  container.appendChild(paragraph);

  if (container.children.length >= 5) {
    clearInterval(intervalId);
  }
}, 2000);

const clearButton = document.getElementById('clear');
if (clearButton) {
  clearButton.addEventListener('click', () => {
    clearInterval(intervalId);
  });
}

// Exercise 2:
function myMove() {
  const animate = document.getElementById('animate');
  const containerBox = document.getElementById('container');
  let position = 0;

  const timer = setInterval(() => {
    if (position >= containerBox.clientWidth - animate.clientWidth) {
      clearInterval(timer);
      return;
    }

    position += 1;
    animate.style.left = `${position}px`;
  }, 1);
}
