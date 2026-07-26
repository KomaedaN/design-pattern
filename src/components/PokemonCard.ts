import { Component } from "./component";
import { TagBuilder } from "../core/builder";
import { TagFactory } from "../core/factory";
import type { Pokemon } from "../types";

const TYPE_COLORS: Record<string, string> = {
  fire: "#f08030", water: "#6890f0", grass: "#78c850", electric: "#f8d030",
  psychic: "#f85888", ice: "#98d8d8", dragon: "#7038f8", dark: "#705848",
  fairy: "#ee99ac", normal: "#a8a878", fighting: "#c03028", flying: "#a890f0",
  poison: "#a040a0", ground: "#e0c068", rock: "#b8a038", bug: "#a8b820",
  ghost: "#705898", steel: "#b8b8d0",
};

export class PokemonCard extends Component {
  private pokemon: Pokemon;
  private favoris: number[];
  private onToggleFavori: (pokemon: Pokemon) => Promise<void>;

  constructor(pokemon: Pokemon, favoris: number[], onToggleFavori: (pokemon: Pokemon) => Promise<void>) {
    super();
    this.pokemon = pokemon;
    this.favoris = favoris;
    this.onToggleFavori = onToggleFavori;
  }

  render(): HTMLElement {
    const isFavori = this.favoris.includes(this.pokemon.id);

    const heartBtn = new TagBuilder("button")
      .withClass("btn-favori")
      .withText(isFavori ? "❤️" : "🤍")
      .withEvent("click", () => this.onToggleFavori(this.pokemon))
      .build();

    const typesContainer = TagFactory.create("div", { classes: ["pokemon-types"] });
    this.pokemon.types.forEach((type) => {
      const badge = TagFactory.create("span", {
        text: type,
        classes: ["type-badge"],
        styles: { background: TYPE_COLORS[type] ?? "#777" },
      });
      typesContainer.appendChild(badge);
    });

    return new TagBuilder("div")
      .withClass("pokemon-card")
      .withChild(TagFactory.create("img", { attrs: { src: this.pokemon.sprite, alt: this.pokemon.name } }))
      .withChild(TagFactory.create("h2", { text: this.pokemon.name }))
      .withChild(typesContainer)
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
