import { TagBuilder } from "../core/builder";
import { PokemonGrid } from "../components/PokemonGrid";
import { PokemonCounter } from "../components/PokemonCounter";
import { Observable } from "../core/observer";
import type { Pokemon } from "../types";

export function renderHome(
  outlet: HTMLElement,
  pokemonsObs: Observable<Pokemon[]>,
  favorisObs: Observable<number[]>,
  toggleFavori: (pokemon: Pokemon) => Promise<void>,
): () => void {
  const grid = new PokemonGrid(pokemonsObs, favorisObs, toggleFavori);
  const counter = new PokemonCounter(pokemonsObs);

  let showFavorisOnly = false;
  const btnFavorisOnly = new TagBuilder("button")
    .withClass("btn-action")
    .withClass("btn-favoris")
    .withText("❤️ Voir mes favoris")
    .withEvent("click", (e) => {
      showFavorisOnly = !showFavorisOnly;
      const btn = e.currentTarget as HTMLElement;
      btn.textContent = showFavorisOnly ? "🌍 Voir tous" : "❤️ Voir mes favoris";
      btn.classList.toggle("active", showFavorisOnly);
      grid.setShowFavorisOnly(showFavorisOnly);
    })
    .build();

  const actions = new TagBuilder("div")
    .withClass("actions-bar")
    .withChild(btnFavorisOnly)
    .build();

  outlet.appendChild(actions);
  counter.mount(outlet);
  grid.mount(outlet);

  return () => {
    grid.destroy();
    counter.destroy();
  };
}
