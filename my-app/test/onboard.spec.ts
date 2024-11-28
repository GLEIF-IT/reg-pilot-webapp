import { test, beforeAll, describe, expect, afterAll } from "vitest";
import { getFixutes, ExtTestFixtures } from "./base";

let fixtures: ExtTestFixtures;
beforeAll(async () => {
  fixtures = await getFixutes();
});

afterAll(async () => {
  await fixtures.browser.close();
});

describe("Onboarding > progressively onboard, starting with error conditions", () => {
  test("settings > should not proceed with empty agent or boot url", async () => {
    const { extHelper } = fixtures;
    const popupPage = extHelper.popup;

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
    const popupPage = extHelper.popup;
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
    const popupPage = extHelper.popup;
    // https://keria-dev.rootsid.cloud/admin
    // https://keria-dev.rootsid.cloud
    await popupPage
      .locator('[data-testid="settings-agent-url"]')
      .fill("https://keria-dev.rootsid.cloud/admin");
    // await popupPage.waitForSelector('[data-testid="settings-boot-url"]');
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
    const popupPage = extHelper.popup;
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
    const popupPage = extHelper.popup;
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
    const popupPage = extHelper.popup;
    await popupPage.locator('[data-testid="signin-passcode"]').fill("Ap31Xt-FGcNXpkxmBYMQn");
    await popupPage.waitForSelector('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    await popupPage.click('[data-testid="signin-connect"]');
    // popupPage.close()
  });

  test("webapp > make a select credential request", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForSelector('[data-testid="login--select--cred"]');
    await webapp.click('[data-testid="login--select--cred"]');
    await webapp.click('[data-testid="login--select--cred"]');
    await extHelper.popup.waitForSelector('[data-testid="select-credential-1"]', {
      timeout: 30_000,
    });

    await extHelper.popup.click('[data-testid="select-credential-1"]');
    await extHelper.popup.click('[data-testid="select-credential-1"]');
    await extHelper.popup.click('[data-testid="select-credential-1"]');

    await webapp.waitForSelector('[data-testid="select-signin-0"]', { timeout: 10_000 });
    await webapp.click('[data-testid="select-signin-0"]');
    await webapp.click('[data-testid="select-signin-0"]');

    await webapp.waitForSelector('[data-testid="select-signin-button"]', { timeout: 10_000 });
    await webapp.click('[data-testid="select-signin-button"]');
    await webapp.click('[data-testid="select-signin-button"]');

    // const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    // expect(alertText).toContain("has valid login account");
    // await webapp.waitForSelector('[data-testid="login--select--temp"]', {timeout: 40_000});
  });

  test("webapp > see success message after login request", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForNetworkIdle();
    await webapp.waitForSelector('[role="alert"]', { timeout: 10_000, visible: true });
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("has valid login account");
  });

  test("webapp > go to reports and upload after login", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForSelector('[data-testid="webapp--menu"]');
    await webapp.click('[data-testid="webapp--menu"]');
   
    await webapp.waitForSelector('[data-testid="webapp--menu--Reports"]', {timeout: 3_000, visible: true});
    await webapp.locator('[data-testid="webapp--menu--Reports"]').click();

    await webapp.waitForSelector("text=Upload your report");
  });

  test("webapp > see success message after login request", async () => {
    const { extHelper } = fixtures;
    const webapp = extHelper.webapp;
    await webapp.waitForSelector('[data-testid="login--select--temp"]', {timeout: 3_000});
  });
});
