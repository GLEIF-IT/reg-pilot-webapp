import { Page, BrowserContext } from "puppeteer";
import * as puppeteer from "puppeteer";

/**
 * Gets an extension ID from a URL.
 *
 * @param url URL to match against.
 * @returns Extension ID.
 * @throws If URL is not expected format.
 */
export function getExtensionId(url: string) {
  const urlRegex = /chrome-extension:\/\/(?<id>[a-z]+)/;
  const match = urlRegex.exec(url);

  if (!match || !match.groups) {
    throw new Error("Extension URL does not match expected format");
  }

  return match.groups.id;
}

/**
 * Waits for an extension worker to load. If omitted, returns the first
 * worker to load without checking the ID.
 *
 * @param browser Browser to wait for background page in.
 * @param id ID of extension. Returns first extension to load if omitted.
 */
export async function waitForExtensionWorker(
  browser: puppeteer.Browser,
  id?: string
): Promise<puppeteer.WebWorker> {
  const idMatches = (target: puppeteer.Target) => (id ? getExtensionId(target.url()) === id : true);

  // See https://pptr.dev/guides/chrome-extensions
  const workerTarget = await browser.waitForTarget((target) => {
    return target.type() === "service_worker" && idMatches(target);
  });
  return workerTarget.worker();
}

/**
 * Attempts to open the browser popup.
 *
 * @param browser Browser to open the popup in.
 * @param background Background page of the extension.
 * @param path Path to open.
 *
 * @returns Page representing the popup context.
 */
async function openPopup(
  browser: puppeteer.Browser,
  worker: puppeteer.WebWorker,
  path: string
): Promise<puppeteer.Page> {
  const extensionId = getExtensionId(worker.url());
  console.log("extensionId", extensionId);
  await worker.evaluate("chrome.action.openPopup();");
  const popup = await browser.waitForTarget(
    (target) =>
      target.type() === "page" && target.url() === `chrome-extension://${extensionId}${path}`
  );
  // We specified that we wanted a page in our condition above but what we
  // get back is not actually a page. This is due to a type mismatch caused by
  // an implementation detail in Chromium (https://crbug.com/1515626)
  return popup.asPage();
}

function getPopup(browser, backgroundPage): Promise<puppeteer.Page> {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const popup = await openPopup(browser, backgroundPage, "/src/pages/popup/index.html");
      resolve(popup);
    }, 2 * 1000);
  });
}

export default class ExtHelper {
  readonly url: string;
  #popup: Page;
  // // setter getter for popup
  // get popup(): Page {
  //   this.#popup.is
  //   return this.#popup;
  // }
  // set popup(value: Page) {
  //   this.#popup = value;
  // }

  constructor(
    public readonly browser: puppeteer.Browser,
    public readonly backgroundPage: puppeteer.WebWorker,
    public readonly extensionId: string
  ) {
    this.url = `chrome-extension://${extensionId}/src/pages/popup/index.html`;
  }

  async initializePopup(): Promise<void> {
    this.#popup = await getPopup(this.browser, this.backgroundPage);
  }

  async getOpenedPopup(): Promise<Page> {
    return new Promise(async (resolve) => {
      if(!this.#popup || this.#popup.isClosed()){
        await this.initializePopup();
      }
      resolve(this.#popup);
    });
  }

  async goToStartPage(bringToFront = true): Promise<void> {
    if (bringToFront) {
      await this.#popup.bringToFront();
    }
    await this.#popup.goto(this.url);
  }
}
