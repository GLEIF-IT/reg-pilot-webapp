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

describe("Tests upload reports", () => {
  test("Extension mode on > User calls the upload API without authentication", async ({}) => {
    const { webapp } = fixtures;
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
    const FILE_PATH_SUCCESS = path.resolve(__dirname, "./files/Testing.zip");

    await elementHandle?.uploadFile(FILE_PATH_SUCCESS);
    await webapp.locator('[data-testid="reports--submit"]').click();

    // await webapp.waitForSelector('[role="alert"][data-testid="reports--load-success-msg"]');
    await webapp.locator('[data-testid="reports--submit"]').click();
    await webapp.waitForSelector('[role="alert"]#reports--upload-msg', {
      timeout: 10_000,
      visible: true,
    });
    const alertEle = await webapp.$('[role="alert"]#reports--upload-msg');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("Signify Client not connected");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
  });

//   test("User calls upload API is authenticated but one of the report is missing signature(extension mode off)", async ({}) => {
//     await page.goto("/");

//     //Extension is disabled
//     await switchExtensionMode(page);

//     const selectECRCred = await page.getByTestId("login--ecr-cred");
//     await selectECRCred.waitFor();
//     await selectECRCred.click();

//     await page.locator(`text=valid credential`).waitFor();
//     const menuBtn = await page.getByTestId("webapp--menu");
//     await menuBtn.click();

//     const liElement = await page.getByTestId("webapp--menu--Reports");
//     await liElement.click();

//     // Click on the label to trigger file selection
//     await page.click('label[for="file-input"]');

//     // Wait for the file input to be attached to the DOM
//     await page.waitForSelector('input[type="file"]', { state: "attached" });

//     // Locate the hidden file input element and set the file
//     const fileInput = await page.$('input[type="file"]');
//     await fileInput.setInputFiles("test/files/genMissingSignature.zip");

//     await page.click('label[for="file-input"]');

//     const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
//     await loadReportAlert.waitFor();

//     const reportSubmit = await page.getByTestId("reports--submit");
//     await reportSubmit.waitFor();
//     await reportSubmit.click();

//     const uploadAlert = page.locator('[role="alert"][data-testid="reports--upload-success-msg"]');
//     await uploadAlert.waitFor();

//     // Assert that the alert contains the error message
//     const errorMessage = page.getByText("files from report package missing valid signed");
//     await errorMessage.waitFor();
//   });

//   test("User calls the upload API is authenticated but has not signed the report (extension mode off)", async ({}) => {
//     await page.goto("/");

//     //Extension is disabled
//     await switchExtensionMode(page);

//     const selectECRCred = await page.getByTestId("login--ecr-cred");
//     await selectECRCred.waitFor();
//     await selectECRCred.click();

//     await page.locator(`text=valid credential`).waitFor();
//     const menuBtn = await page.getByTestId("webapp--menu");
//     await menuBtn.click();

//     const liElement = await page.getByTestId("webapp--menu--Reports");
//     await liElement.click();

//     // Click on the label to trigger file selection
//     await page.click('label[for="file-input"]');

//     // Wait for the file input to be attached to the DOM
//     await page.waitForSelector('input[type="file"]', { state: "attached" });

//     // Locate the hidden file input element and set the file
//     const fileInput = await page.$('input[type="file"]');
//     await fileInput.setInputFiles("test/files/genNoSignature.zip");

//     await page.click('label[for="file-input"]');

//     const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
//     await loadReportAlert.waitFor();

//     const reportSubmit = await page.getByTestId("reports--submit");
//     await reportSubmit.waitFor();
//     await reportSubmit.click();

//     const uploadAlert = page.locator('[role="alert"][data-testid="reports--upload-success-msg"]');
//     await uploadAlert.waitFor();

//     // Assert that the alert contains the error message
//     const errorMessage = page.getByText("9 files from report package missing valid signed");
//     await errorMessage.waitFor();
//   });

//   test("User calls the upload API is authenticated and has signed the report(extension mode off)", async ({}) => {
//     await page.goto("/");

//     //Disable extension
//     await switchExtensionMode(page);

//     const selectECRCred = await page.getByTestId("login--ecr-cred");
//     await selectECRCred.waitFor();
//     await selectECRCred.click();

//     await page.locator(`text=valid credential`).waitFor();
//     const menuBtn = await page.getByTestId("webapp--menu");
//     await menuBtn.click();

//     const liElement = await page.getByTestId("webapp--menu--Reports");
//     await liElement.click();

//     // Click on the label to trigger file selection
//     await page.click('label[for="file-input"]');

//     // Wait for the file input to be attached to the DOM
//     await page.waitForSelector('input[type="file"]', { state: "attached" });

//     // Locate the hidden file input element and set the file
//     const fileInput = await page.$('input[type="file"]');
//     await fileInput.setInputFiles("test/files/signed.zip");

//     await page.click('label[for="file-input"]');

//     const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
//     await loadReportAlert.waitFor();

//     const reportSubmit = await page.getByTestId("reports--submit");
//     await reportSubmit.waitFor();
//     await reportSubmit.click();

//     const uploadAlert = page.locator('[role="alert"][data-testid="reports--upload-success-msg"]');
//     await uploadAlert.waitFor();

//     // Assert that the alert contains the error message
//     const errorMessage = page.getByText("files in report package have been signed by submitter");
//     await errorMessage.waitFor();
//   });
});
