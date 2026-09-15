const sunriseForm = document.querySelector("#sunrise-form");
const sunriseResults = document.querySelector("#sunrise-results");

async function fetchSunrise(latitude, longitude) {
	const url = `https://api.sunrise-sunset.org/json?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}&formatted=0`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Sunrise request failed: ${response.status}`);
	}

	const result = await response.json();

	if (result.status !== "OK") {
		throw new Error(`Sunrise API returned: ${result.status}`);
	}

	return result.results.sunrise;
}

sunriseForm.addEventListener("submit", async event => {
	event.preventDefault();
	sunriseResults.textContent = "Loading sunrise times...";

	const formData = new FormData(sunriseForm);
	const cityOneCoordinates = [
		formData.get("cityOneLatitude"),
		formData.get("cityOneLongitude")
	];
	const cityTwoCoordinates = [
		formData.get("cityTwoLatitude"),
		formData.get("cityTwoLongitude")
	];

	try {
		const [cityOneSunrise, cityTwoSunrise] = await Promise.all([
			fetchSunrise(...cityOneCoordinates),
			fetchSunrise(...cityTwoCoordinates)
		]);

		const cityOneTime = new Date(cityOneSunrise).toLocaleTimeString();
		const cityTwoTime = new Date(cityTwoSunrise).toLocaleTimeString();

		sunriseResults.innerHTML = `
			<p>First city sunrise: ${cityOneTime}</p>
			<p>Second city sunrise: ${cityTwoTime}</p>
		`;
	} catch (error) {
		sunriseResults.textContent = "Unable to retrieve both sunrise times.";
		console.error(error);
	}
});
