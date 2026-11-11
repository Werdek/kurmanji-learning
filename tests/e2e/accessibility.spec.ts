import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const ROUTES: Array<{ path: string; ready: (page: Page) => Locator }> = [
  {
    path: "/",
    ready: (page) => page.getByRole("heading", { name: "Silav, xwendekar!" }),
  },
  {
    path: "/review",
    ready: (page) => page.getByRole("heading", { name: "Review" }),
  },
  {
    path: "/progress",
    ready: (page) => page.getByRole("heading", { name: "Progress" }),
  },
  {
    path: "/settings",
    ready: (page) => page.getByRole("heading", { name: "Settings" }),
  },
  {
    path: "/learn/u01-l1",
    ready: (page) => page.getByRole("progressbar", { name: "Lesson progress" }),
  },
];

for (const route of ROUTES) {
  test(`has no automated WCAG A/AA violations on ${route.path}`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await expect(route.ready(page)).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target.join(" ")),
      })),
    ).toEqual([]);
  });
}
