import {test, expect, chromium} from '@playwright/test';
import fakeSigData from "./fakeSigData.json";
import autoSignInData from "./AutoSignInData.json";

const path = require('path');
const portalPage = [];
const newData = [{
              "submitter": "EO0KSgpgvjNFoc8KoFfb0qgjbrVieMVbBhNit7ZtEue3",
              "filename": "",
              "status": "",
              "contentType": "",
              "size": 0,
              "message": "No Reports Uploaded"
          }]


test.describe('Tests Extension installation', () => {
    test('displays a message when the extension is not installed', async ({page}) => {
        await page.goto('/');

        // Expect a title to have application title
        await expect(page).toHaveTitle(/EBA Demo by RootsID/);

        // Check if the message "Extension is not installed" is visible
        await expect(page.getByText(`Extension is not installed`)).toBeVisible({
            timeout: 10 * 1000
        });

        // Check if the reload button is present and click it
        await expect(page.locator('button:text("Reload")')).toBeVisible();
        await page.click('button:text("Reload")');

        // ensuring the page is reloaded and the message still appears
        await page.waitForLoadState('load');
        await expect(page.locator('text=Extension is not installed')).toBeVisible();
    });


    test('Display customer portal when extension is installed', async ({}) => {
        const extensionPath = path.resolve('extension/chrome/');
        const userDataDir = path.resolve('user-data');

        const context = await chromium.launchPersistentContext(userDataDir, { // Launch the browser with the extension
            headless: false,
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`
            ]
        });

        const page = await context.newPage();
        await page.goto('/');
        await expect(page.getByTestId("webapp.title")).toBeVisible();

        //await expect(page.locator('#configure-extension-btn')).toBeVisible();
        await expect(page.locator('button:has-text("Configure Extension")')).toBeVisible();

        await expect(page.locator('button:has-text("Select Credential")')).toBeVisible();
        // Close the browser context
        await context.close();
    });
});
test.describe('Customer portal', () => {
    test.describe.configure({ mode: 'serial' })
    let pages: Page
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
        pages = await context.newPage();
    });

    test.afterAll(async () => {
        console.log('Tests have finished, cleaning up...');
        await context.close();
    })

    test('select credential', async ({page}) => {
        await pages.goto('/');

       // Expose the mocked function to the page context
       await pages.evaluate((data) => {
                   // window.signifyClient = window.signifyClient || {};
                    window.signifyClient.authorizeCred = async () => {
                      return data;
                    };
                  }, fakeSigData);

        const selectCred = await pages.locator('#select-credential-btn');
        await selectCred.waitFor();
        await selectCred.click();

        await pages.locator('text=Success! Credential selected.').waitFor();
        await pages.pause()
        const button1 = await pages.$('button.MuiIconButton-root[aria-label="menu"]');
        await button1.click()
        const liElement = await pages.$('li.MuiListItem-root span.MuiListItemText-primary:has-text("Status")');
        await liElement.click()
        const button = pages.locator('button:has-text("Upload Report")')
                //await button.waitFor()
        await button.click()
        //portalPage.push({pages});

    });

//     test('checks the status page', async ({page}) => {
//         await pages.goto('/status');
//
//         const button = pages.locator('button:has-text("Upload Report")')
//         await button.waitFor()
//         await button.click()
//
// //         await portalPage.click('text="Upload Report"');
//         // Click on the label to trigger file selection
//         await pages.click('label[for="file-input"]');
//
//         // Wait for the file input to be attached to the DOM
//         await pages.waitForSelector('input[type="file"]', { state: 'attached' });
//
//         // Locate the hidden file input element and set the file
//         const fileInput = await pages.$('input[type="file"]');
//         await fileInput.setInputFiles('tests/Testing.zip'); // Replace with your file path
//
//         await pages.click('label[for="file-input"]');
//
//         await expect(pages.getByText(`Succesfully loaded report Testing.zip`)).toBeVisible({
//             timeout: 1000
//         });
//
//         await pages.click('text="Submit Report"');
//         await pages.waitForTimeout(30 * 1000);
//     });
//
//     test('checks the type of upload report page', async ({page}) => {
//         await pages.goto('/report');
//
//         await pages.click('text="Upload Report"');
//         // Click on the label to trigger file selection
//         await pages.click('label[for="file-input"]');
//
//         // Wait for the file input to be attached to the DOM
//         await pages.waitForSelector('input[type="file"]', { state: 'attached' });
//
//         // Locate the hidden file input element and set the file
//         const fileInput = await pages.$('input[type="file"]');
//         await fileInput.setInputFiles('tests/Testing.zip'); // Replace with your file path
//
//         await pages.click('label[for="file-input"]');
//
//         await expect(pages.getByText(`Succesfully loaded report Testing.zip`)).toBeVisible({
//             timeout: 1000
//         });
//
//         await pages.click('text="Submit Report"');
//         await pages.waitForTimeout(30 * 1000);
//     });
});
