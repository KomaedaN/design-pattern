type Subscriber<T> = (value: T) => void;
type Unsubscribe = () => void;

export class Observable<T> {
  private subscribers: Array<Subscriber<T>> = [];
  private currentValue: T;

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  getValue(): T {
    return this.currentValue;
  }

  get subscriberCount(): number {
    return this.subscribers.length;
  }

  subscribe(callback: Subscriber<T>, emitCurrent = false): Unsubscribe {
    this.subscribers.push(callback);

    if (emitCurrent) {
      callback(this.currentValue);
    }

    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  next(value: T): void {
    this.currentValue = value;
    [...this.subscribers].forEach((sub) => sub(value));
  }

  clear(): void {
    this.subscribers = [];
  }

  map<U>(projector: (value: T) => U): Observable<U> {
    const derived = new Observable<U>(projector(this.currentValue));
    this.subscribe((value) => derived.next(projector(value)));
    return derived;
  }
}

interface BindOptions<T> {
  transform?: (value: T) => string;
}

export function bindToElement<T>(
  observable: Observable<T>,
  element: HTMLElement,
  options: BindOptions<T> = {},
): Unsubscribe {
  const { transform = (v: T) => String(v) } = options;
  return observable.subscribe((value) => {
    element.textContent = transform(value);
  }, true);
}

export function bindVisibility(
  observable: Observable<boolean>,
  element: HTMLElement,
): Unsubscribe {
  return observable.subscribe((visible) => {
    element.style.display = visible ? "" : "none";
  }, true);
}

export function createCounter(initial = 0): {
  observable: Observable<number>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
} {
  const observable = new Observable<number>(initial);
  return {
    observable,
    increment: () => observable.next(observable.getValue() + 1),
    decrement: () => observable.next(observable.getValue() - 1),
    reset: () => observable.next(initial),
  };
}

export function createTheme(): {
  observable: Observable<"light" | "dark">;
  toggle: () => void;
} {
  const observable = new Observable<"light" | "dark">("light");
  return {
    observable,
    toggle: () =>
      observable.next(observable.getValue() === "light" ? "dark" : "light"),
  };
}
