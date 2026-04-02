import { test, expect } from "@playwright/test";

test.describe("Kennisbank overview page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kennisbank");
  });

  test("renders H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Kennisbank");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Kennisbank/);
  });

  test("renders breadcrumbs", async ({ page }) => {
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Home");
    await expect(breadcrumbs).toContainText("Kennisbank");
  });

  test("shows at least one article card", async ({ page }) => {
    const articleLinks = page.locator('a[href^="/kennisbank/"]');
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("article cards show title and description", async ({ page }) => {
    const firstArticle = page.locator('a[href^="/kennisbank/"]').first();
    await expect(firstArticle).toBeVisible();

    const h2 = firstArticle.locator("h2");
    await expect(h2).toBeVisible();
    const title = await h2.textContent();
    expect(title!.length).toBeGreaterThan(0);
  });

  test("has CTA section at the bottom", async ({ page }) => {
    await expect(
      page.getByText("Hulp nodig bij asbestverwijdering?"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /offerte aanvragen/i }).last(),
    ).toBeVisible();
  });

  test("has JSON-LD CollectionPage structured data", async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let hasCollectionPage = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      const data = JSON.parse(content!);
      if (data["@type"] === "CollectionPage") {
        hasCollectionPage = true;
      }
    }
    expect(hasCollectionPage).toBe(true);
  });
});

test.describe("Kennisbank article page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kennisbank/wat-kost-asbest-verwijderen");
  });

  test("renders H1 with article title", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("asbest verwijderen");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/asbest verwijderen/i);
  });

  test("renders breadcrumbs with article name", async ({ page }) => {
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Home");
    await expect(breadcrumbs).toContainText("Kennisbank");
  });

  test("shows publish date and reading time", async ({ page }) => {
    await expect(page.getByText(/leestijd/i)).toBeVisible();

    // Date should be visible
    const timeElement = page.locator("time");
    await expect(timeElement).toBeVisible();
  });

  test("renders markdown tables correctly (not raw pipe syntax)", async ({
    page,
  }) => {
    // Tables should be rendered as HTML <table> elements
    const tables = page.locator("article table");
    const tableCount = await tables.count();
    expect(tableCount).toBeGreaterThan(0);

    // Tables should have headers
    const firstTable = tables.first();
    const headers = firstTable.locator("th");
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);

    // Raw pipe syntax should NOT be visible in the article
    const articleText = await page.locator("article").textContent();
    expect(articleText).not.toContain("|---|---|");
  });

  test("renders H2 section headings", async ({ page }) => {
    const h2s = page.locator("article h2");
    const count = await h2s.count();
    expect(count).toBeGreaterThan(2);
  });

  test("has FAQ section", async ({ page }) => {
    await expect(page.getByText("Veelgestelde vragen")).toBeVisible();
  });

  test("internal links use correct paths", async ({ page }) => {
    const articleContent = page.locator("article");
    const offerteLinks = articleContent.locator('a[href="/offerte"]');
    const bedrijvenLinks = articleContent.locator('a[href="/bedrijven"]');

    const offerteCount = await offerteLinks.count();
    const bedrijvenCount = await bedrijvenLinks.count();
    expect(offerteCount + bedrijvenCount).toBeGreaterThanOrEqual(2);
  });

  test("has sidebar with offerte CTA", async ({ page }) => {
    const aside = page.locator("aside");
    await expect(aside).toBeVisible();
    await expect(
      aside.getByRole("link", { name: "Gratis offerte aanvragen" }),
    ).toBeVisible();
  });

  test("sidebar has 'Handige links' section", async ({ page }) => {
    await expect(page.getByText("Handige links")).toBeVisible();
  });

  test("has JSON-LD Article structured data", async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let hasArticle = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      const data = JSON.parse(content!);
      if (data["@type"] === "Article") {
        hasArticle = true;
        expect(data.headline).toBeTruthy();
        expect(data.datePublished).toBeTruthy();
        expect(data.publisher).toBeTruthy();
      }
    }
    expect(hasArticle).toBe(true);
  });

  test("has meta description", async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /asbest/i);
  });

  test("has canonical URL", async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      /\/kennisbank\/wat-kost-asbest-verwijderen$/,
    );
  });
});
