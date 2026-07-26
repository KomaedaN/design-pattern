import { Component } from "./component";
import { TagBuilder } from "../core/builder";
import { TagFactory } from "../core/factory";
import type { Pokemon } from "../types";

export class PokemonCard extends Component {
  constructor(
    private pokemon: Pokemon,
    private favoris: number[],
    private onToggleFavori: (pokemon: Pokemon) => Promise<void>,
  ) {
    super();
  }

  render(): HTMLElement {
    const isFavori = this.favoris.includes(this.pokemon.id);

    const heartBtn = new TagBuilder("button")
      .withClass("btn-favori")
      .withText(isFavori ? "❤️" : "🤍")
      .withEvent("click", () => this.onToggleFavori(this.pokemon))
      .build();

    return new TagBuilder("div")
      .withClass("pokemon-card")
      .withChild(
        TagFactory.create("img", {
          attrs: { src: this.pokemon.sprite, alt: this.pokemon.name },
        }),
      )
      .withChild(TagFactory.create("h2", { text: this.pokemon.name }))
      .withChild(heartBtn)
      .build();
  }

  onMount(): void {
    console.log(`PokemonCard monté : ${this.pokemon.name}`);
  }

  onDestroy(): void {
    console.log(`PokemonCard détruit : ${this.pokemon.name}`);
  }
}
