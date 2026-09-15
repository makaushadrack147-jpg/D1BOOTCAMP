// Exercise 1: 
const giphySearchUrl =
	"https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";

fetch(giphySearchUrl)
	.then(response => {
		if (!response.ok) {
			throw new Error(`Giphy request failed: ${response.status}`);
		}
		return response.json();
	})
	.then(giphyData => console.log("Exercise 1:", giphyData))
	.catch(error => console.error("Exercise 1:", error));

// Exercise 2:
const sunGiphySearchUrl =
	"https://api.giphy.com/v1/gifs/search?q=sun&limit=10&offset=2&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";

fetch(sunGiphySearchUrl)
	.then(response => {
		if (!response.ok) {
			throw new Error(`Giphy request failed: ${response.status}`);
		}
		return response.json();
	})
	.then(giphyData => console.log("Exercise 2:", giphyData))
	.catch(error => console.error("Exercise 2:", error));

// Exercise 3
async function getStarship() {
	try {
		const response = await fetch("https://www.swapi.tech/api/starships/9/");

		if (!response.ok) {
			throw new Error(`Starship request failed: ${response.status}`);
		}

		const starWarsObject = await response.json();
		console.log("Exercise 3:", starWarsObject.result);
	} catch (error) {
		console.error("Exercise 3:", error);
	}
}

getStarship();

// Exercise 4: 
function resolveAfter2Seconds() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("resolved");
		}, 2000);
	});
}

async function asyncCall() {
	console.log("Exercise 4: calling");
	const result = await resolveAfter2Seconds();
	console.log("Exercise 4:", result);
}

asyncCall();
