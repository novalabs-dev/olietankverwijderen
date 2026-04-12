import { test, expect } from "@playwright/test";

test.describe("Offerte page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/offerte");
  });

  test("renders H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Gratis offerte aanvragen");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/offerte/i);
  });

  test("renders breadcrumbs", async ({ page }) => {
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Home");
    await expect(breadcrumbs).toContainText("Offerte aanvragen");
  });

  test("renders the form with all required fields", async ({ page }) => {
    await expect(page.locator("#naam")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#postcode")).toBeVisible();

    // Radio buttons for type dienst
    await expect(page.getByText("Tankverwijdering")).toBeVisible();
    await expect(page.getByText("Bodemsanering")).toBeVisible();
    await expect(page.getByText("Verwijdering + sanering")).toBeVisible();
  });

  test("renders optional fields", async ({ page }) => {
    await expect(page.locator("#telefoon")).toBeVisible();
    await expect(page.locator("#type_tank")).toBeVisible();
    await expect(page.locator("#inhoud_tank")).toBeVisible();
    await expect(page.locator("#urgentie")).toBeVisible();
    await expect(page.locator("#toelichting")).toBeVisible();
  });

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    // Clear the naam field (it's required)
    await page.locator("#naam").fill("");
    await page.locator("#postcode").fill("");

    await page.getByRole("button", { name: /offerte aanvragen/i }).click();

    // Should show validation error for naam
    await expect(page.getByText("Vul je naam in")).toBeVisible();
  });

  test("shows postcode validation error for invalid postcode", async ({
    page,
  }) => {
    await page.locator("#naam").fill("Test Gebruiker");
    await page.locator("#email").fill("test@example.nl");
    await page.locator("#postcode").fill("123");

    await page.getByRole("button", { name: /offerte aanvragen/i }).click();

    await expect(page.getByText(/geldige postcode/i)).toBeVisible();
  });

  test("submit button shows correct text", async ({ page }) => {
    const button = page.getByRole("button", { name: /offerte aanvragen/i });
    await expect(button).toBeVisible();
    await expect(button).toContainText("Gratis offerte aanvragen");
  });

  test("renders sidebar with 'Waarom via ons?' section", async ({ page }) => {
    await expect(page.getByText("Waarom via ons?")).toBeVisible();
    await expect(page.getByText("100% gratis en vrijblijvend")).toBeVisible();
    await expect(
      page.getByText("Alleen gecertificeerde bedrijven"),
    ).toBeVisible();
    await expect(page.getByText("Vergelijk en bespaar")).toBeVisible();
  });

  test("has privacy link in form footer", async ({ page }) => {
    const privacyLink = page.getByRole("link", { name: /privacyverklaring/i });
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  test("toelichting field shows character counter", async ({ page }) => {
    await expect(page.getByText("0 / 1000")).toBeVisible();

    await page.locator("#toelichting").fill("Test bericht");
    await expect(page.getByText("12 / 1000")).toBeVisible();
  });

  test("has JSON-LD structured data", async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });
});
