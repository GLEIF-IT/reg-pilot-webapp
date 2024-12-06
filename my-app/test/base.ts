/* eslint-disable no-empty-pattern */
import * as puppeteer from "puppeteer";
import path from "path";
// import waitOn from "wait-on";
// import { exec } from "child_process";
// import kill from "tree-kill"
import ExtHelper, { waitForExtensionWorker } from "./ext-utils/extHelper";

export type TestFixtures = {
  browser: puppeteer.Browser;
  context: puppeteer.BrowserContext;
  webapp: puppeteer.Page;
  teardown: () => Promise<void>;
  extHelper: ExtHelper;
};

export type TestFixturesExcludingExt = Omit<TestFixtures, "extHelper">;

const EXTENSTION_PATH = path.resolve("extension/chrome");
const WEBAPP_URL = "http://localhost:3000";

const loadBrowserFixutes = async (loadExtension = false): Promise<TestFixturesExcludingExt> => {
  // const serverProcess = exec("npm run start");

  // await waitOn({ resources: [WEBAPP_URL] });
  const args = ["--no-sandbox", "--disable-setuid-sandbox"];
  if (loadExtension) {
    args.push(`--disable-extensions-except=${EXTENSTION_PATH}`);
    args.push(`--load-extension=${EXTENSTION_PATH}`);
  }

  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    slowMo: 5,
    args,
  });
  const version = await browser.version();
  console.log(`Puppeteer Chromium version: ${version}`);

  const context = await browser.createBrowserContext();
  const webapp = await browser.newPage();
  await webapp.goto(WEBAPP_URL);
  const title = await webapp.title();
  console.log("Page title:", title);

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

  return { browser, context, teardown, webapp };
};

export const getFixutesExcludingExt = async (): Promise<TestFixturesExcludingExt> => {
  const { browser, context, teardown, webapp } = await loadBrowserFixutes();
  return { browser, context,  teardown, webapp };
};

export const getFixutes = async (): Promise<TestFixtures> => {
  const { browser, context, teardown, webapp } = await loadBrowserFixutes(true);
  const backgroundPage = await waitForExtensionWorker(browser);
  const extensionId = backgroundPage.url().split("/")[2];

  // extension helper class
  const extHelper = new ExtHelper(browser, backgroundPage, extensionId);

  return { browser, context, extHelper, teardown, webapp };
};
