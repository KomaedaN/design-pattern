import { Observable } from "../core/observer";

type Unsubscribe = () => void;

export abstract class Component {
  protected element!: HTMLElement;
  private subscriptions: Unsubscribe[] = [];

  abstract render(): HTMLElement;

  mount(target: HTMLElement): void {
    this.element = this.render();
    target.appendChild(this.element);
    this.onMount();
  }

  update(): void {
    if (!this.element) return;
    const parent = this.element.parentElement;
    if (!parent) return;
    const next = this.render();
    parent.replaceChild(next, this.element);
    this.element = next;
    this.onUpdate();
  }

  destroy(): void {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
    this.element?.remove();
    this.onDestroy();
  }

  protected watch<T>(
    observable: Observable<T>,
    callback: (value: T) => void,
  ): void {
    this.subscriptions.push(observable.subscribe(callback));
  }

  onMount(): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
