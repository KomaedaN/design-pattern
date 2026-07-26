import { Observable } from "./observer";
import { type StorageStrategy, VolatileStorage } from "./strategy";

export class AppConfig {
  private static instance?: AppConfig;
  private appTitle: string;
  private pageTitle: string;

  private constructor() {
    this.appTitle = "PokeRoar";
    this.pageTitle = "Home Page";
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  setAppTitle(title: string): void {
    this.appTitle = title;
  }

  setPageTitle(title: string): void {
    this.pageTitle = title;
  }

  getAppTitle(): string {
    return this.appTitle;
  }

  getPageTitle(): string {
    return this.pageTitle;
  }
}

export class AppStore {
  private static instance?: AppStore;
  private state: Record<string, Observable<unknown>> = {};
  private strategy: StorageStrategy = new VolatileStorage();

  private constructor() {}

  static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  setStrategy(strategy: StorageStrategy): void {
    this.strategy = strategy;
  }

  async setState<T>(key: string, value: T): Promise<void> {
    await this.strategy.set(key, value);
    if (!this.state[key]) {
      this.state[key] = new Observable<unknown>(value);
    } else {
      this.state[key].next(value);
    }
  }

  async getState<T>(key: string): Promise<T | undefined> {
    return this.strategy.get<T>(key);
  }

  subscribe<T>(key: string, callback: (value: T) => void): () => void {
    if (!this.state[key]) {
      this.state[key] = new Observable<unknown>(undefined);
    }
    return this.state[key].subscribe((value) => callback(value as T));
  }
}
