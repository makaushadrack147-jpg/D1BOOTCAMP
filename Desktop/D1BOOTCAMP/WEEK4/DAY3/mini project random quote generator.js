const quotes = [
	{
		id: 0,
		author: 'Maya Angelou',
		quote: 'You will face many defeats in life, but never let yourself be defeated.',
		likes: 0
	},
	{
		id: 1,
		author: 'Nelson Mandela',
		quote: 'It always seems impossible until it is done.',
		likes: 0
	},
	{
		id: 2,
		author: 'Oscar Wilde',
		quote: 'Be yourself; everyone else is already taken.',
		likes: 0
	},
	{
		id: 3,
		author: 'Maya Angelou',
		quote: 'Try to be a rainbow in someone\'s cloud.',
		likes: 0
	},
	{
		id: 4,
		author: 'Albert Einstein',
		quote: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
		likes: 0
	}
];

let currentQuote = null;
let filteredQuotes = [];
let filteredIndex = -1;

const quoteText = document.querySelector('#quote-text');
const quoteAuthor = document.querySelector('#quote-author');
const quoteStats = document.querySelector('#quote-stats');
const generateButton = document.querySelector('#generate-quote');
const quoteForm = document.querySelector('#quote-form');
const filterForm = document.querySelector('#filter-form');
const filterAuthor = document.querySelector('#filter-author');
const filterStatus = document.querySelector('#filter-status');
const previousButton = document.querySelector('#previous-quote');
const nextButton = document.querySelector('#next-quote');
const charactersWithSpacesButton = document.querySelector('#characters-with-spaces');
const charactersWithoutSpacesButton = document.querySelector('#characters-without-spaces');
const wordCountButton = document.querySelector('#word-count');
const likeButton = document.querySelector('#like-quote');

function displayQuote(quote) {
	currentQuote = quote;
	quoteText.textContent = `"${quote.quote}"`;
	quoteAuthor.textContent = `- ${quote.author}`;
	quoteStats.textContent = `Likes: ${quote.likes}`;
	likeButton.textContent = `Like (${quote.likes})`;
}

function getRandomQuote() {
	if (quotes.length === 0) {
		return null;
	}

	if (quotes.length === 1 || currentQuote === null) {
		return quotes[0];
	}

	const availableQuotes = quotes.filter((quote) => quote.id !== currentQuote.id);
	return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
}

function clearFilter() {
	filteredQuotes = [];
	filteredIndex = -1;
	filterStatus.textContent = '';
	previousButton.disabled = true;
	nextButton.disabled = true;
}

function renderCount(message) {
	quoteStats.textContent = `${message} | Likes: ${currentQuote.likes}`;
}

generateButton.addEventListener('click', () => {
	clearFilter();
	displayQuote(getRandomQuote());
});

quoteForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const formData = new FormData(quoteForm);
	const newQuote = {
		id: quotes.length,
		author: formData.get('author').trim(),
		quote: formData.get('quote').trim(),
		likes: 0
	};

	quotes.push(newQuote);
	quoteForm.reset();
	clearFilter();
	displayQuote(newQuote);
});

filterForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const authorSearch = filterAuthor.value.trim().toLowerCase();
	filteredQuotes = quotes.filter((quote) => quote.author.toLowerCase() === authorSearch);
	filteredIndex = 0;

	if (filteredQuotes.length === 0) {
		filterStatus.textContent = `No quotes found for "${filterAuthor.value.trim()}".`;
		previousButton.disabled = true;
		nextButton.disabled = true;
		return;
	}

	displayQuote(filteredQuotes[filteredIndex]);
	filterStatus.textContent = `${filteredQuotes.length} quote(s) found for ${filteredQuotes[0].author}.`;
	previousButton.disabled = filteredQuotes.length < 2;
	nextButton.disabled = filteredQuotes.length < 2;
});

previousButton.addEventListener('click', () => {
	if (filteredQuotes.length === 0) {
		return;
	}

	filteredIndex = (filteredIndex - 1 + filteredQuotes.length) % filteredQuotes.length;
	displayQuote(filteredQuotes[filteredIndex]);
});

nextButton.addEventListener('click', () => {
	if (filteredQuotes.length === 0) {
		return;
	}

	filteredIndex = (filteredIndex + 1) % filteredQuotes.length;
	displayQuote(filteredQuotes[filteredIndex]);
});

charactersWithSpacesButton.addEventListener('click', () => {
	renderCount(`Characters including spaces: ${currentQuote.quote.length}`);
});

charactersWithoutSpacesButton.addEventListener('click', () => {
	renderCount(`Characters excluding spaces: ${currentQuote.quote.replace(/\s/g, '').length}`);
});

wordCountButton.addEventListener('click', () => {
	const words = currentQuote.quote.trim() === '' ? [] : currentQuote.quote.trim().split(/\s+/);
	renderCount(`Words: ${words.length}`);
});

likeButton.addEventListener('click', () => {
	currentQuote.likes++;
	displayQuote(currentQuote);
});

displayQuote(quotes[0]);
