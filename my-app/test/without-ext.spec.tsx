import { test, beforeAll, describe, expect, afterAll } from "vitest";
import { getFixutesExcludingExt, TestFixturesExcludingExt } from "./base";

let fixtures: TestFixturesExcludingExt;

beforeAll(async () => {
  fixtures = await getFixutesExcludingExt();
});

afterAll(async () => {
  await fixtures.teardown();
});

describe("Tests behaviour without extension", () => {
  test("displays a message when the extension is not installed", async () => {
    const { webapp } = fixtures;

    // Locate the element with the data-testid attribute
    const titleElement = await webapp.$('[data-testid="webapp--title"]');
    const titleText = await webapp.evaluate((el) => el?.textContent, titleElement);
    expect(await webapp.title()).toEqual(titleText);

    // Check if the message "Extension is not installed" is visible
    await webapp.waitForSelector('[data-testid="extension--not-installed-message"]');

    // Check if the reload button is present and click it
    const reloadBtn = await webapp.$('[data-testid="webapp--reload"]');
    expect(reloadBtn).not.toBeNull();
    await reloadBtn?.click();

    // ensuring the page is reloaded and the message still appears
    await webapp.waitForNavigation();
    await webapp.waitForSelector('[data-testid="extension--not-installed-message"]');
    expect(await webapp.$('[data-testid="extension--not-installed-message"]')).not.toBeNull();
  });
});
