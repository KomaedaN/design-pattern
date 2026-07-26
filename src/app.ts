import { TagBuilder } from "./core/builder";
import { Observable } from "./core/observer";

type Pokemon = { id: number; name: string; sprite: string };

const pokemonList = new Observable<Pokemon[]>([]);

function renderGrid(pokemons: Pokemon[], root: HTMLElement): void {
  root.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const card = new TagBuilder("div")
      .withClass("pokemon-card")
      .withChild(
        new TagBuilder("img")
          .withAttr("src", pokemon.sprite)
          .withAttr("alt", pokemon.name)
          .build(),
      )
      .withChild(new TagBuilder("h2").withText(pokemon.name).build())
      .withChild(
        new TagBuilder("button")
          .withText("Voir détail")
          .withEvent("click", () => alert(`Pokémon : ${pokemon.name}`))
          .build(),
      )
      .build();

    root.appendChild(card);
  });
}

export function initApp(root: HTMLElement): void {
  const grid = new TagBuilder("div").withClass("pokemon-grid").build();
  const counter = new TagBuilder("p").withText("0 Pokémon chargés").build();

  // Abonné 1 : la grille se reconstruit à chaque changement
  pokemonList.subscribe((pokemons) => renderGrid(pokemons, grid));

  // Abonné 2 : le compteur se met à jour tout seul
  pokemonList.subscribe((pokemons) => {
    counter.textContent = `${pokemons.length} Pokémon chargés`;
  });

  root.appendChild(counter);
  root.appendChild(grid);
  // Boutons de test — à supprimer après
  const btnAdd = new TagBuilder("button")
    .withText("Ajouter Pikachu")
    .withEvent("click", () => {
      pokemonList.next([
        ...pokemonList.getValue(),
        {
          id: 25,
          name: "Pikachu",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        },
      ]);
    })
    .build();

  const btnReset = new TagBuilder("button")
    .withText("Vider la liste")
    .withEvent("click", () => pokemonList.next([]))
    .build();

  root.appendChild(btnAdd);
  root.appendChild(btnReset);

  // Données initiales — remplace ça par un vrai fetch plus tard
  pokemonList.next([
    {
      id: 1,
      name: "Bulbizarre",
      sprite:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    },
    {
      id: 4,
      name: "Salamèche",
      sprite:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    },
    {
      id: 7,
      name: "Carapuce",
      sprite:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    },
  ]);
}
