import { test, beforeAll, describe, expect, afterAll } from "vitest";
import path from "path";
import { getFixutes, ExtTestFixtures } from "./base";

let fixtures: ExtTestFixtures;
beforeAll(async () => {
  fixtures = await getFixutes();
});

afterAll(async () => {
  await fixtures.teardown();
});

function waitFor(time): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

describe("Onboarding > progressively onboard, starting with error conditions", () => {
  test("settings > should not proceed with empty agent or boot url", async () => {
    const { extHelper } = fixtures;

    const popupPage = await extHelper.getOpenedPopup();
    await popupPage.waitForSelector('[data-testid="settings-save"]');
    await popupPage.click('[data-testid="settings-save"]');

    const [agentUrlError, bootUrlError] = await Promise.all([
      popupPage.$('[data-testid="settings-agent-url-error"]'),
      popupPage.$('[data-testid="settings-boot-url-error"]'),
    ]);

    expect(agentUrlError).not.toBeNull();
    expect(bootUrlError).not.toBeNull();

    const [agentErrorText, bootErrorText] = await Promise.all([
      popupPage.evaluate((el) => el?.textContent, agentUrlError),
      popupPage.evaluate((el) => el?.textContent, bootUrlError),
    ]);
    // Validate the error messages
    expect(agentErrorText).toEqual("Enter a valid url");
    expect(bootErrorText).toEqual("Enter a valid url");
  });

  test("settings > should not proceed with invalid agent or boot url", async () => {
    const { extHelper } = fixtures;
    const popupPage = await extHelper.getOpenedPopup();
    await popupPage.locator('[data-testid="settings-agent-url"]').fill("not a valid URL");
    await popupPage.locator('[data-testid="settings-boot-url"]').fill("not a valid URL");
    const [agentUrlError, bootUrlError] = await Promise.all([
      popupPage.$('[data-testid="settings-agent-url-error"]'),
      popupPage.$('[data-testid="settings-boot-url-error"]'),
    ]);

    expect(agentUrlError).not.toBeNull();
    expect(bootUrlError).not.toBeNull();

    const [agentErrorText, bootErrorText] = await Promise.all([
      popupPage.evaluate((el) => el?.textContent, agentUrlError),
      popupPage.evaluate((el) => el?.textContent, bootUrlError),
    ]);

    expect(agentErrorText).toEqual("Enter a valid url");
    expect(bootErrorText).toEqual("Enter a valid url");
  });
  test("settings > should proceed to Signin page with valid agent and boot url", async () => {
    const { extHelper } = fixtures;
    const popupPage = await extHelper.getOpenedPopup();
    // https://keria-dev.rootsid.cloud/admin
    // https://keria-dev.rootsid.cloud
    await popupPage
      .locator('[data-testid="settings-agent-url"]')
      .fill("https://keria-dev.rootsid.cloud/admin");
    await popupPage
      .locator('[data-testid="settings-boot-url"]')
      .fill("https://keria-dev.rootsid.cloud");
    await popupPage
      .locator('[data-testid="settings-boot-url"]')
      .fill("https://keria-dev.rootsid.cloud");
    await popupPage.waitForSelector('[data-testid="settings-save"]');
    await popupPage.click('[data-testid="settings-save"]');
    await popupPage.click('[data-testid="settings-save"]');
    await popupPage.waitForSelector('[data-testid="signin-connect"]');
    const signinBtn = await popupPage.$('[data-testid="signin-connect"]');
    expect(signinBtn).not.toBeNull();
  });
  test("singin > should throw error for passcode length", async () => {
    const { extHelper } = fixtures;
    const popupPage = await extHelper.getOpenedPopup();
    await popupPage.locator('[data-testid="signin-passcode"]').fill("bran not 21");
    await popupPage.waitForSelector('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    const signinError = await popupPage.$('[data-testid="signin-passcode-error"]');
    expect(signinError).not.toBeNull();
    const signinErrorText = await popupPage.evaluate((el) => el?.textContent, signinError);
    expect(signinErrorText).toEqual("bran must be 21 characters");
  });
  test("singin > should throw error for invalid passcode", async () => {
    const { extHelper } = fixtures;
    const popupPage = await extHelper.getOpenedPopup();
    await popupPage.locator('[data-testid="signin-passcode"]').fill("nf98hUHUy8Vt5tvdyaYV1");
    await popupPage.waitForSelector('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    await popupPage.waitForSelector('[data-testid="signin-passcode-error"]');
    const signinError = await popupPage.$('[data-testid="signin-passcode-error"]');
    expect(signinError).not.toBeNull();
    const signinErrorText = await popupPage.evaluate((el) => el?.textContent, signinError);
    expect(signinErrorText).toContain("agent does not exist for controller");
  });
  test("singin > signin user with correct passcode", async () => {
    const { extHelper } = fixtures;
    const popupPage = await extHelper.getOpenedPopup();
    await popupPage.locator('[data-testid="signin-passcode"]').fill("Ap31Xt-FGcNXpkxmBYMQn");
    await popupPage.waitForSelector('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    await popupPage.waitForNetworkIdle({ idleTime: 1_000 });
    await popupPage.close();
  });

  test("webapp > make a select credential request", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForSelector('[data-testid="login--select--cred"]');
    await webapp.click('[data-testid="login--select--cred"]');
    await webapp.click('[data-testid="login--select--cred"]');
    await webapp.waitForSelector('[data-testid="dialog-title"]');
    const popupPage = await extHelper.getOpenedPopup();
    await popupPage.locator('[data-testid="select-credential-1"]').click();

    await webapp.waitForSelector('[data-testid="select-signin-0"]', { timeout: 40_000 });
    await webapp.click('[data-testid="select-signin-0"]');
    await webapp.click('[data-testid="select-signin-0"]');

    await webapp.waitForSelector('[data-testid="select-signin-button"]', { timeout: 10_000 });
    await webapp.click('[data-testid="select-signin-button"]');
    await webapp.click('[data-testid="select-signin-button"]');
  });

  test("webapp > see success message after login request", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForNetworkIdle({ timeout: 15_000 });
    await webapp.waitForSelector('[role="alert"]', { timeout: 10_000, visible: true });
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("has valid login account");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
  });

  test("webapp > go to reports after login", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForSelector('[data-testid="webapp--menu"]');
    await webapp.click('[data-testid="webapp--menu"]');

    await Promise.all([
      webapp.waitForSelector('[data-testid="webapp--menu--Reports"]', {
        timeout: 3_000,
        visible: true,
      }),
      await webapp.locator('[data-testid="webapp--menu--Reports"]').click(),
    ]);

    // await webapp.locator('[data-testid="webapp--menu--Reports"]').click();

    await webapp.waitForSelector("text=Upload your report");
  });

  test("webapp > report > upload file with success", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    // await webapp.waitForSelector('[for="file-input"]', { timeout: 10_000 });
    const elementHandle = await webapp.$("input[type=file]");
    const FILE_PATH_SUCCESS = path.resolve(
      __dirname,
      "./reports-dev/signed/DUMMYLEI123456789012.CON_FR_PILLAR3010000_CONDIS_2023-12-31_20230405102913000_signed.zip"
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
    expect(alertText).toContain("have been signed by known AIDs from the LEI");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
  });

  test("webapp > report > upload file with invalid signature", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    // await webapp.waitForSelector('[for="file-input"]', { timeout: 10_000 });
    const elementHandle = await webapp.$("input[type=file]");
    const FILE_PATH_FAILURE = path.resolve(
      __dirname,
      "./reports-dev/failed/genMissingSignature_DUMMYLEI123456789012.CON_FR_PILLAR3010000_CONDIS_2023-12-31_20230405102913000_signed.zip"
    );
    await elementHandle?.uploadFile(FILE_PATH_FAILURE);
    await webapp.locator('[data-testid="reports--submit"]').click();
    await webapp.waitForSelector('[role="alert"]#reports--upload-msg', {
      timeout: 10_000,
      visible: true,
    });
    const alertEle = await webapp.$('[role="alert"]#reports--upload-msg');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("from report package missing valid signature");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
  });

  test("temp > temp waiting for invalid element", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForSelector('[data-testid="login--select--temp"]', { timeout: 3_000 });
  });
});
