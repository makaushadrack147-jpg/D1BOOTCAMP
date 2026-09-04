const paletteColors = [
	{ name: 'Coral', value: '#ef6f61' },
	{ name: 'Sunshine', value: '#f4c95d' },
	{ name: 'Mint', value: '#8ac6a7' },
	{ name: 'Ocean', value: '#63a8c6' },
	{ name: 'Lavender', value: '#a99bd3' },
	{ name: 'Rose', value: '#e99aaf' },
	{ name: 'Ink', value: '#303942' },
	{ name: 'White', value: '#f8f9f7' }
];

const palette = document.querySelector('#palette');
const canvas = document.querySelector('#pixel-canvas');
const clearButton = document.querySelector('#clear-button');
const colorPreview = document.querySelector('#color-preview');
const selectionStatus = document.querySelector('#selection-status');
const paintCount = document.querySelector('#paint-count');

let selectedColor = paletteColors[0];
let isDrawing = false;
let paintedSquares = 0;

function updatePaintCount() {
	paintCount.textContent = `${paintedSquares} square${paintedSquares === 1 ? '' : 's'} painted`;
}

function paintSquare(square) {
	if (square.dataset.color === selectedColor.value) {
		return;
	}

	if (!square.dataset.color) {
		paintedSquares += 1;
	}

	square.dataset.color = selectedColor.value;
	square.style.backgroundColor = selectedColor.value;
	updatePaintCount();
}

function chooseColor(color, swatch) {
	selectedColor = color;
	colorPreview.style.backgroundColor = color.value;
	selectionStatus.textContent = `Selected: ${color.name}`;
	document.querySelectorAll('.swatch').forEach((item) => item.classList.remove('selected'));
	swatch.classList.add('selected');
}

paletteColors.forEach((color, index) => {
	const swatch = document.createElement('button');
	swatch.className = 'swatch';
	swatch.type = 'button';
	swatch.style.backgroundColor = color.value;
	swatch.setAttribute('aria-label', `Choose ${color.name}`);
	swatch.setAttribute('role', 'radio');
	swatch.addEventListener('click', () => chooseColor(color, swatch));
	palette.appendChild(swatch);

	if (index === 0) {
		chooseColor(color, swatch);
	}
});

for (let index = 0; index < 24 * 18; index += 1) {
	const square = document.createElement('button');
	square.className = 'pixel';
	square.type = 'button';
	square.setAttribute('role', 'gridcell');
	square.setAttribute('aria-label', `Canvas square ${index + 1}`);
	square.addEventListener('mousedown', (event) => {
		event.preventDefault();
		isDrawing = true;
		paintSquare(square);
	});
	square.addEventListener('mouseover', () => {
		if (isDrawing) {
			paintSquare(square);
		}
	});
	canvas.appendChild(square);
}

document.addEventListener('mouseup', () => {
	isDrawing = false;
});

clearButton.addEventListener('click', () => {
	document.querySelectorAll('.pixel').forEach((square) => {
		square.style.backgroundColor = '';
		delete square.dataset.color;
	});
	paintedSquares = 0;
	updatePaintCount();
});
