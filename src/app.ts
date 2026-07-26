import { TagBuilder } from "./core/builder";
import { TagFactory } from "./core/factory";
import { Observable } from "./core/observer";

type Pokemon = { id: number; name: string; sprite: string };

const pokemonList = new Observable<Pokemon[]>([]);

const INITIAL_POKEMONS: Pokemon[] = [
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
  {
    id: 25,
    name: "Pikachu",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  },
  {
    id: 39,
    name: "Rondoudou",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
  },
  {
    id: 52,
    name: "Miaouss",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
  },
  {
    id: 94,
    name: "Ectoplasma",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
  },
  {
    id: 133,
    name: "Évoli",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
  },
  {
    id: 143,
    name: "Ronflex",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
  },
];

function buildCard(pokemon: Pokemon): HTMLElement {
  return new TagBuilder("div")
    .withClass("pokemon-card")
    .withChild(
      TagFactory.create("img", {
        attrs: { src: pokemon.sprite, alt: pokemon.name },
      }),
    )
    .withChild(TagFactory.create("h2", { text: pokemon.name }))
    .withChild(
      TagFactory.create("button", {
        text: "Voir détail",
        classes: ["btn-detail"],
        events: { click: () => alert(`Pokémon : ${pokemon.name}`) },
      }),
    )
    .build();
}

function renderGrid(pokemons: Pokemon[], grid: HTMLElement): void {
  grid.innerHTML = "";
  pokemons.forEach((pokemon) => grid.appendChild(buildCard(pokemon)));
}

export function initApp(root: HTMLElement): void {
  const counter = TagFactory.create("p", { text: "0 Pokémon chargés" });
  const grid = TagFactory.create("div", { classes: ["pokemon-grid"] });

  const btnAdd = new TagBuilder("button")
    .withText("Ajouter Évaporé")
    .withEvent("click", () => {
      pokemonList.next([
        ...pokemonList.getValue(),
        {
          id: 54,
          name: "Évaporé",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
        },
      ]);
    })
    .build();

  const btnReset = new TagBuilder("button")
    .withText("Vider la liste")
    .withEvent("click", () => pokemonList.next([]))
    .build();

  pokemonList.subscribe((pokemons) => renderGrid(pokemons, grid));
  pokemonList.subscribe((pokemons) => {
    counter.textContent = `${pokemons.length} Pokémon chargés`;
  });

  root.appendChild(counter);
  root.appendChild(grid);
  root.appendChild(btnAdd);
  root.appendChild(btnReset);

  pokemonList.next(INITIAL_POKEMONS);
}
