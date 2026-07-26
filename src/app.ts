import { TagBuilder } from "./core/builder";
import { TagFactory } from "./core/factory";
import { AppConfig, AppStore } from "./core/singleton";
import { IndexedDBStorage } from "./core/strategy";
import { Observable } from "./core/observer";
import { Router } from "./router/index";
import { renderHome } from "./pages/home";
import { renderCreate } from "./pages/create";
import type { Pokemon } from "./types";

AppConfig.getInstance().setAppTitle("PokeRoar");

const store = AppStore.getInstance();
store.setStrategy(new IndexedDBStorage());

async function fetchFromApi(): Promise<Pokemon[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=494");
  const data = (await res.json()) as { results: { name: string; url: string }[] };

  const basicList = data.results.map((p) => {
    const id = parseInt(p.url.split("/").filter(Boolean).pop() ?? "0");
    return { id, name: p.name, url: p.url };
  });

  return Promise.all(
    basicList.map(async ({ id, name, url }) => {
      const detail = (await fetch(url).then((r) => r.json())) as {
        types: { type: { name: string } }[];
      };
      return {
        id,
        name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        types: detail.types.map((t) => t.type.name),
      };
    }),
  );
}

export async function initApp(root: HTMLElement): Promise<void> {
  const pokemonsObs = new Observable<Pokemon[]>([]);
  const favorisObs = new Observable<number[]>([]);

  store.subscribe<Pokemon[]>("pokemons", (p) => pokemonsObs.next(p));
  store.subscribe<number[]>("favoris", (f) => favorisObs.next(f));

  async function toggleFavori(pokemon: Pokemon): Promise<void> {
    const favoris = (await store.getState<number[]>("favoris")) ?? [];
    const isFavori = favoris.includes(pokemon.id);
    const updated = isFavori
      ? favoris.filter((id) => id !== pokemon.id)
      : [...favoris, pokemon.id];
    await store.setState("favoris", updated);
  }

  async function addPokemon(pokemon: Pokemon): Promise<void> {
    const pokemons = (await store.getState<Pokemon[]>("pokemons")) ?? [];
    await store.setState("pokemons", [...pokemons, pokemon]);
  }

  function getNextId(): number {
    const list = pokemonsObs.getValue();
    return list.length === 0 ? 1 : Math.max(...list.map((p) => p.id)) + 1;
  }

  const router = Router.getInstance();

  const homeLink = new TagBuilder("a")
    .withText("Pokédex")
    .withAttr("href", "/")
    .withClass("nav-link")
    .withEvent("click", (e) => { e.preventDefault(); router.navigate("/"); })
    .build();

  const createLink = new TagBuilder("a")
    .withText("+ Ajouter")
    .withAttr("href", "/create")
    .withClass("nav-link")
    .withEvent("click", (e) => { e.preventDefault(); router.navigate("/create"); })
    .build();

  const nav = new TagBuilder("nav")
    .withClass("app-nav")
    .withChild(homeLink)
    .withChild(createLink)
    .build();

  const header = new TagBuilder("header")
    .withClass("app-header")
    .withChild(TagFactory.create("h1", { text: AppConfig.getInstance().getAppTitle(), classes: ["app-title"] }))
    .withChild(nav)
    .build();

  const outlet = new TagBuilder("main").withClass("router-outlet").build();

  root.appendChild(header);
  root.appendChild(outlet);

  const loading = TagFactory.create("p", { text: "Chargement des Pokémon...", classes: ["loading"] });
  outlet.appendChild(loading);

  const existingPokemons = await store.getState<Pokemon[]>("pokemons");
  const hasTypes = existingPokemons?.[0]?.types !== undefined;
  if (!existingPokemons || existingPokemons.length < 200 || !hasTypes) {
    const pokemons = await fetchFromApi();
    await store.setState("pokemons", pokemons);
  } else {
    await store.setState("pokemons", existingPokemons);
  }

  const existingFavoris = await store.getState<number[]>("favoris");
  await store.setState("favoris", existingFavoris ?? []);

  loading.remove();

  router
    .register("/", (el) => renderHome(el, pokemonsObs, favorisObs, toggleFavori))
    .register("/create", (el) => renderCreate(el, addPokemon, getNextId, () => router.navigate("/")))
    .init(outlet);
}
