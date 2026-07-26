import { TagBuilder } from "./core/builder";

const pokemons = [
  { id: 1, name: "Bulbizarre", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { id: 4, name: "Salamèche", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { id: 7, name: "Carapuce", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
];

export function initApp(root: HTMLElement): void {
  const grid = new TagBuilder("div").withClass("pokemon-grid").build();

  pokemons.forEach((pokemon) => {
    const card = new TagBuilder("div")
      .withClass("pokemon-card")
      .withChild(
        new TagBuilder("img")
          .withAttr("src", pokemon.sprite)
          .withAttr("alt", pokemon.name)
          .build()
      )
      .withChild(
        new TagBuilder("h2").withText(pokemon.name).build()
      )
      .withChild(
        new TagBuilder("button")
          .withText("Voir détail")
          .withEvent("click", () => alert(`Pokémon : ${pokemon.name}`))
          .build()
      )
      .build();

    grid.appendChild(card);
  });

  root.appendChild(grid);
}
