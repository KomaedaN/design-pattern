type RouteHandler = (outlet: HTMLElement) => (() => void) | void;

export class Router {
  private static instance?: Router;
  private routes: Map<string, RouteHandler> = new Map();
  private outlet: HTMLElement | null = null;
  private cleanup: (() => void) | null = null;

  private constructor() {
    window.addEventListener("popstate", () => this.resolve());
  }

  static getInstance(): Router {
    if (!Router.instance) Router.instance = new Router();
    return Router.instance;
  }

  register(path: string, handler: RouteHandler): this {
    this.routes.set(path, handler);
    return this;
  }

  navigate(path: string): void {
    window.history.pushState({}, "", path);
    this.resolve();
  }

  init(outlet: HTMLElement): void {
    this.outlet = outlet;
    this.resolve();
  }

  private resolve(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    if (!this.outlet) return;
    const path = window.location.pathname;
    const handler = this.routes.get(path) ?? this.routes.get("*");
    if (!handler) return;
    this.outlet.innerHTML = "";
    const result = handler(this.outlet);
    if (typeof result === "function") this.cleanup = result;
  }
}
