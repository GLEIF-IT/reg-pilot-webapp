import { test, beforeAll, describe, expect, afterAll } from "vitest";
import { getFixutes, TestFixtures } from "./base";

let fixtures: TestFixtures;

beforeAll(async () => {
  fixtures = await getFixutes();
});

afterAll(async () => {
  await fixtures.teardown();
});

describe("Customer portal", () => {
  test("Display customer portal when extension is installed", async () => {
    const { webapp } = fixtures;
    await webapp.waitForSelector('[data-testid="webapp--header"]');
    const titleElement = await webapp.$('[data-testid="webapp--header"]');
    const titleText = await webapp.evaluate((el) => el?.textContent, titleElement);
    expect(titleText).toEqual("Customer Portal");
    expect(await webapp.waitForSelector('[data-testid="login--configure--extn"]')).not.toBeNull();
    expect(await webapp.waitForSelector('[data-testid="login--select--cred"]')).not.toBeNull();
  });

  test("should not access status without credential login", async ({}) => {
    const { webapp } = fixtures;

    await webapp.locator('[data-testid="login--select--cred"]').click();
    // Selector for the loading spinner within the button
    const spinnerSelector = '[data-testid="login--progressbar"]';
    // Wait for the spinner to appear
    await webapp.waitForSelector(spinnerSelector, { visible: true });

    // Check if the spinner is still present after some time
    await webapp
      .waitForSelector(spinnerSelector, { visible: true, timeout: 5000 })
      .catch(() => false);

    await webapp.waitForSelector('[data-testid="webapp--menu"]');
    await webapp.click('[data-testid="webapp--menu"]');

    await Promise.all([
      webapp.waitForSelector('[data-testid="webapp--menu--Status"]', {
        timeout: 3_000,
        visible: true,
      }),
      await webapp.locator('[data-testid="webapp--menu--Status"]').click(),
    ]);
    await webapp.waitForSelector('[data-testid="webapp--header"]');
    expect(webapp.url()).toMatch(/.*\?from=status/);
  });
});
