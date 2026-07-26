import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Observable,
  bindToElement,
  bindVisibility,
  createCounter,
  createTheme,
} from "./observer";

describe("Observable", () => {
  it("retourne la valeur initiale", () => {
    expect(new Observable(42).getValue()).toBe(42);
  });

  it("notifie les abonnés à chaque next()", () => {
    const obs = new Observable(0);
    const cb = vi.fn();
    obs.subscribe(cb);
    obs.next(1);
    obs.next(2);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith(2);
  });

  it("émet la valeur courante si emitCurrent = true", () => {
    const obs = new Observable(99);
    const cb = vi.fn();
    obs.subscribe(cb, true);
    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith(99);
  });

  it("supporte plusieurs abonnés", () => {
    const obs = new Observable("x");
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    obs.subscribe(cb1);
    obs.subscribe(cb2);
    obs.next("y");
    expect(cb1).toHaveBeenCalledWith("y");
    expect(cb2).toHaveBeenCalledWith("y");
  });

  it("ne notifie plus après désabonnement", () => {
    const obs = new Observable(0);
    const cb = vi.fn();
    const unsub = obs.subscribe(cb);
    obs.next(1);
    unsub();
    obs.next(2);
    expect(cb).toHaveBeenCalledOnce();
  });

  it("ne perturbe pas les autres abonnés lors du désabonnement", () => {
    const obs = new Observable(0);
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const unsub1 = obs.subscribe(cb1);
    obs.subscribe(cb2);
    unsub1();
    obs.next(5);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledWith(5);
  });

  it("subscriberCount reflète le nombre d'abonnés actifs", () => {
    const obs = new Observable(0);
    const u1 = obs.subscribe(vi.fn());
    const u2 = obs.subscribe(vi.fn());
    expect(obs.subscriberCount).toBe(2);
    u1();
    expect(obs.subscriberCount).toBe(1);
    u2();
    expect(obs.subscriberCount).toBe(0);
  });

  it("clear() retire tous les abonnés", () => {
    const obs = new Observable(0);
    const cb = vi.fn();
    obs.subscribe(cb);
    obs.clear();
    obs.next(1);
    expect(cb).not.toHaveBeenCalled();
  });

  it("map() crée un Observable dérivé transformé", () => {
    const source = new Observable(3);
    const doubled = source.map((n) => n * 2);
    const cb = vi.fn();
    doubled.subscribe(cb);
    source.next(5);
    expect(doubled.getValue()).toBe(10);
    expect(cb).toHaveBeenCalledWith(10);
  });
});

describe("bindToElement()", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("span");
  });

  it("initialise le textContent immédiatement", () => {
    bindToElement(new Observable(7), el);
    expect(el.textContent).toBe("7");
  });

  it("met à jour le textContent à chaque next()", () => {
    const obs = new Observable(0);
    bindToElement(obs, el);
    obs.next(42);
    expect(el.textContent).toBe("42");
  });

  it("applique la transformation optionnelle", () => {
    const obs = new Observable(3);
    bindToElement(obs, el, { transform: (v) => `${v} articles` });
    obs.next(10);
    expect(el.textContent).toBe("10 articles");
  });

  it("cesse la mise à jour après désabonnement", () => {
    const obs = new Observable(1);
    const unbind = bindToElement(obs, el);
    unbind();
    obs.next(99);
    expect(el.textContent).toBe("1");
  });
});

describe("bindVisibility()", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("masque l'élément quand la valeur est false", () => {
    const obs = new Observable(true);
    bindVisibility(obs, el);
    obs.next(false);
    expect(el.style.display).toBe("none");
  });

  it("réaffiche l'élément quand la valeur repasse à true", () => {
    const obs = new Observable(false);
    bindVisibility(obs, el);
    obs.next(true);
    expect(el.style.display).toBe("");
  });
});

describe("createCounter()", () => {
  it("increment, decrement et reset fonctionnent", () => {
    const { observable, increment, decrement, reset } = createCounter(0);
    increment();
    increment();
    expect(observable.getValue()).toBe(2);
    decrement();
    expect(observable.getValue()).toBe(1);
    reset();
    expect(observable.getValue()).toBe(0);
  });
});

describe("createTheme()", () => {
  it("toggle bascule entre light et dark", () => {
    const { observable, toggle } = createTheme();
    expect(observable.getValue()).toBe("light");
    toggle();
    expect(observable.getValue()).toBe("dark");
    toggle();
    expect(observable.getValue()).toBe("light");
  });
});
