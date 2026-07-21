class AppConfig {
  private static instance?: AppConfig;
  public readonly appTitle: string;
  public readonly pageTitle: string;

  private constructor(appTitle: string, pageTitle: string) {
    this.appTitle = appTitle;
    this.pageTitle = pageTitle;
  }

  public static getInstance(): AppConfig {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }

    AppConfig.instance = new AppConfig("League Of Legends", "Home Page");
    return AppConfig.instance;
  }
}
