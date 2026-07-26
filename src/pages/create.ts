import { PokemonForm } from "../components/PokemonForm";
import type { Pokemon } from "../types";

export function renderCreate(
  outlet: HTMLElement,
  addPokemon: (pokemon: Pokemon) => Promise<void>,
  getNextId: () => number,
  onSuccess: () => void,
): () => void {
  const form = new PokemonForm(async (pokemon) => {
    await addPokemon(pokemon);
    onSuccess();
  }, getNextId);

  form.mount(outlet);

  return () => {
    form.destroy();
  };
}
