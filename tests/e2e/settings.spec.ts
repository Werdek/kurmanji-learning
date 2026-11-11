import { expect, test } from "@playwright/test";

test("settings preferences apply immediately and survive a reload", async ({
  page,
}) => {
  await page.goto("/settings");
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true }),
  ).toBeVisible();

  const highContrast = page.getByRole("checkbox", { name: /High contrast/ });
  const largeText = page.getByRole("checkbox", { name: /Larger text/ });
  const reduceMotion = page.getByRole("checkbox", { name: /Reduce motion/ });

  await highContrast.check();
  await largeText.check();
  await reduceMotion.check();

  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "large");
  await expect(page.locator("html")).toHaveClass(/reduce-motion/);

  await page.reload();

  await expect(highContrast).toBeChecked();
  await expect(largeText).toBeChecked();
  await expect(reduceMotion).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
});

test("settings can restore display defaults", async ({ page }) => {
  await page.goto("/settings");
  const highContrast = page.getByRole("checkbox", { name: /High contrast/ });

  await highContrast.check();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");

  await page.getByRole("button", { name: "Reset display defaults" }).click();

  await expect(highContrast).not.toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "normal");
});

test("progress links to the settings data controls", async ({ page }) => {
  await page.goto("/progress");
  await page.getByRole("link", { name: /Open settings/ }).click();

  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByText("Your data")).toBeVisible();
  await expect(page.getByRole("button", { name: /Export JSON/ })).toBeVisible();
});
