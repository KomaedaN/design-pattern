import { TagFactory } from "./core/factory";
import { TagBuilder } from "./core/builder";
import { AppConfig, AppStore } from "./core/singleton";
import { IndexedDBStorage } from "./core/strategy";
import { Observable } from "./core/observer";
import { PokemonGrid } from "./components/PokemonGrid";
import { PokemonCounter } from "./components/PokemonCounter";
import type { Pokemon } from "./types";

AppConfig.getInstance().setAppTitle("PokeRoar");
AppConfig.getInstance().setPageTitle("Accueil");

const store = AppStore.getInstance();
store.setStrategy(new IndexedDBStorage());

const pokemonList = new Observable<Pokemon[]>([]);
const favorisList = new Observable<number[]>([]);

async function fetchFromApi(): Promise<Pokemon[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=494");
  const data = (await res.json()) as {
    results: { name: string; url: string }[];
  };
  return data.results.map((p) => {
    const id = parseInt(p.url.split("/").filter(Boolean).pop() ?? "0");
    return {
      id,
      name: p.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    };
  });
}

async function toggleFavori(pokemon: Pokemon): Promise<void> {
  const favoris = favorisList.getValue();
  const updated = favoris.includes(pokemon.id)
    ? favoris.filter((id) => id !== pokemon.id)
    : [...favoris, pokemon.id];
  await store.setState("favoris", updated);
  favorisList.next(updated);
}

export async function initApp(root: HTMLElement): Promise<void> {
  const header = TagFactory.create("h1", {
    text: AppConfig.getInstance().getAppTitle(),
    classes: ["app-title"],
  });

  let showFavorisOnly = false;

  const btnFavorisOnly = new TagBuilder("button")
    .withClass("btn-action")
    .withClass("btn-favoris")
    .withText("❤️ Voir mes favoris")
    .withEvent("click", () => {
      showFavorisOnly = !showFavorisOnly;
      btnFavorisOnly.textContent = showFavorisOnly
        ? "🌍 Voir tous"
        : "❤️ Voir mes favoris";
      btnFavorisOnly.classList.toggle("active", showFavorisOnly);
      const all = pokemonList.getValue();
      const favoris = favorisList.getValue();
      pokemonList.next(
        showFavorisOnly ? all.filter((p) => favoris.includes(p.id)) : all,
      );
    })
    .build();

  const actions = TagFactory.create("div", {
    classes: ["actions-bar"],
    children: [btnFavorisOnly],
  });

  const counter = new PokemonCounter(pokemonList);
  const grid = new PokemonGrid(pokemonList, favorisList, toggleFavori);

  counter.mount(root);
  root.appendChild(header);
  root.appendChild(actions);
  grid.mount(root);

  const existingPokemons = await store.getState<Pokemon[]>("pokemons");
  const existingFavoris = (await store.getState<number[]>("favoris")) ?? [];

  favorisList.next(existingFavoris);

  if (!existingPokemons || existingPokemons.length < 200) {
    const pokemons = await fetchFromApi();
    await store.setState("pokemons", pokemons);
    pokemonList.next(pokemons);
  } else {
    pokemonList.next(existingPokemons);
  }
}
