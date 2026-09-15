const planets = [
  { name: 'Mercury', color: 'gray', moons: 0 },
  { name: 'Venus', color: 'orange', moons: 0 },
  { name: 'Earth', color: 'blue', moons: 1 },
  { name: 'Mars', color: 'red', moons: 2 },
  { name: 'Jupiter', color: 'brown', moons: 4 },
  { name: 'Saturn', color: 'gold', moons: 3 },
  { name: 'Uranus', color: 'lightblue', moons: 2 },
  { name: 'Neptune', color: 'darkblue', moons: 1 }
];

const section = document.querySelector('.listPlanets');

planets.forEach((planet, index) => {
  const planetDiv = document.createElement('div');
  planetDiv.classList.add('planet');
  planetDiv.classList.add(planet.name.toLowerCase());
  planetDiv.style.backgroundColor = planet.color;
  planetDiv.style.left = `${index * 130}px`;
  planetDiv.textContent = planet.name;

  for (let i = 0; i < planet.moons; i++) {
    const moon = document.createElement('div');
    moon.classList.add('moon');
    moon.style.left = `${30 + i * 22}px`;
    moon.style.top = `${30 + (i % 2) * 18}px`;
    planetDiv.appendChild(moon);
  }

  section.appendChild(planetDiv);
});
