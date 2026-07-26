import { Component } from "./component";
import { Observable } from "../core/observer";
import { TagFactory } from "../core/factory";

type Pokemon = { id: number; name: string; sprite: string };

export class PokemonCounter extends Component {
  private count = 0;

  constructor(private pokemonList: Observable<Pokemon[]>) {
    super();
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
