// Exercise 1:
const giphyUrl =
	"https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";

async function displayRandomGif() {
	try {
		const response = await fetch(giphyUrl);

		if (!response.ok) {
			throw new Error(`Giphy request failed: ${response.status}`);
		}

		const giphyData = await response.json();
		const randomGif = giphyData.data[Math.floor(Math.random() * giphyData.data.length)];
		const gifImage = document.createElement("img");

		gifImage.src = randomGif.images.original.url;
		gifImage.alt = randomGif.title;
		document.body.appendChild(gifImage);
	} catch (error) {
		console.error("Exercise 1:", error);
	}
}

displayRandomGif();

// Exercise 2:
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

async function sequentialStart() {
	console.log("==SEQUENTIAL START==");
	const slow = await resolveSlowPromise();
	console.log(slow);
	const fast = await resolveFastPromise();
	console.log(fast);
}

// Output order: start, slow promise messages, slow, fast promise messages, fast.
sequentialStart();

// Exercise 3:
async function concurrentStart() {
	console.log("==CONCURRENT START with await==");
	const slow = resolveSlowPromise();
	const fast = resolveFastPromise();

	console.log(await slow);
	console.log(await fast);
}

// The concurrent section starts four seconds after this script begins.
setTimeout(concurrentStart, 4000);

// Exercise 4: 
const urls = [
	"https://jsonplaceholder.typicode.com/users",
	"https://jsonplaceholder.typicode.com/posts",
	"https://jsonplaceholder.typicode.com/invalid-endpoint"
];

async function getJson(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status}`);
	}

	return response.json();
}

async function getData() {
	try {
		const [users, posts, albums] = await Promise.all(urls.map(getJson));

		console.log("users", users);
		console.log("posts", posts);
		console.log("albums", albums);
	} catch (error) {
		console.log("ooooooops");
		console.error("Exercise 4:", error);
	}
}

getData();
