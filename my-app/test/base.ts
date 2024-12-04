/* eslint-disable no-empty-pattern */
import * as puppeteer from "puppeteer";
import path from "path";
// import waitOn from "wait-on";
// import { exec } from "child_process";
// import kill from "tree-kill"
import ExtHelper, { waitForExtensionWorker } from "./ext-utils/extHelper";

export type ExtTestFixtures = {
  browser: puppeteer.Browser;
  context: puppeteer.BrowserContext;
  extensionId: string;
  extHelper: ExtHelper;
  backgroundPage: puppeteer.WebWorker;
  teardown: () => Promise<void>;
};

const EXTENSTION_PATH = path.resolve("extension/chrome");
const WEBAPP_URL = "http://localhost:3000";

export const getFixutes = async (): Promise<ExtTestFixtures> => {
  // const serverProcess = exec("npm run start");

  // await waitOn({ resources: [WEBAPP_URL] });

  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    slowMo: 5,
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
  // backgroundPage.evaluate("chrome.tabs.query = () => ([{ id: 1 }])");
  await webapp.goto(WEBAPP_URL);
  const title = await webapp.title();
  console.log("Page title:", title);

  // const popup = await getPopup(browser, backgroundPage);

  // Perform actions on the app page
  const extHelper = new ExtHelper(webapp, browser, backgroundPage, extensionId);

  const teardown = async () => {
    await browser.close();
    // kill(serverProcess.pid!, 'SIGKILL', (err) => {
    //   if (err) {
    //     console.error('Failed to kill server process:', err);
    //   } else {
    //     console.log('Server process terminated.');
    //   }
    // });
  };
  return { browser, context, extensionId, extHelper, backgroundPage, teardown };
};
