import { Component } from "./component";
import { Observable } from "../core/observer";
import { TagFactory } from "../core/factory";
import { PokemonCard } from "./PokemonCard";

type Pokemon = { id: number; name: string; sprite: string };

export class PokemonGrid extends Component {
  private pokemons: Pokemon[] = [];

  constructor(private pokemonList: Observable<Pokemon[]>) {
    super();
  }

  render(): HTMLElement {
    const grid = TagFactory.create("div", { classes: ["pokemon-grid"] });
    this.pokemons.forEach((pokemon) => {
      const card = new PokemonCard(pokemon);
      card.mount(grid);
    });
    return grid;
  }

  onMount(): void {
    this.watch(this.pokemonList, (pokemons) => {
      this.pokemons = pokemons;
      this.update();
    });
  }

  onUpdate(): void {
    console.log("PokemonGrid mis à jour");
  }
}
