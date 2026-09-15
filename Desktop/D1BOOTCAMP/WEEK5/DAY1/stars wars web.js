const characterButton = document.querySelector('#character-button');
const characterCard = document.querySelector('#character-card');

const showMessage = (message, className = '') => {
	characterCard.className = `character-card ${className}`;
	characterCard.innerHTML = message;
};

const getRandomCharacterId = () => Math.floor(Math.random() * 83) + 1;

const getCharacter = async (id) => {
	const response = await fetch(`https://www.swapi.tech/api/people/${id}`);
	if (!response.ok) {
		throw new Error('Unable to retrieve character');
	}

	return response.json();
};

const getHomeworld = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Unable to retrieve home world');
	}

	const data = await response.json();
	return data.result.properties.name;
};

const displayCharacter = async () => {
	showMessage('<i class="fa-solid fa-spinner fa-spin"></i><p>Loading...</p>', 'loading');
	characterButton.disabled = true;

	try {
		const character = await getCharacter(getRandomCharacterId());
		const properties = character.result.properties;
		const homeworld = await getHomeworld(properties.homeworld);

		characterCard.className = 'character-card';
		characterCard.innerHTML = `
			<h2>${properties.name}</h2>
			<dl>
				<div><dt>Height</dt><dd>${properties.height} cm</dd></div>
				<div><dt>Gender</dt><dd>${properties.gender}</dd></div>
				<div><dt>Birth Year</dt><dd>${properties.birth_year}</dd></div>
				<div><dt>Home World</dt><dd>${homeworld}</dd></div>
			</dl>
		`;
	} catch (error) {
		showMessage('<i class="fa-solid fa-triangle-exclamation"></i><p>Oh No! That person isn’t available.</p>', 'error');
	} finally {
		characterButton.disabled = false;
	}
};

characterButton.addEventListener('click', displayCharacter);
