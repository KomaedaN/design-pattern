export class TagBuilder {
  private element: HTMLElement;
  private eventMap: Map<string, EventListener> = new Map();

  constructor(tag: string) {
    this.element = document.createElement(tag);
  }

  withText(text: string): this {
    this.element.textContent = text;
    return this;
  }

  withClass(className: string): this {
    this.element.classList.add(className);
    return this;
  }

  withStyle(property: string, value: string): this {
    (this.element.style as unknown as Record<string, string>)[property] = value;
    return this;
  }

  withAttr(name: string, value: string): this {
    this.element.setAttribute(name, value);
    return this;
  }

  withEvent(event: string, handler: EventListener): this {
    const existing = this.eventMap.get(event);
    if (existing) {
      this.element.removeEventListener(event, existing);
    }
    this.eventMap.set(event, handler);
    this.element.addEventListener(event, handler);
    return this;
  }

  withChild(child: HTMLElement): this {
    this.element.appendChild(child);
    return this;
  }

  withoutClass(className: string): this {
    this.element.classList.remove(className);
    return this;
  }

  withoutEvent(event: string): this {
    const existing = this.eventMap.get(event);
    if (existing) {
      this.element.removeEventListener(event, existing);
      this.eventMap.delete(event);
    }
    return this;
  }

  build(): HTMLElement {
    return this.element;
  }
}
