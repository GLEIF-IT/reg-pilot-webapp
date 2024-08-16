import {test, expect, chromium} from '@playwright/test';

import data from "./SignData.json";

const { credWithInvalidRole, credWithDifOrg, validCred } = data;
const credential = validCred.credential.raw.sad.d;
const path = require('path');

async function switchExtensionMode(page: Page) {
  const extensionMode = await page.getByTestId("demo--extension-mode");
  await extensionMode.waitFor();
  await extensionMode.click();
}

test.describe('Tests upload reports', () => {
    test.describe.configure({ mode: 'serial' })
    let page: Page
    let context: BrowserContext

    test.beforeAll(async () => {
        const extensionPath = path.resolve('extension/chrome/');
        const userDataDir = path.resolve('user-data');

        // Launch the browser with the extension
        context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            args: [
                 `--disable-extensions-except=${extensionPath}`,
                 `--load-extension=${extensionPath}`
            ]
        });
        page = await context.newPage();
    });

    test.afterAll(async () => {
        console.log('Tests have finished, cleaning up...');
        await context.close();
    })

    test('User calls the upload API without authentication(extension mode on)', async ({}) => {
        await page.goto('/');
        const menuBtn = await page.getByTestId("webapp--menu");
        await menuBtn.click()

        const liElement = await page.getByTestId("webapp--menu--Reports");
        await liElement.click();

        // Click on the label to trigger file selection
        await page.click('label[for="file-input"]');

        // Wait for the file input to be attached to the DOM
        await page.waitForSelector('input[type="file"]', { state: 'attached' });

        // Locate the hidden file input element and set the file
        const fileInput = await page.$('input[type="file"]');
        await fileInput.setInputFiles('test/files/Testing.zip'); // Replace with your file path

        await page.click('label[for="file-input"]');

        const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
        await loadReportAlert.waitFor();

        const reportSubmit = await page.getByTestId("reports--submit")
        await reportSubmit.waitFor();
        await reportSubmit.click();

        const uploadErrorAlert = page.locator('[role="alert"][data-testid="reports--upload-error-msg"]');
        await uploadErrorAlert.waitFor();

        await page.getByText("Signify Client not connected").waitFor();
    });

    test('User calls upload API is authenticated but one of the report is missing signature(extension mode off)', async ({}) => {
            await page.goto('/');

            //Extension is disabled
            await switchExtensionMode(page);

            const selectECRCred = await page.getByTestId("login--ecr-cred")
            await selectECRCred.waitFor();
            await selectECRCred.click();

            await page.locator(`text=valid credential`).waitFor();
            const menuBtn = await page.getByTestId("webapp--menu");
            await menuBtn.click()

            const liElement = await page.getByTestId("webapp--menu--Reports");
            await liElement.click();

            // Click on the label to trigger file selection
            await page.click('label[for="file-input"]');

            // Wait for the file input to be attached to the DOM
            await page.waitForSelector('input[type="file"]', { state: 'attached' });

            // Locate the hidden file input element and set the file
            const fileInput = await page.$('input[type="file"]');
            await fileInput.setInputFiles('test/files/genMissingSignature.zip');

            await page.click('label[for="file-input"]');

            const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
            await loadReportAlert.waitFor();

            const reportSubmit = await page.getByTestId("reports--submit")
            await reportSubmit.waitFor();
            await reportSubmit.click();

            const uploadAlert = page.locator('[role="alert"][data-testid="reports--upload-success-msg"]');
            await uploadAlert.waitFor();

            // Assert that the alert contains the error message
            const errorMessage = page.getByText('files from report package missing valid signed');
            await errorMessage.waitFor();
    });

    test('User calls the upload API is authenticated but has not signed the report (extension mode off)', async ({}) => {
            await page.goto('/');

            //Extension is disabled
            await switchExtensionMode(page);

            const selectECRCred = await page.getByTestId("login--ecr-cred")
            await selectECRCred.waitFor();
            await selectECRCred.click();

            await page.locator(`text=valid credential`).waitFor();
            const menuBtn = await page.getByTestId("webapp--menu");
            await menuBtn.click()

            const liElement = await page.getByTestId("webapp--menu--Reports");
            await liElement.click();

            // Click on the label to trigger file selection
            await page.click('label[for="file-input"]');

            // Wait for the file input to be attached to the DOM
            await page.waitForSelector('input[type="file"]', { state: 'attached' });

            // Locate the hidden file input element and set the file
            const fileInput = await page.$('input[type="file"]');
            await fileInput.setInputFiles('test/files/genNoSignature.zip');

            await page.click('label[for="file-input"]');

            const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
            await loadReportAlert.waitFor();

            const reportSubmit = await page.getByTestId("reports--submit")
            await reportSubmit.waitFor();
            await reportSubmit.click();

            const uploadAlert = page.locator('[role="alert"][data-testid="reports--upload-success-msg"]');
            await uploadAlert.waitFor();

            // Assert that the alert contains the error message
            const errorMessage = page.getByText('9 files from report package missing valid signed');
            await errorMessage.waitFor();
    });

    test('User calls the upload API is authenticated and has signed the report(extension mode off)', async ({}) => {
            await page.goto('/');

            //Disable extension
            await switchExtensionMode(page);

            const selectECRCred = await page.getByTestId("login--ecr-cred")
            await selectECRCred.waitFor();
            await selectECRCred.click();

            await page.locator(`text=valid credential`).waitFor();
            const menuBtn = await page.getByTestId("webapp--menu");
            await menuBtn.click()

            const liElement = await page.getByTestId("webapp--menu--Reports");
            await liElement.click();

            // Click on the label to trigger file selection
            await page.click('label[for="file-input"]');

            // Wait for the file input to be attached to the DOM
            await page.waitForSelector('input[type="file"]', { state: 'attached' });

            // Locate the hidden file input element and set the file
            const fileInput = await page.$('input[type="file"]');
            await fileInput.setInputFiles('test/files/signed.zip');

            await page.click('label[for="file-input"]');

            const loadReportAlert = page.locator('[role="alert"][data-testid="reports--load-success-msg"]');
            await loadReportAlert.waitFor();

            const reportSubmit = await page.getByTestId("reports--submit")
            await reportSubmit.waitFor();
            await reportSubmit.click();

            const uploadAlert = page.locator('[role="alert"][data-testid="reports--upload-success-msg"]');
            await uploadAlert.waitFor();

            // Assert that the alert contains the error message
            const errorMessage = page.getByText('files in report package have been signed by submitter');
            await errorMessage.waitFor();
     });
});