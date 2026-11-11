import { expect, test } from "@playwright/test";

const GREETINGS: Array<[string, string]> = [
  ["silav", "hello"],
  ["spas", "thank you"],
  ["roj baş", "good day"],
  ["êvar baş", "good evening"],
  ["şev baş", "good night"],
];

test("completes U1 L1, persists progress, and shows it on the dashboard", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Silav, xwendekar!" }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: /Continue: Hello and introductions/ })
    .click();
  await expect(page).toHaveURL(/\/learn\/u01-l1$/);

  // 1. Multiple choice: meaning of "Ez Anna me".
  await page.getByRole("radio", { name: "I am Anna." }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 2. Multiple choice: where Ehmed is from.
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Tirkiye" }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 3. Vocabulary match: tap each Kurdish item, then its English match.
  await page.getByRole("button", { name: "Continue" }).click();
  for (const [ku, en] of GREETINGS) {
    await page.getByRole("button", { name: ku, exact: true }).click();
    await page.getByRole("button", { name: en, exact: true }).click();
  }
  await page.getByRole("button", { name: "Check matches" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 4. Fill in the blank: vowel-final copula "me".
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox").fill("me");
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 5. Fill in the blank: consonant-final copula "im".
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox").fill("im");
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 6. Sentence builder: tap the words in order.
  await page.getByRole("button", { name: "Continue" }).click();
  for (const word of ["Ez", "ji", "Almanyayê", "me"]) {
    await page.getByRole("button", { name: word, exact: true }).click();
  }
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 7. Multiple choice: an answer that fits "Tu çawa yî?".
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Ez baş im, spas." }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 8. Fill in the blank: the vowel-final third-person copula "ye".
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox").fill("ye");
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "See results" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Temam bû!" })).toBeVisible();
  await expect(page.getByText("100%").first()).toBeVisible();
  await expect(page.getByText("8/8")).toBeVisible();

  // Progress is written to IndexedDB and survives navigation.
  await page.goto("/progress");
  await expect(
    page.getByRole("heading", { name: "Progress", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Overall accuracy")).toBeVisible();
  await expect(page.getByText("1. Hello and introductions")).toBeVisible();
  await expect(page.getByText("100%").first()).toBeVisible();
  await expect(page.getByText("8 attempts stored locally")).toBeVisible();

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Silav, xwendekar!" }),
  ).toBeVisible();
  await expect(page.getByText(/1\/6 lessons done/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Continue: The present copula/ }),
  ).toBeVisible();
  await expect(page.getByText("Completed · 100% accuracy")).toBeVisible();
});
