import { test, expect } from "@playwright/test";

test.describe("Bedrijven overview page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bedrijven");
  });

  test("renders H1 with page title", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Asbestverwijderingsbedrijven");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/asbestverwijdering/i);
  });

  test("renders breadcrumbs", async ({ page }) => {
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Home");
    await expect(breadcrumbs).toContainText("Bedrijven");
  });

  test("has JSON-LD ItemList structured data", async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let hasItemList = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      const data = JSON.parse(content!);
      if (data["@type"] === "ItemList") {
        hasItemList = true;
        expect(data.name).toBeTruthy();
      }
    }
    expect(hasItemList).toBe(true);
  });

  test("renders company cards or empty state", async ({ page }) => {
    const cards = page.locator('a[href^="/bedrijven/"]');
    const emptyState = page.getByText("geen bedrijven gevonden");

    const cardCount = await cards.count();
    if (cardCount > 0) {
      // Company cards are visible
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();
    } else {
      // Empty state is shown
      await expect(emptyState).toBeVisible();
    }
  });

  test("company cards link to detail pages", async ({ page }) => {
    const cards = page.locator('a[href^="/bedrijven/"]');
    const count = await cards.count();
    if (count > 0) {
      const href = await cards.first().getAttribute("href");
      expect(href).toMatch(/^\/bedrijven\/[\w-]+$/);
    }
  });

  test("has canonical URL", async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/bedrijven$/);
  });
});

test.describe("Bedrijf detail page", () => {
  test("navigating to a company shows detail page", async ({ page }) => {
    await page.goto("/bedrijven");

    // Find company cards within the main content area (not header/footer links)
    const mainContent = page.locator("main");
    const companyLinks = mainContent.locator('a[href^="/bedrijven/"]');
    const count = await companyLinks.count();

    if (count === 0) {
      test.skip();
      return;
    }

    const href = await companyLinks.first().getAttribute("href");
    await page.goto(href!);

    // Should have an H1 with the company name
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const companyName = await h1.textContent();
    expect(companyName!.length).toBeGreaterThan(0);

    // Should have breadcrumbs: Home > Bedrijven > [Naam]
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Home");
    await expect(breadcrumbs).toContainText("Bedrijven");

    // Should have JSON-LD LocalBusiness
    const scripts = page.locator('script[type="application/ld+json"]');
    const scriptCount = await scripts.count();
    let hasLocalBusiness = false;
    for (let i = 0; i < scriptCount; i++) {
      const content = await scripts.nth(i).textContent();
      const data = JSON.parse(content!);
      if (data["@type"] === "LocalBusiness") {
        hasLocalBusiness = true;
        expect(data.name).toBeTruthy();
      }
    }
    expect(hasLocalBusiness).toBe(true);

    // Should have sidebar with offerte CTA
    await expect(
      page.getByRole("link", { name: "Gratis offerte aanvragen" }),
    ).toBeVisible();
  });
});
