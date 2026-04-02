import { test, expect } from "@playwright/test";

test.describe("Site navigation", () => {
  test("header logo links to homepage", async ({ page }) => {
    await page.goto("/bedrijven");
    const logo = page.locator("header").getByRole("link").first();
    await logo.click();
    await expect(page).toHaveURL("/");
  });

  test("header 'Bedrijven' link navigates correctly", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: /bedrijven/i }).click();
    await expect(page).toHaveURL("/bedrijven");
    await expect(page.locator("h1")).toContainText("Asbestverwijderingsbedrijven");
  });

  test("header 'Kennisbank' link navigates correctly", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: /kennisbank/i }).click();
    await expect(page).toHaveURL("/kennisbank");
    await expect(page.locator("h1")).toContainText("Kennisbank");
  });

  test("header 'Gratis offerte' link navigates correctly", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: /offerte/i }).click();
    await expect(page).toHaveURL("/offerte");
    await expect(page.locator("h1")).toContainText("offerte aanvragen");
  });

  test("footer 'Bedrijven' link navigates correctly", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: /bedrijven/i }).click();
    await expect(page).toHaveURL("/bedrijven");
  });

  test("footer 'Kennisbank' link navigates correctly", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: /kennisbank/i }).click();
    await expect(page).toHaveURL("/kennisbank");
  });

  test("footer 'Offerte aanvragen' link navigates correctly", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: /offerte/i }).click();
    await expect(page).toHaveURL("/offerte");
  });

  test("breadcrumb 'Home' link navigates to homepage", async ({ page }) => {
    await page.goto("/offerte");
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await breadcrumbs.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });

  test("kennisbank article links from overview work", async ({ page }) => {
    await page.goto("/kennisbank");
    const firstArticle = page.locator('a[href^="/kennisbank/"]').first();
    const href = await firstArticle.getAttribute("href");
    await firstArticle.click();
    await expect(page).toHaveURL(href!);
    await expect(page.locator("h1")).toBeVisible();
  });
});
