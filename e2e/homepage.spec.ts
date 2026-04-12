import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the hero section with H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("olietankverwijderaars");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Olietankverwijderen/);
  });

  test("renders header with navigation links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header.getByRole("link", { name: /bedrijven/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /kennisbank/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /offerte/i })).toBeVisible();
  });

  test("renders footer with navigation", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Olietankverwijderen.nl");
    await expect(footer.getByRole("link", { name: /bedrijven/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /kennisbank/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /offerte/i })).toBeVisible();
  });

  test("hero has CTA buttons linking to bedrijven and offerte", async ({
    page,
  }) => {
    const bedrijvenLink = page.getByRole("link", {
      name: /bekijk alle bedrijven/i,
    });
    await expect(bedrijvenLink).toBeVisible();
    await expect(bedrijvenLink).toHaveAttribute("href", "/bedrijven");

    const offerteLink = page.getByRole("link", {
      name: /gratis offerte aanvragen/i,
    });
    await expect(offerteLink).toBeVisible();
    await expect(offerteLink).toHaveAttribute("href", "/offerte");
  });

  test("renders 'Waarom Olietankverwijderen.nl?' section", async ({ page }) => {
    await expect(page.getByText("Waarom Olietankverwijderen.nl?")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gecertificeerd", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Vergelijk", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gratis offertes", exact: true }),
    ).toBeVisible();
  });

  test("renders kennisbank section with article cards", async ({ page }) => {
    await expect(page.getByText("Alles over olietank verwijderen")).toBeVisible();
    await expect(page.getByRole("link", { name: /Wat kost olietank verwijderen/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Olietank herkennen/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Wet- en regelgeving/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Zelf olietank verwijderen/i })).toBeVisible();
  });

  test("has JSON-LD structured data", async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);

    const content = await jsonLd.first().textContent();
    const data = JSON.parse(content!);
    expect(data["@type"]).toBe("WebSite");
    expect(data.name).toBe("Olietankverwijderen.nl");
  });

  test("has Open Graph meta tags", async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /olietankverwijderaars/i);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "website");
  });

  test("has meta description", async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      "content",
      /olietankverwijde/i,
    );
  });

  test("page is set to Dutch language", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "nl");
  });
});
