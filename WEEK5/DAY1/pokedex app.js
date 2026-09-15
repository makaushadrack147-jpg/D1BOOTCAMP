const pokemonButton = document.querySelector('#random-pokemon');
const previousButton = document.querySelector('#previous-pokemon');
const nextButton = document.querySelector('#next-pokemon');
const pokemonDisplay = document.querySelector('#pokemon-display');
const pokemonStatus = document.querySelector('#pokemon-status');

let currentPokemonId = 1;
const totalPokemon = 1025;

const setStatus = (message, type = '') => {
	pokemonStatus.className = `status ${type}`;
	pokemonStatus.innerHTML = message;
};

const getPokemon = async (id) => {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
	if (!response.ok) {
		throw new Error('Pokemon unavailable');
	}

	return response.json();
};

const displayPokemon = async (id) => {
	setStatus('<i class="fa-solid fa-spinner fa-spin"></i> Loading...', 'loading');
	pokemonDisplay.classList.add('is-loading');
	pokemonButton.disabled = true;
	previousButton.disabled = true;
	nextButton.disabled = true;

	try {
		const pokemon = await getPokemon(id);
		currentPokemonId = pokemon.id;
		const types = pokemon.types.map(({ type }) => type.name).join(' / ');
		const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

		pokemonDisplay.innerHTML = `
			<div class="pokemon-artwork"><img src="${image}" alt="${pokemon.name}"></div>
			<p class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</p>
			<h1>${pokemon.name}</h1>
			<p class="pokemon-type">${types}</p>
			<div class="pokemon-stats">
				<div><span>Height</span><strong>${pokemon.height / 10} m</strong></div>
				<div><span>Weight</span><strong>${pokemon.weight / 10} kg</strong></div>
			</div>
		`;
		setStatus('Pokemon found', 'success');
	} catch (error) {
		setStatus('<i class="fa-solid fa-triangle-exclamation"></i> Oh no! That Pokemon isn’t available...', 'error');
	} finally {
		pokemonDisplay.classList.remove('is-loading');
		pokemonButton.disabled = false;
		previousButton.disabled = currentPokemonId <= 1;
		nextButton.disabled = currentPokemonId >= totalPokemon;
	}
};

pokemonButton.addEventListener('click', () => {
	displayPokemon(Math.floor(Math.random() * totalPokemon) + 1);
});

previousButton.addEventListener('click', () => {
	if (currentPokemonId > 1) displayPokemon(currentPokemonId - 1);
});

nextButton.addEventListener('click', () => {
	if (currentPokemonId < totalPokemon) displayPokemon(currentPokemonId + 1);
});
