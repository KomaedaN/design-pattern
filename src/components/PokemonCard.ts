import { Component } from "./component";
import { TagBuilder } from "../core/builder";
import { TagFactory } from "../core/factory";

type Pokemon = { id: number; name: string; sprite: string };

export class PokemonCard extends Component {
  constructor(private pokemon: Pokemon) {
    super();
  }

  render(): HTMLElement {
    return new TagBuilder("div")
      .withClass("pokemon-card")
      .withChild(
        TagFactory.create("img", {
          attrs: { src: this.pokemon.sprite, alt: this.pokemon.name },
        }),
      )
      .withChild(TagFactory.create("h2", { text: this.pokemon.name }))
      .withChild(
        TagFactory.create("button", {
          text: "Voir détail",
          classes: ["btn-detail"],
          events: { click: () => alert(`Pokémon : ${this.pokemon.name}`) },
        }),
      )
      .build();
  }

  onMount(): void {
    console.log(`PokemonCard monté : ${this.pokemon.name}`);
  }

  onDestroy(): void {
    console.log(`PokemonCard détruit : ${this.pokemon.name}`);
  }
}
