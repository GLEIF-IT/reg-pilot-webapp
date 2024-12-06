import { test, beforeAll, describe, expect, afterAll } from "vitest";
import path from "path";
import { getFixutes, TestFixtures } from "./base";


let fixtures: TestFixtures;

beforeAll(async () => {
  fixtures = await getFixutes();
});

afterAll(async () => {
  await fixtures.teardown();
});

describe("Tests reports status", () => {
  test("Extension mode off > Report is uploaded from an organization and same user should be able to see the file", async () => {
    const { webapp } = fixtures;
    await webapp.locator('[data-testid="demo--extension-mode"]').click();
    await webapp.locator('[data-testid="login--select--valid-role"]').click();
    await webapp.waitForNetworkIdle({ timeout: 15_000 });
    // webapp.locator(`text=has valid login account`)
    //report is uploaded
    await webapp.waitForSelector('[data-testid="webapp--menu"]');
    await webapp.click('[data-testid="webapp--menu"]');

    await Promise.all([
      webapp.waitForSelector('[data-testid="webapp--menu--Reports"]', {
        timeout: 3_000,
        visible: true,
      }),
      await webapp.locator('[data-testid="webapp--menu--Reports"]').click(),
    ]);
    await webapp.waitForSelector("text=Upload your report");

    const elementHandle = await webapp.$("input[type=file]");
    const FILE_PATH_SUCCESS = path.resolve(
      __dirname,
      "./files/signed.zip"
    );
    await elementHandle?.uploadFile(FILE_PATH_SUCCESS);
    await webapp.locator('[data-testid="reports--submit"]').click();
    await webapp.waitForSelector('[role="alert"]#reports--upload-msg', {
      timeout: 10_000,
      visible: true,
    });
    const alertEle = await webapp.$('[role="alert"]#reports--upload-msg');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("files in report package have been signed by submitter");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
    // await uploadReport(page);

    //Click check status button
    await webapp.locator('[data-testid="check--status"]').click();
    // const checkStatusBtn = await page.getByTestId("check--status");
    // await checkStatusBtn.waitFor();
    // await checkStatusBtn.click();

    // land on status page
    expect(webapp.url()).toMatch(/\/status/);

    //check status of file uploaded
    webapp.locator('[data-testid="status--grid"]');
    // const row = webapp.locator("tr");
    // await expect(row).toBeVisible();

    // // Locate the button within the first cell of the row
    // const button = row.locator('[data-testid="status--details"]');
    // await button.waitFor();
    // await button.click();

    await webapp.locator("text=Status:verified");

    //Enable extension
    // await switchExtensionMode(page);
  });
});
