import { Component } from "./component";
import { Observable } from "../core/observer";
import { TagFactory } from "../core/factory";
import { PokemonCard } from "./PokemonCard";
import type { Pokemon } from "../types";

export class PokemonGrid extends Component {
  private pokemonList: Observable<Pokemon[]>;
  private favorisList: Observable<number[]>;
  private onToggleFavori: (pokemon: Pokemon) => Promise<void>;
  private pokemons: Pokemon[] = [];
  private favoris: number[] = [];
  private showFavorisOnly = false;

  constructor(
    pokemonList: Observable<Pokemon[]>,
    favorisList: Observable<number[]>,
    onToggleFavori: (pokemon: Pokemon) => Promise<void>,
  ) {
    super();
    this.pokemonList = pokemonList;
    this.favorisList = favorisList;
    this.onToggleFavori = onToggleFavori;
  }

  setShowFavorisOnly(val: boolean): void {
    this.showFavorisOnly = val;
    this.update();
  }

  render(): HTMLElement {
    const grid = TagFactory.create("div", { classes: ["pokemon-grid"] });
    const list = this.showFavorisOnly
      ? this.pokemons.filter((p) => this.favoris.includes(p.id))
      : this.pokemons;
    list.forEach((pokemon) => {
      const card = new PokemonCard(pokemon, this.favoris, this.onToggleFavori);
      card.mount(grid);
    });
    return grid;
  }

  onMount(): void {
    this.watch(this.pokemonList, (pokemons) => {
      this.pokemons = pokemons;
      this.update();
    });
    this.watch(this.favorisList, (favoris) => {
      this.favoris = favoris;
      this.update();
    });
  }

  onUpdate(): void {
    console.log("PokemonGrid mis à jour");
  }
}
