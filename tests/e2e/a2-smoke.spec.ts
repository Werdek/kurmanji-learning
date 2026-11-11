import { expect, test } from "@playwright/test";

const PAST_TIME: Array<[string, string]> = [
  ["duh", "yesterday"],
  ["pêr", "day before yesterday"],
  ["sibeh", "morning"],
  ["êvar", "evening"],
  ["hingê", "at that time"],
  ["dawiyê", "finally"],
];

test("completes an A2.1 lesson and reaches the A2.2 path", async ({ page }) => {
  await page.goto("/learn/u07-l1");

  await expect(
    page.getByText("Unit 7 · Lesson 1", { exact: false }),
  ).toBeVisible();

  // 1. Vocabulary match: past-time words.
  for (const [ku, en] of PAST_TIME) {
    await page.getByRole("button", { name: ku, exact: true }).click();
    await page.getByRole("button", { name: en, exact: true }).click();
  }
  await page.getByRole("button", { name: "Check matches" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 2. Multiple choice: “I came yesterday”.
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Ez duh hatim." }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 3. Fill in the blank: past copula bûm.
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox").fill("bûm");
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 4. Sentence builder: “We stayed in the village.”
  await page.getByRole("button", { name: "Continue" }).click();
  for (const word of ["Em", "li", "gund", "man"]) {
    await page.getByRole("button", { name: word, exact: true }).click();
  }
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 5. Multiple choice: past of hatin.
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Ez hatim." }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  // 6. Fill in the blank: third-person past copula bû.
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox").fill("bû");
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Rast e — correct!" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "See results" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Temam bû!" })).toBeVisible();
  await expect(page.getByText("6/6")).toBeVisible();

  // The A2.2 lessons are wired and reachable.
  await page.goto("/learn/u12-l1");
  await expect(
    page.getByText("Unit 12 · Lesson 1", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "cejn", exact: true }),
  ).toBeVisible();
});
