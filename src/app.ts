import { TagBuilder } from "./core/builder";
import { TagFactory } from "./core/factory";
import { AppConfig, AppStore } from "./core/singleton";
import { IndexedDBStorage } from "./core/strategy";

type Pokemon = { id: number; name: string; sprite: string };

AppConfig.getInstance().setAppTitle("PokeRoar");
AppConfig.getInstance().setPageTitle("Accueil");

const store = AppStore.getInstance();
store.setStrategy(new IndexedDBStorage());

async function fetchFromApi(): Promise<Pokemon[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=494");
  const data = await res.json() as { results: { name: string; url: string }[] };
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
  const favoris = (await store.getState<number[]>("favoris")) ?? [];
  const isFavori = favoris.includes(pokemon.id);
  const updated = isFavori
    ? favoris.filter((id) => id !== pokemon.id)
    : [...favoris, pokemon.id];
  await store.setState("favoris", updated);
}

function buildCard(pokemon: Pokemon, favoris: number[]): HTMLElement {
  const isFavori = favoris.includes(pokemon.id);

  const heartBtn = new TagBuilder("button")
    .withClass("btn-favori")
    .withText(isFavori ? "❤️" : "🤍")
    .withEvent("click", () => toggleFavori(pokemon))
    .build();

  return new TagBuilder("div")
    .withClass("pokemon-card")
    .withChild(TagFactory.create("img", { attrs: { src: pokemon.sprite, alt: pokemon.name } }))
    .withChild(TagFactory.create("h2", { text: pokemon.name }))
    .withChild(heartBtn)
    .build();
}

let showFavorisOnly = false;

function renderGrid(pokemons: Pokemon[], favoris: number[], grid: HTMLElement): void {
  grid.innerHTML = "";
  const list = showFavorisOnly ? pokemons.filter((p) => favoris.includes(p.id)) : pokemons;
  list.forEach((pokemon) => grid.appendChild(buildCard(pokemon, favoris)));
}

export async function initApp(root: HTMLElement): Promise<void> {
  const header = TagFactory.create("h1", {
    text: AppConfig.getInstance().getAppTitle(),
    classes: ["app-title"],
  });

  const grid = TagFactory.create("div", { classes: ["pokemon-grid"] });

  async function refresh(): Promise<void> {
    const pokemons = (await store.getState<Pokemon[]>("pokemons")) ?? [];
    const favoris = (await store.getState<number[]>("favoris")) ?? [];
    renderGrid(pokemons, favoris, grid);
  }

  store.subscribe<Pokemon[]>("pokemons", () => refresh());
  store.subscribe<number[]>("favoris", () => refresh());

  const btnFavorisOnly = new TagBuilder("button")
    .withClass("btn-action")
    .withClass("btn-favoris")
    .withText("❤️ Voir mes favoris")
    .withEvent("click", async (e) => {
      showFavorisOnly = !showFavorisOnly;
      const btn = e.currentTarget as HTMLElement;
      btn.textContent = showFavorisOnly ? "🌍 Voir tous" : "❤️ Voir mes favoris";
      btn.classList.toggle("active", showFavorisOnly);
      await refresh();
    })
    .build();

  const actions = TagFactory.create("div", {
    classes: ["actions-bar"],
    children: [btnFavorisOnly],
  });

  root.appendChild(header);
  root.appendChild(actions);
  root.appendChild(grid);

  const existingPokemons = await store.getState<Pokemon[]>("pokemons");
  if (!existingPokemons || existingPokemons.length < 200) {
    const pokemons = await fetchFromApi();
    await store.setState("pokemons", pokemons);
  } else {
    await store.setState("pokemons", existingPokemons);
  }

  const existingFavoris = await store.getState<number[]>("favoris");
  await store.setState("favoris", existingFavoris ?? []);
}
