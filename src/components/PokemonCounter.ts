import { Component } from "./component";
import { Observable } from "../core/observer";
import { TagFactory } from "../core/factory";
import type { Pokemon } from "../types";

export class PokemonCounter extends Component {
  private pokemonList: Observable<Pokemon[]>;
  private count = 0;

  constructor(pokemonList: Observable<Pokemon[]>) {
    super();
    this.pokemonList = pokemonList;
  }

  render(): HTMLElement {
    return TagFactory.create("p", {
      text: `${this.count} Pokémon chargés`,
      classes: ["pokemon-counter"],
    });
  }

  onMount(): void {
    this.watch(this.pokemonList, (pokemons) => {
      this.count = pokemons.length;
      this.update();
    });
  }

  onUpdate(): void {
    console.log("PokemonCounter mis à jour");
  }
}
