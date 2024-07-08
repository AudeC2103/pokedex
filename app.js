document.addEventListener('DOMContentLoaded', () => {
  const pokemonList = document.getElementById('pokemon-list');
  const searchBar = document.getElementById('search-bar');
  const typeFilter = document.getElementById('type-filter');
  let allPokemon = [];

  // Dictionnaire de traduction des types
  const typeTranslations = {
      'normal': 'Normal',
      'fighting': 'Combat',
      'flying': 'Vol',
      'poison': 'Poison',
      'ground': 'Sol',
      'rock': 'Roche',
      'bug': 'Insecte',
      'ghost': 'Spectre',
      'steel': 'Acier',
      'fire': 'Feu',
      'water': 'Eau',
      'grass': 'Plante',
      'electric': 'Électrique',
      'psychic': 'Psy',
      'ice': 'Glace',
      'dragon': 'Dragon',
      'dark': 'Ténèbres',
      'fairy': 'Fée'
  };

  // Dictionnaire de traduction des noms
  const nameTranslations = {
      'bulbasaur': 'Bulbizarre',
      'ivysaur': 'Herbizarre',
      'venusaur': 'Florizarre',
      'charmander': 'Salamèche',
      'charmeleon': 'Reptincel',
      'charizard': 'Dracaufeu',
      'squirtle': 'Carapuce',
      'wartortle': 'Carabaffe',
      'blastoise': 'Tortank',
      'caterpie': 'Chenipan',
      'metapod': 'Chrysacier',
      'butterfree': 'Papilusion',
      'weedle': 'Aspicot',
      'kakuna': 'Coconfort',
      'beedrill': 'Dardargnan',
      'pidgey': 'Roucool',
      'pidgeotto': 'Roucoups',
      'pidgeot': 'Roucarnage',
      'rattata': 'Rattata',
      'raticate': 'Rattatac',
      'spearow': 'Piafabec',
      'fearow': 'Rapasdepic',
      'ekans': 'Abo',
      'arbok': 'Arbok',
      'pikachu': 'Pikachu',
      'raichu': 'Raichu',
      'sandshrew': 'Sabelette',
      'sandslash': 'Sablaireau',
      'nidoran-f': 'Nidoran♀',
      'nidorina': 'Nidorina',
      'nidoqueen': 'Nidoqueen',
      'nidoran-m': 'Nidoran♂',
      'nidorino': 'Nidorino',
      'nidoking': 'Nidoking',
      'clefairy': 'Mélofée',
      'clefable': 'Mélodelfe',
      'vulpix': 'Goupix',
      'ninetales': 'Feunard',
      'jigglypuff': 'Rondoudou',
      'wigglytuff': 'Grodoudou',
      'zubat': 'Nosferapti',
      'golbat': 'Nosferalto',
      'oddish': 'Mystherbe',
      'gloom': 'Ortide',
      'vileplume': 'Rafflesia',
      'paras': 'Paras',
      'parasect': 'Parasect',
      'venonat': 'Mimitoss',
      'venomoth': 'Aéromite',
      'diglett': 'Taupiqueur',
      'dugtrio': 'Triopikeur',
      'meowth': 'Miaouss',
      'persian': 'Persian',
      'psyduck': 'Psykokwak',
      'golduck': 'Akwakwak',
      'mankey': 'Férosinge',
      'primeape': 'Colossinge',
      'growlithe': 'Caninos',
      'arcanine': 'Arcanin',
      'poliwag': 'Ptitard',
      'poliwhirl': 'Têtarte',
      'poliwrath': 'Tartard',
      'abra': 'Abra',
      'kadabra': 'Kadabra',
      'alakazam': 'Alakazam',
      'machop': 'Machoc',
      'machoke': 'Machopeur',
      'machamp': 'Mackogneur',
      'bellsprout': 'Chétiflor',
      'weepinbell': 'Boustiflor',
      'victreebel': 'Empiflor',
      'tentacool': 'Tentacool',
      'tentacruel': 'Tentacruel',
      'geodude': 'Racaillou',
      'graveler': 'Gravalanch',
      'golem': 'Grolem',
      'ponyta': 'Ponyta',
      'rapidash': 'Galopa',
      'slowpoke': 'Ramoloss',
      'slowbro': 'Flagadoss',
      'magnemite': 'Magnéti',
      'magneton': 'Magnéton',
      'farfetchd': 'Canarticho',
      'doduo': 'Doduo',
      'dodrio': 'Dodrio',
      'seel': 'Otaria',
      'dewgong': 'Lamantine',
      'grimer': 'Tadmorv',
      'muk': 'Grotadmorv',
      'shellder': 'Kokiyas',
      'cloyster': 'Crustabri',
      'gastly': 'Fantominus',
      'haunter': 'Spectrum',
      'gengar': 'Ectoplasma',
      'onix': 'Onix',
      'drowzee': 'Soporifik',
      'hypno': 'Hypnomade',
      'krabby': 'Krabby',
      'kingler': 'Krabboss',
      'voltorb': 'Voltorbe',
      'electrode': 'Électrode',
      'exeggcute': 'Nœunœuf',
      'exeggutor': 'Noadkoko',
      'cubone': 'Osselait',
      'marowak': 'Ossatueur',
      'hitmonlee': 'Kicklee',
      'hitmonchan': 'Tygnon',
      'lickitung': 'Excelangue',
      'koffing': 'Smogo',
      'weezing': 'Smogogo',
      'rhyhorn': 'Rhinocorne',
      'rhydon': 'Rhinoféros',
      'chansey': 'Leveinard',
      'tangela': 'Saquedeneu',
      'kangaskhan': 'Kangourex',
      'horsea': 'Hypotrempe',
      'seadra': 'Hypocéan',
      'goldeen': 'Poissirène',
      'seaking': 'Poissoroy',
      'staryu': 'Stari',
      'starmie': 'Staross',
      'mr-mime': 'M. Mime',
      'scyther': 'Insécateur',
      'jynx': 'Lippoutou',
      'electabuzz': 'Élektek',
      'magmar': 'Magmar',
      'pinsir': 'Scarabrute',
      'tauros': 'Tauros',
      'magikarp': 'Magicarpe',
      'gyarados': 'Léviator',
      'lapras': 'Lokhlass',
      'ditto': 'Métamorph',
      'eevee': 'Évoli',
      'vaporeon': 'Aquali',
      'jolteon': 'Voltali',
      'flareon': 'Pyroli',
      'porygon': 'Porygon',
      'omanyte': 'Amonita',
      'omastar': 'Amonistar',
      'kabuto': 'Kabuto',
      'kabutops': 'Kabutops',
      'aerodactyl': 'Ptéra',
      'snorlax': 'Ronflex',
      'articuno': 'Artikodin',
      'zapdos': 'Électhor',
      'moltres': 'Sulfura',
      'dratini': 'Minidraco',
      'dragonair': 'Draco',
      'dragonite': 'Dracolosse',
      'mewtwo': 'Mewtwo',
      'mew': 'Mew'
  };

  // Fonction pour traduire les types
  const translateType = (type) => {
      return typeTranslations[type] || type;
  };

  // Fonction pour traduire les noms
  const translateName = (name) => {
      return nameTranslations[name.toLowerCase()] || name;
  };

  // Fonction pour récupérer et afficher les Pokémon
  const fetchPokemon = async () => {
      try {
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
          const data = await response.json();
          const pokemonDetails = await Promise.all(data.results.map(pokemon => fetchPokemonDetails(pokemon.url)));
          allPokemon = pokemonDetails;
          displayPokemon(allPokemon);
      } catch (error) {
          console.error('Erreur lors de la récupération des Pokémon', error);
      }
  };

  // Fonction pour récupérer les détails de chaque Pokémon
  const fetchPokemonDetails = async (url) => {
      try {
          const response = await fetch(url);
          return await response.json();
      } catch (error) {
          console.error('Erreur lors de la récupération des détails du Pokémon', error);
      }
  };

  // Fonction pour afficher les Pokémon
  const displayPokemon = (pokemonArray) => {
      pokemonList.innerHTML = '';
      pokemonArray.forEach(pokemon => {
          const pokemonCard = document.createElement('div');
          pokemonCard.classList.add('pokemon-card');
          const frenchName = translateName(pokemon.name);
          pokemonCard.innerHTML = `
              <img src="${pokemon.sprites.front_default}" alt="${frenchName}">
              <h3>${frenchName}</h3>
              <p>Type: ${pokemon.types.map(type => translateType(type.type.name)).join(', ')}</p>
          `;
          pokemonList.appendChild(pokemonCard);
      });
  };

  // Fonction pour filtrer les Pokémon
  const filterPokemon = () => {
      const searchText = searchBar.value.toLowerCase();
      const selectedType = typeFilter.value.toLowerCase();

      const filteredPokemon = allPokemon.filter(pokemon => {
          const frenchName = translateName(pokemon.name).toLowerCase();
          const matchesName = frenchName.includes(searchText);
          const matchesType = selectedType === "" || pokemon.types.some(type => translateType(type.type.name).toLowerCase() === selectedType);
          return matchesName && matchesType;
      });

      displayPokemon(filteredPokemon);
  };

  searchBar.addEventListener('input', filterPokemon);
  typeFilter.addEventListener('change', filterPokemon);

  fetchPokemon();
});
