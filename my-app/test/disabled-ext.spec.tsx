import { test, beforeAll, describe, expect, afterAll } from "vitest";
import { getFixutes, TestFixtures } from "./base";

let fixtures: TestFixtures;

beforeAll(async () => {
  fixtures = await getFixutes();
});

afterAll(async () => {
  await fixtures.teardown();
});

describe("Tests behaviour when extension is disabled", () => {
  test("should disable extension and show demo credentials buttons", async () => {
    const { webapp } = fixtures;

    await webapp.locator('[data-testid="demo--extension-mode"]').click();
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);

    expect(alertText).toContain("Extension communication disabled");

    const [validRole, invalidRole, invalidSchema, invalidCrypt] = await Promise.all([
      webapp.waitForSelector('[data-testid="login--select--valid-role"]'),
      webapp.waitForSelector('[data-testid="login--select--invalid-role"]'),
      webapp.waitForSelector('[data-testid="login--select--invalid-schema"]'),
      webapp.waitForSelector('[data-testid="login--select--invalid-crypt"]'),
    ]);

    expect(validRole).not.toBeNull();
    expect(invalidRole).not.toBeNull();
    expect(invalidSchema).not.toBeNull();
    expect(invalidCrypt).not.toBeNull();
    await webapp.locator('[data-testid="alert-close-btn"]').click();
    await webapp.waitForSelector('[data-testid="alert-close-btn"]', { hidden: true });
  });

  test("should fail a credential login with INVALID ROLE", async () => {
    const { webapp } = fixtures;

    await webapp.locator('[data-testid="login--select--invalid-role"]').click();
    await webapp.waitForNetworkIdle({ timeout: 15_000 });
    await webapp.waitForSelector('[role="alert"]', { timeout: 10_000, visible: true });
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain(
      "status Credential unauthorized, info: Incorrect Role is not a valid submitter role"
    );
    await webapp.locator('[data-testid="alert-close-btn"]').click();
    await webapp.waitForSelector('[data-testid="alert-close-btn"]', { hidden: true });
  });

  test("should fail a credential login with INVALID SCHEMA", async ({}) => {
    const { webapp } = fixtures;

    await webapp.locator('[data-testid="login--select--invalid-schema"]').click();
    await webapp.waitForNetworkIdle({ timeout: 15_000 });
    await webapp.waitForSelector('[role="alert"]', { timeout: 10_000, visible: true });
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain(
      "w/ status Credential unauthorized, info: Can't authorize cred with OOR schema"
    );
    await webapp.locator('[data-testid="alert-close-btn"]').click();
    await webapp.waitForSelector('[data-testid="alert-close-btn"]', { hidden: true });
  });

  test("should fail a credential login with cryptographically invalid credential INVALID CRYPT", async ({}) => {
    const { webapp } = fixtures;

    await webapp.locator('[data-testid="login--select--invalid-crypt"]').click();
    await webapp.waitForNetworkIdle({ timeout: 15_000 });
    await webapp.waitForSelector('[role="alert"]', { timeout: 10_000, visible: true });
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("from body of request did not cryptographically verify");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
    await webapp.waitForSelector('[data-testid="alert-close-btn"]', { hidden: true });
  });

  test("should pass credential login with valid credential", async ({}) => {
    const { webapp } = fixtures;

    await webapp.locator('[data-testid="login--select--valid-role"]').click();
    await webapp.waitForNetworkIdle({ timeout: 15_000 });
    await webapp.waitForSelector('[role="alert"]', { timeout: 10_000, visible: true });
    const alertEle = await webapp.$('[role="alert"]');
    expect(alertEle).not.toBeNull();
    const alertText = await webapp.evaluate((el) => el?.textContent, alertEle);
    expect(alertText).toContain("has valid login account");
    await webapp.locator('[data-testid="alert-close-btn"]').click();
    await webapp.waitForSelector('[data-testid="alert-close-btn"]', { hidden: true });
  });
});
