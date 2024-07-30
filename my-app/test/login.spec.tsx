import {test, expect, chromium} from '@playwright/test';
import data from "./SignData.json";
import autoSignInData from "./AutoSignInData.json";

const path = require('path');

const { credWithInvalidRole, credWithDifOrg, validCred } = data;
const credential = validCred.credential.raw.sad.d;

async function mockAuthCred(page: Page, credential) {
  await page.evaluate((data) => {
                      window.signifyClient.authorize = async () => {
                        return data;
                      };
                    }, credential);
}

test.describe('Tests Extension installation', () => {
    test.describe.configure({ mode: 'serial' })
    test('displays a message when the extension is not installed', async ({page}) => {
        await page.goto('/');

         // Locate the element with the data-testid attribute
        const titleElement = page.locator('[data-testid="webapp--title"]');
        await expect(page).toHaveTitle(await titleElement.textContent());

        // Check if the message "Extension is not installed" is visible
        await page.getByTestId("extension--not-installed-message").waitFor();

        // Check if the reload button is present and click it
        const reloadBtn = await page.getByTestId("webapp--reload");
        await expect(reloadBtn).toBeVisible();
        await reloadBtn.click;

        // ensuring the page is reloaded and the message still appears
        await page.waitForLoadState('load');
        await expect(page.getByTestId("extension--not-installed-message")).toBeVisible();
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
        await expect(page.getByTestId("webapp--header")).toBeVisible();

        await expect(page.getByTestId('login--configure--extn')).toBeVisible();
        await expect(page.getByTestId('login--select--cred')).toBeVisible();

        // Close the browser context
        await context.close();
    });
});

test.describe('Customer portal', () => {
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

    test('User has a valid wallet url but does not have the "EBA Submitter" role', async ({}) => {
        await page.goto('/');

       // Expose the mocked function to the page context
       await mockAuthCred(page,credWithInvalidRole);

        const selectCred = await page.getByTestId('login--select--cred');
        await selectCred.waitFor();
        await selectCred.click();

        const alert = page.locator('[role="alert"]');
        await alert.waitFor();

        // Assert that the alert contains the error message
        await expect(alert).toContainText('request was not found');
    });

    test('User has a valid wallet url and role but from unexpected organization', async ({}) => {
        await page.goto('/');

       // Expose the mocked function to the page context
       await mockAuthCred(page,credWithDifOrg);

        const selectCred = await page.getByTestId('login--select--cred')
        await selectCred.waitFor();
        await selectCred.click();

        const alert = page.locator('[role="alert"]');
        await alert.waitFor();

        // Assert that the alert contains the error message
        await expect(alert).toContainText('request was not found');
    });

    test('User has a valid wallet url, role and is from expected organization', async ({}) => {
        await page.goto('/');

        await mockAuthCred(page,validCred);

        const selectCred = await page.getByTestId('login--select--cred')
        await selectCred.waitFor();
        await selectCred.click();

        await page.locator(`text=${credential} is a valid credential`).waitFor();
        });
});
