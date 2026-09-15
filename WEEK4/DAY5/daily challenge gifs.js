const giphyApiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
const gifForm = document.querySelector("#gif-form");
const categoryInput = document.querySelector("#gif-category");
const gifResults = document.querySelector("#gif-results");
const deleteAllButton = document.querySelector("#delete-all");

async function fetchRandomGif(category) {
	const url = `https://api.giphy.com/v1/gifs/random?tag=${encodeURIComponent(category)}&api_key=${giphyApiKey}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Giphy request failed: ${response.status}`);
	}

	return response.json();
}

gifForm.addEventListener("submit", async event => {
	event.preventDefault();

	try {
		const giphyData = await fetchRandomGif(categoryInput.value.trim());
		const gif = giphyData.data;
		const gifItem = document.createElement("article");
		const gifImage = document.createElement("img");
		const deleteButton = document.createElement("button");

		gifImage.src = gif.images.original.url;
		gifImage.alt = gif.title || categoryInput.value.trim();
		deleteButton.type = "button";
		deleteButton.textContent = "DELETE";
		deleteButton.addEventListener("click", () => gifItem.remove());

		gifItem.append(gifImage, deleteButton);
		gifResults.appendChild(gifItem);
	} catch (error) {
		console.error("Unable to fetch random GIF:", error);
	}
});

deleteAllButton.addEventListener("click", () => {
	gifResults.replaceChildren();
});
