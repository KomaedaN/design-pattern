import { TagBuilder } from "./core/builder";
import { TagFactory } from "./core/factory";

const pokemons = [
  { id: 1,   name: "Bulbizarre", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { id: 4,   name: "Salamèche",  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { id: 7,   name: "Carapuce",   sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
  { id: 25,  name: "Pikachu",    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  { id: 39,  name: "Rondoudou",  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png" },
  { id: 52,  name: "Miaouss",    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png" },
  { id: 94,  name: "Ectoplasma", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" },
  { id: 133, name: "Évoli",      sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
  { id: 143, name: "Ronflex",    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
];

export function initApp(root: HTMLElement): void {
  const grid = TagFactory.create("div", { classes: ["pokemon-grid"] });

  pokemons.forEach((pokemon) => {
    const card = new TagBuilder("div")
      .withClass("pokemon-card")
      .withChild(
        TagFactory.create("img", {
          attrs: { src: pokemon.sprite, alt: pokemon.name },
        })
      )
      .withChild(
        TagFactory.create("h2", { text: pokemon.name })
      )
      .withChild(
        TagFactory.create("button", {
          text: "Voir détail",
          classes: ["btn-detail"],
          events: { click: () => alert(`Pokémon : ${pokemon.name}`) },
        })
      )
      .build();

    grid.appendChild(card);
  });

  root.appendChild(grid);
}
