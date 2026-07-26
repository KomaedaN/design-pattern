import { Component } from "./component";
import { TagBuilder } from "../core/builder";
import { TagFactory } from "../core/factory";
import type { Pokemon } from "../types";

const TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export class PokemonForm extends Component {
  private onSubmit: (pokemon: Pokemon) => Promise<void>;
  private getNextId: () => number;

  constructor(onSubmit: (pokemon: Pokemon) => Promise<void>, getNextId: () => number) {
    super();
    this.onSubmit = onSubmit;
    this.getNextId = getNextId;
  }

  render(): HTMLElement {
    const nameInput = new TagBuilder("input")
      .withAttr("type", "text")
      .withAttr("placeholder", "Nom du Pokémon")
      .withClass("form-input")
      .build() as HTMLInputElement;

    const typeSelect = new TagBuilder("select")
      .withClass("form-input")
      .build() as HTMLSelectElement;

    TYPES.forEach((type) => {
      const option = new TagBuilder("option")
        .withAttr("value", type)
        .withText(type.charAt(0).toUpperCase() + type.slice(1))
        .build();
      typeSelect.appendChild(option);
    });

    const nameError = new TagBuilder("span")
      .withClass("form-error")
      .build();

    const submitBtn = new TagBuilder("button")
      .withClass("btn-action")
      .withAttr("type", "button")
      .withText("Ajouter")
      .withEvent("click", async () => {
        const name = nameInput.value.trim();
        nameError.textContent = "";

        if (!name) {
          nameError.textContent = "Le nom est requis";
          return;
        }

        const id = this.getNextId();
        await this.onSubmit({
          id,
          name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          types: [typeSelect.value],
        });

        nameInput.value = "";
      })
      .build();

    const idPreview = new TagBuilder("span")
      .withClass("form-id-preview")
      .withText(`ID : ${this.getNextId()}`)
      .build();

    return new TagBuilder("div")
      .withClass("pokemon-form")
      .withChild(TagFactory.create("h2", { text: "Ajouter un Pokémon", classes: ["form-title"] }))
      .withChild(idPreview)
      .withChild(nameInput)
      .withChild(nameError)
      .withChild(typeSelect)
      .withChild(submitBtn)
      .build();
  }

  onMount(): void {
    console.log("PokemonForm monté");
  }
}
