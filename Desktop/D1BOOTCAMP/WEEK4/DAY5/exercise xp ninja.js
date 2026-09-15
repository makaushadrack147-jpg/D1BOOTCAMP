// Exercise 1: Search for GIFs and remove them from the page.
const giphyApiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
const searchForm = document.querySelector("#gif-search-form");
const categoryInput = document.querySelector("#gif-category");
const resultsContainer = document.querySelector("#gif-results");
const deleteButton = document.querySelector("#delete-gifs");

async function searchGifs(category) {
	const url = `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(category)}&limit=12&api_key=${giphyApiKey}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Giphy request failed: ${response.status}`);
	}

	return response.json();
}

searchForm.addEventListener("submit", async event => {
	event.preventDefault();
	resultsContainer.replaceChildren();

	try {
		const giphyData = await searchGifs(categoryInput.value.trim());

		if (giphyData.data.length === 0) {
			resultsContainer.textContent = "No GIFs found.";
			return;
		}

		giphyData.data.forEach(gif => {
			const image = document.createElement("img");
			image.src = gif.images.original.url;
			image.alt = gif.title;
			resultsContainer.appendChild(image);
		});
	} catch (error) {
		resultsContainer.textContent = "Unable to load GIFs.";
		console.error("Exercise 1:", error);
	}
});

deleteButton.addEventListener("click", () => {
	resultsContainer.replaceChildren();
});

// Exercise 2: Promise.all starts both promises together and logs in array order.
function resolveSlowPromise() {
	console.log("starting slow promise");
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("slow");
			console.log("slow promise is done");
		}, 2000);
	});
}

function resolveFastPromise() {
	console.log("starting fast promise");
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("fast");
			console.log("fast promise is done");
		}, 1000);
	});
}

function concurrentPromise() {
	console.log("==CONCURRENT START with Promise.all==");
	Promise.all([resolveSlowPromise(), resolveFastPromise()]).then(messages => {
		console.log(messages[0]);
		console.log(messages[1]);
	});
}

setTimeout(concurrentPromise, 1000);

// Exercise 3: Two async jobs run in parallel and each logs when it resolves.
async function parallel() {
	console.log("==PARALLEL with await Promise.all==");
	await Promise.all([
		(async () => console.log(await resolveSlowPromise()))(),
		(async () => console.log(await resolveFastPromise()))()
	]);
}

setTimeout(parallel, 5000);

// Exercise 4: Independent .then() handlers log in completion order.
function parallelPromise() {
	console.log("==PARALLEL with Promise.then==");
	resolveSlowPromise().then(message => console.log(message));
	resolveFastPromise().then(message => console.log(message));
}

setTimeout(parallelPromise, 13000);
