/* eslint-disable no-empty-pattern */
import { test as base, chromium, Page, Worker } from "@playwright/test";
import path from "path";
import ExtPageHelper from "./ext-utils/extPageHelper";

// Re-exporting so we don't mix imports
export { expect } from "@playwright/test";

type ExtTestFixtures = {
  extensionId: string;
  extPageHelper: ExtPageHelper;
  backgroundPage: Worker; // Page;
};

/**
 * Extended instance of playwright's `test` with our fixtures
 */
export const test = base.extend<ExtTestFixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.resolve("extension/chrome"); // path.resolve(__dirname, "../dist/chrome");
    const context = await chromium.launchPersistentContext("", {
      // set to some path in order to store browser session data
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      permissions: ["clipboard-read", "clipboard-write"],
    });
    await use(context);
    await context.close();
  },
  backgroundPage: async ({ context }, use) => {
    // for manifest v2:
    // let [background] = context.backgroundPages();
    // if (!background) background = await context.waitForEvent("backgroundpage");

    // await background.route(/app\.posthog\.com/i, async (route) =>
    //   route.fulfill({ json: { status: 1 } })
    // );

    // await background.waitForResponse(/api\.coingecko\.com/i);

    // // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent("serviceworker");
    await use(background);
  },
  extensionId: async ({ backgroundPage }, use) => {
    const extensionId = backgroundPage.url().split("/")[2];
    await use(extensionId);
  },
  extPageHelper: async ({ page, context, extensionId }, use) => {
    const helper = new ExtPageHelper(page, context, extensionId);
    await use(helper);
  },
  // assetsHelper: async ({ page, walletPageHelper, context }, use) => {
  //   const helper = new AssetsHelper(page, walletPageHelper, context);
  //   await use(helper);
  // },
  // transactionsHelper: async ({ page, walletPageHelper }, use) => {
  //   const helper = new TransactionsHelper(page, walletPageHelper);
  //   await use(helper);
  // },
});

