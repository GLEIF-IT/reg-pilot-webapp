/* eslint-disable no-empty-pattern */
import * as puppeteer from "puppeteer";
import path from "path";
import ExtHelper, { waitForExtensionWorker, getPopup } from "./ext-utils/extHelper";

export type ExtTestFixtures = {
  browser: puppeteer.Browser;
  context: puppeteer.BrowserContext;
  extensionId: string;
  extHelper: ExtHelper;
  backgroundPage: puppeteer.WebWorker; // Page;
};

const EXTENSTION_PATH = path.resolve("extension/chrome");

export const getFixutes = async (): Promise<ExtTestFixtures> => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--disable-extensions-except=${EXTENSTION_PATH}`,
      `--load-extension=${EXTENSTION_PATH}`,
    ],
  });
  const version = await browser.version();
  console.log(`Puppeteer Chromium version: ${version}`);

  const context = await browser.createBrowserContext();
  const backgroundPage = await waitForExtensionWorker(browser);
  const extensionId = backgroundPage.url().split("/")[2];
  const webapp = await browser.newPage();
  backgroundPage.evaluate("chrome.tabs.query = () => ([{ id: 1 }])");
  await webapp.goto("http://localhost:3000");
  const title = await webapp.title();
  console.log("Page title:", title);

  const popup = await getPopup(browser, backgroundPage);
  
  // Perform actions on the app page
  const extHelper = new ExtHelper(popup, webapp, context, extensionId);
  return { browser, context, extensionId, extHelper, backgroundPage };
};
