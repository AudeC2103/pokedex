document.addEventListener('DOMContentLoaded', function() {
  const pokemonList = document.getElementById('pokemon-list'); // Sélectionne l'élément de la liste des Pokémon
  const searchInput = document.getElementById('search'); // Sélectionne le champ de recherche
  const typeFilter = document.getElementById('type-filter'); // Sélectionne le filtre de type
  const toggleFavoritesBtn = document.getElementById('toggle-favorites'); // Sélectionne le bouton de basculement des favoris
  const toggleThemeButton = document.getElementById('toggle-theme'); // Sélectionne le bouton de basculement de thème

  let showFavorites = false; // Indique si seuls les favoris doivent être affichés
  let allPokemons = []; // Stocke tous les Pokémon
  let favoritePokemons = new Set(); // Stocke les Pokémon favoris

  // Récupère les détails des Pokémon depuis l'API
  fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(data => {
      const fetches = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
      return Promise.all(fetches);
    })
    .then(pokemonDetails => {
      allPokemons = pokemonDetails.map(details => ({
        name: details.name,
        url: details.species.url,
        image: details.sprites.front_default,
        types: details.types.map(typeInfo => typeInfo.type.name),
        stats: details.stats // Ajoute les statistiques des Pokémon
      }));

      // Récupère les noms français des Pokémon
      const speciesFetches = allPokemons.map(pokemon => fetch(pokemon.url).then(res => res.json()));
      return Promise.all(speciesFetches);
    })
    .then(speciesDetails => {
      speciesDetails.forEach((species, index) => {
        const frenchName = species.names.find(name => name.language.name === 'fr').name;
        allPokemons[index].frenchName = frenchName;
        allPokemons[index].frenchTypes = allPokemons[index].types.map(type => getTypeInFrench(type));
      });
      displayPokemonList(allPokemons); // Affiche la liste des Pokémon
    });

  // Ajoute des écouteurs d'événements pour la recherche et le filtrage
  searchInput.addEventListener('input', () => filterAndDisplayPokemons());
  typeFilter.addEventListener('change', () => filterAndDisplayPokemons());
  toggleFavoritesBtn.addEventListener('click', () => {
    showFavorites = !showFavorites; // Bascule l'affichage des favoris
    toggleFavoritesBtn.src = showFavorites ? 'assets/allumer.png' : 'assets/eteindre.png'; // Change l'image du bouton
    filterAndDisplayPokemons(); // Filtre et affiche les Pokémon
  });

  // Fonction pour filtrer et afficher les Pokémon
  function filterAndDisplayPokemons() {
    let filteredPokemons = allPokemons.filter(pokemon => {
      const matchesSearch = pokemon.frenchName.toLowerCase().includes(searchInput.value.toLowerCase()); // Vérifie la correspondance avec la recherche
      const matchesType = typeFilter.value === '' || pokemon.frenchTypes.includes(typeFilter.value); // Vérifie la correspondance avec le type en français
      const isFavorite = !showFavorites || favoritePokemons.has(pokemon.name); // Vérifie si le Pokémon est favori
      return matchesSearch && matchesType && isFavorite; // Retourne vrai si toutes les conditions sont remplies
    });
    displayPokemonList(filteredPokemons); // Affiche la liste des Pokémon filtrés
  }

  // Fonction pour afficher la liste des Pokémon
  function displayPokemonList(pokemons) {
    pokemonList.innerHTML = ''; // Vide le contenu actuel de la liste
    pokemons.forEach(pokemon => {
      const listItem = document.createElement('li'); // Crée un élément de liste
      listItem.className = 'pokemon-item'; // Ajoute la classe de style

      // Crée les éléments HTML pour chaque Pokémon
      const nameElement = document.createElement('h2');
      nameElement.textContent = pokemon.frenchName;

      const imageElement = document.createElement('img');
      imageElement.src = pokemon.image;
      imageElement.alt = pokemon.frenchName;

      const typesElement = document.createElement('p');
      typesElement.textContent = pokemon.frenchTypes.join(', ');

      const favoriteStar = document.createElement('div');
      favoriteStar.classList.add('favorite-star');
      // Affichage des images pour les favoris
      favoriteStar.style.backgroundImage = `url('assets/${favoritePokemons.has(pokemon.name) ? 'star-filled' : 'star-empty'}.png')`;

      // Ajoute un gestionnaire de clic pour l'étoile de favoris
      favoriteStar.addEventListener('click', function(event) {
        event.stopPropagation(); // Empêche l'événement de propagation
        if (favoritePokemons.has(pokemon.name)) {
          favoritePokemons.delete(pokemon.name); // Retire des favoris
          this.style.backgroundImage = "url('assets/star-empty.png')"; // Affichage de l'étoile vide après clic
          listItem.classList.remove('favorite-border'); // Retire la bordure de favoris
        } else {
          favoritePokemons.add(pokemon.name); // Ajoute aux favoris
          this.style.backgroundImage = "url('assets/star-filled.png')"; // Affichage de l'étoile remplie après clic
          listItem.classList.add('favorite-border'); // Ajoute la bordure de favoris
        }
      });

      // Ajoute les éléments à l'élément de liste
      listItem.appendChild(nameElement);
      listItem.appendChild(imageElement);
      listItem.appendChild(typesElement);
      listItem.appendChild(favoriteStar); // Ajoute l'étoile de favoris

      // Ajoute un événement click pour afficher les détails
      listItem.addEventListener('click', () => {
        displayPokemonDetails(pokemon);
      });

      // Ajoute l'élément de liste à la liste des Pokémon
      pokemonList.appendChild(listItem);
    });
  }

  // Affiche les détails du Pokémon sélectionné
  function displayPokemonDetails(pokemon) {
    // Crée un conteneur pour afficher les détails
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('pokemon-details');

    // Crée un élément de titre pour le nom du Pokémon
    const nameElement = document.createElement('h2');
    nameElement.textContent = pokemon.frenchName;

    // Crée un élément d'image pour l'image du Pokémon
    const imageElement = document.createElement('img');
    imageElement.src = pokemon.image;
    imageElement.alt = pokemon.frenchName;

    // Crée un élément de paragraphe pour les types du Pokémon
    const typesElement = document.createElement('p');
    typesElement.textContent = pokemon.frenchTypes.join(', ');

    // Crée une liste pour les statistiques
    const stats = document.createElement('ul');
    stats.innerHTML = `
      <li>PV: ${pokemon.stats[0].base_stat}</li>
      <li>Attaque: ${pokemon.stats[1].base_stat}</li>
      <li>Défense: ${pokemon.stats[2].base_stat}</li>
      <li>Attaque Spéciale: ${pokemon.stats[3].base_stat}</li>
      <li>Défense Spéciale: ${pokemon.stats[4].base_stat}</li>
      <li>Vitesse: ${pokemon.stats[5].base_stat}</li>
    `;

    // Vide le conteneur de détails
    document.getElementById('pokemon-details').innerHTML = '';
    // Ajoute les éléments au conteneur de détails
    detailsContainer.appendChild(nameElement);
    detailsContainer.appendChild(imageElement);
    detailsContainer.appendChild(typesElement);
    detailsContainer.appendChild(stats);
    document.getElementById('pokemon-details').appendChild(detailsContainer);
  }

  // Fonction pour obtenir la couleur d'un type de Pokémon
  function getTypeColor(type) {
    const colors = {
      normal: '#A8A77A',
      feu: '#FF6200',
      eau: '#12DBD4',
      électrique: '#F7D02C',
      plante: '#74DB6F',
      glace: '#96D9D6',
      combat: '#C22E28',
      poison: '#A33EA1',
      sol: '#E2BF65',
      vol: '#A98FF3',
      psy: '#F95587',
      insecte: '#A6B91A',
      roche: '#B6A136',
      spectre: '#735797',
      dragon: '#6F35FC',
      ténèbres: '#705746',
      acier: '#B7B7CE',
      fée: '#D685AD',
    };
    return colors[type] || '#ccc'; // Retourne la couleur ou une couleur par défaut
  }

  // Fonction pour obtenir le type en français
  function getTypeInFrench(type) {
    const types = {
      normal: 'normal',
      fire: 'feu',
      water: 'eau',
      electric: 'électrique',
      grass: 'plante',
      ice: 'glace',
      fighting: 'combat',
      poison: 'poison',
      ground: 'sol',
      flying: 'vol',
      psychic: 'psy',
      bug: 'insecte',
      rock: 'roche',
      ghost: 'spectre',
      dragon: 'dragon',
      dark: 'ténèbres',
      steel: 'acier',
      fairy: 'fée',
    };
    return types[type] || type; // Retourne le type en français ou le type original si non trouvé
  }

  // Basculer entre les thèmes clair et sombre
  toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme'); // Bascule la classe 'dark-theme'
    document.body.classList.toggle('light-theme'); // Bascule la classe 'light-theme'
  });
});
