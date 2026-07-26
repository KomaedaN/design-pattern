import { Observable } from "./core/observer";
import { TagFactory } from "./core/factory";
import { TagBuilder } from "./core/builder";
import { PokemonGrid } from "./components/PokemonGrid";
import { PokemonCounter } from "./components/PokemonCounter";

type Pokemon = { id: number; name: string; sprite: string };

const POKEMONS: Pokemon[] = [
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

export function initApp(root: HTMLElement): void {
  const pokemonList = new Observable<Pokemon[]>([]);

  const counter = new PokemonCounter(pokemonList);
  const grid = new PokemonGrid(pokemonList);

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

  const controls = TagFactory.create("div", {
    classes: ["controls"],
    children: [btnAdd, btnReset],
  });

  counter.mount(root);
  root.appendChild(controls);
  grid.mount(root);

  pokemonList.next(POKEMONS);
}
