export class AppConfig {
  private static instance?: AppConfig;
  private appTitle: string;
  private pageTitle: string;

  private constructor(appTitle: string, pageTitle: string) {
    this.appTitle = appTitle;
    this.pageTitle = pageTitle;
  }

  private static getInstance(): AppConfig {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }

    AppConfig.instance = new AppConfig("League Of Legends", "Home Page");
    return AppConfig.instance;
  }

  public static setAppTitle(title: string): void {
    AppConfig.getInstance().appTitle = title;
  }

  public static setPageTitle(title: string): void {
    AppConfig.getInstance().pageTitle = title;
  }

  public static getAppTitle() {
    return AppConfig.getInstance().appTitle;
  }

  public static getPageTitle() {
    return AppConfig.getInstance().pageTitle;
  }
}
