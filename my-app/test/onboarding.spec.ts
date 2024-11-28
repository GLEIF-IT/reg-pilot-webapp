import { test as base } from "@playwright/test";
import { test, expect } from "./utils";
// import { getOnboardingPage } from "../utils/onboarding"

test.describe("Onboarding", () => {
  test("settings > progressively onboard, starting with error conditions", async ({
    page: popup,
    extensionId,
    extPageHelper,
    context
  }) => {
    await extPageHelper.setViewportSize();
    await extPageHelper.goToStartPage();

    await base.step("settings > should not proceed with empty agent or boot url", async () => {
      await popup.waitForTimeout(1000);
      await popup.getByTestId("settings-save").click();
      expect(await popup.getByTestId("settings-agent-url-error").textContent()).toEqual(
        "Enter a valid url"
      );
      expect(await popup.getByTestId("settings-boot-url-error").textContent()).toEqual(
        "Enter a valid url"
      );
    });

    await base.step("settings > should not proceed with invalid agent or boot url", async () => {
      await popup.getByTestId("settings-agent-url").fill("not a valid URL");
      await popup.getByTestId("settings-boot-url").fill("not a valid URL");
      await popup.getByTestId("settings-boot-url").blur();
      await popup.waitForTimeout(2000);

      expect(await popup.getByTestId("settings-agent-url-error").textContent()).toEqual(
        "Enter a valid url"
      );

      expect(await popup.getByTestId("settings-boot-url-error").textContent()).toEqual(
        "Enter a valid url"
      );
    });

    await base.step(
      "settings > should proceed to Signin page with valid agent and boot url",
      async () => {
        // https://keria-dev.rootsid.cloud/admin
        // https://keria-dev.rootsid.cloud
        await popup.getByTestId("settings-agent-url").fill("https://keria-dev.rootsid.cloud/admin");
        await popup.waitForTimeout(1000);
        await popup.getByTestId("settings-boot-url").fill("https://keria-dev.rootsid.cloud");
        await popup.getByTestId("settings-boot-url").blur();
        await popup.waitForTimeout(1000);
        await popup.getByTestId("settings-save").click();
        await popup.waitForTimeout(1000);

        expect(await popup.getByText("Connect").textContent()).toEqual("Connect");
        await popup.waitForTimeout(2000);
      }
    );

    await base.step("singin > should throw error for passcode length", async () => {
      await popup.getByTestId("signin-passcode").fill("bran not 21");
      await popup.getByTestId("signin-connect").click();
      await popup.waitForTimeout(2000);
      const _error = popup.getByTestId("signin-passcode-error").textContent();
      expect(await _error).toContain("bran must be 21 characters");
      await popup.waitForTimeout(2000);
    });

    await base.step("singin > should throw error for invalid passcode", async () => {
      await popup.getByTestId("signin-passcode").fill("nf98hUHUy8Vt5tvdyaYV1");
      await popup.getByTestId("signin-passcode").blur();
      await popup.waitForTimeout(1000);
      await popup.getByTestId("signin-connect").click();
      await popup.waitForTimeout(2000);
      const _error = popup.getByTestId("signin-passcode-error").textContent();
      expect(await _error).toContain("agent does not exist for controller");
    });

    await base.step("singin > signin user with correct passcode", async () => {
      await popup.getByTestId("signin-passcode").fill("Ap31Xt-FGcNXpkxmBYMQn");
      await popup.getByTestId("signin-passcode").blur();
      await popup.waitForTimeout(1000);
      await popup.getByTestId("signin-connect").click();
      await popup.waitForTimeout(12000);
    });

    // await base.step("temp > open new tab with ", async () => {
    //   // open "/" in a new tab
    //   const page = await context.newPage();
    //   await page.goto("/");
    //   await popup.waitForTimeout(8000);
    // });
  });

  //   test("User can onboard with a existing seed-phrase", async ({
  //     context,
  //     page: popup,
  //     walletPageHelper,
  //   }) => {
  //     const wallet = Wallet.createRandom()
  //     const page = await getOnboardingPage(context)

  //     await page.getByRole("button", { name: "Use existing wallet" }).click()
  //     await page.getByRole("button", { name: "Import recovery phrase" }).click()
  //     await page.locator('input[name="password"]').fill("12345678")
  //     await page.locator('input[name="confirm_password"]').fill("12345678")
  //     await page.getByRole("button", { name: "Begin the hunt" }).click()

  //     await page
  //       .getByRole("textbox", { name: "Input recovery phrase" })
  //       .fill(wallet.mnemonic.phrase)

  //     await page.getByRole("button", { name: "Import account" }).click()
  //     await expect(
  //       page.getByRole("heading", { name: "Welcome to Taho" }),
  //     ).toBeVisible()

  //     await walletPageHelper.setViewportSize()
  //     await walletPageHelper.goToStartPage()

  //     await popup.getByTestId("top_menu_profile_button").last().hover()

  //     await popup.getByRole("button", { name: "Copy address" }).click()

  //     const address = await popup.evaluate(() => navigator.clipboard.readText())

  //     expect(address.toLowerCase()).toEqual(wallet.address.toLowerCase())
  //   })

  //   test("User can onboard with a new seed-phrase", async ({
  //     context,
  //     page: popup,
  //     walletPageHelper,
  //   }) => {
  //     const page = await getOnboardingPage(context)

  //     await page.getByRole("button", { name: "Create new wallet" }).click()
  //     await page.locator('input[name="password"]').fill("12345678")
  //     await page.locator('input[name="confirm_password"]').fill("12345678")

  //     await page.getByRole("button", { name: "Begin the hunt" }).click()
  //     await page.getByRole("button", { name: "Create recovery phrase" }).click()

  //     // Wait for the seed phrase to load.
  //     const seedPhraseWord = await page.locator(".seed_phrase .word")
  //     await expect(seedPhraseWord).toHaveCount(24)

  //     // Extract seed into an array of words with no spaces or dashes.
  //     const seedWords = (
  //       await page.locator(".seed_phrase .word").allTextContents()
  //     ).map((word) => word.replace(/-|\s/, ""))

  //     await page.getByRole("button", { name: "I wrote it down" }).click()

  //     const seedWordPlaceholders = page.getByTestId(
  //       "verify_seed_word_placeholder",
  //     )

  //     // Extract the ids of the seed phrase words that need to be verified and
  //     // store them as an array of numbers.
  //     const wordsToVerify = (await seedWordPlaceholders.allTextContents()).map(
  //       (word) => Number((word.match(/\d+/) ?? ["0"])[0]),
  //     )

  //     const wordsInWrongOrder = wordsToVerify.slice(0, -2).concat(
  //       // last 2 in wrong order
  //       wordsToVerify.slice(-2).reverse(),
  //     )

  //     // eslint-disable-next-line no-restricted-syntax
  //     for (const wordPos of wordsInWrongOrder) {
  //       const word = seedWords[wordPos - 1]

  //       // eslint-disable-next-line no-await-in-loop
  //       await page
  //         .getByTestId("remaining_seed_words")
  //         .getByRole("button", { name: word })
  //         .first() // There could be repeated words
  //         .click()
  //     }

  //     await page.getByRole("button", { name: "Verify recovery phrase" }).click()

  //     await expect(
  //       page.getByRole("button", { name: "Incorrect Order" }),
  //     ).toBeVisible()

  //     // Remove all to start over in valid order
  //     // eslint-disable-next-line no-restricted-syntax
  //     for (const placeholder of await seedWordPlaceholders.all()) {
  //       // eslint-disable-next-line no-await-in-loop
  //       await placeholder.click()
  //     }

  //     // Focus first placeholder
  //     await seedWordPlaceholders.first().click()

  //     // eslint-disable-next-line no-restricted-syntax
  //     for (const wordPos of wordsToVerify) {
  //       const word = seedWords[wordPos - 1]

  //       // eslint-disable-next-line no-await-in-loop
  //       await page
  //         .getByTestId("remaining_seed_words")
  //         .getByRole("button", { name: word })
  //         .click()
  //     }

  //     await expect(page.getByRole("button", { name: "Verified" })).toBeVisible()
  //     await page.getByRole("button", { name: "Finalize" }).click()

  //     await expect(
  //       page.getByRole("heading", { name: "Welcome to Taho" }),
  //     ).toBeVisible()

  //     await walletPageHelper.setViewportSize()
  //     await walletPageHelper.goToStartPage()

  //     // If the popup finished rendering then we were able to onboard successfully
  //     await expect(
  //       popup.getByTestId("top_menu_network_switcher").last(),
  //     ).toHaveText("Ethereum")
  //   })

  // test.afterAll(async ({ context }) => {
  //   await context.close();
  // });
});
