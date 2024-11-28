import { Page, BrowserContext } from "@playwright/test";

export default class ExtPageHelper {
  readonly url: string;

  constructor(
    public readonly popup: Page,
    public readonly context: BrowserContext,
    public readonly extensionId: string
  ) {
    this.url = `chrome-extension://${extensionId}/src/pages/popup/index.html`; // `chrome-extension://${extensionId}/popup.html`;
  }

  async setViewportSize(): Promise<void> {
    return this.popup.setViewportSize({ width: 640, height: 400 }) // { width: 640, height: 386 }
  }

  async goToStartPage(bringToFront = true): Promise<void> {
    if (bringToFront) {
      await this.popup.bringToFront();
    }
    await this.popup.goto(this.url);
  }
  

  async navigateTo(tab: string): Promise<void> {
    await this.popup
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: tab })
      .click();
  }
}
