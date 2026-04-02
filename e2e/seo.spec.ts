import { test, expect } from "@playwright/test";

test.describe("SEO essentials", () => {
  test("robots.txt is accessible and allows crawling", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response!.status()).toBe(200);

    const text = await page.textContent("body");
    expect(text).toContain("User-Agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Disallow: /api/");
    expect(text).toContain("sitemap.xml");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response!.status()).toBe(200);

    const text = await page.textContent("body");
    expect(text).toContain("urlset");
    expect(text).toContain("/bedrijven");
    expect(text).toContain("/offerte");
    expect(text).toContain("/kennisbank");
  });

  test("homepage has all required SEO elements", async ({ page }) => {
    await page.goto("/");

    // Title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(80);

    // Meta description
    const desc = page.locator('meta[name="description"]');
    const descContent = await desc.getAttribute("content");
    expect(descContent!.length).toBeGreaterThan(50);
    expect(descContent!.length).toBeLessThan(160);

    // OG tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );

    // Language
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");

    // H1 exists
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("bedrijven page has all required SEO elements", async ({ page }) => {
    await page.goto("/bedrijven");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/bedrijven$/,
    );
    await expect(
      page.locator('nav[aria-label="Breadcrumb"]'),
    ).toBeVisible();
  });

  test("offerte page has all required SEO elements", async ({ page }) => {
    await page.goto("/offerte");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(
      page.locator('nav[aria-label="Breadcrumb"]'),
    ).toBeVisible();
  });

  test("kennisbank page has all required SEO elements", async ({ page }) => {
    await page.goto("/kennisbank");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/kennisbank$/,
    );
  });

  test("kennisbank article has all required SEO elements", async ({
    page,
  }) => {
    await page.goto("/kennisbank/wat-kost-asbest-verwijderen");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/kennisbank\/wat-kost-asbest-verwijderen$/,
    );
    await expect(
      page.locator('nav[aria-label="Breadcrumb"]'),
    ).toBeVisible();

    // Article JSON-LD
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let hasArticle = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      const data = JSON.parse(content!);
      if (data["@type"] === "Article") {
        hasArticle = true;
      }
    }
    expect(hasArticle).toBe(true);
  });

  test("every page has exactly one H1", async ({ page }) => {
    const pages = ["/", "/bedrijven", "/offerte", "/kennisbank"];

    for (const path of pages) {
      await page.goto(path);
      const h1Count = await page.locator("h1").count();
      expect(h1Count, `Page ${path} should have exactly 1 H1`).toBe(1);
    }
  });

  test("breadcrumbs include JSON-LD BreadcrumbList", async ({ page }) => {
    await page.goto("/bedrijven");

    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let hasBreadcrumbList = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      const data = JSON.parse(content!);
      if (data["@type"] === "BreadcrumbList") {
        hasBreadcrumbList = true;
        expect(data.itemListElement).toBeInstanceOf(Array);
        expect(data.itemListElement.length).toBeGreaterThanOrEqual(2);
      }
    }
    expect(hasBreadcrumbList).toBe(true);
  });
});
