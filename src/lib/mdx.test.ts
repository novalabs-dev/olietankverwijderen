import { describe, it, expect } from "vitest";
import {
  getArticleBySlug,
  getAllArticles,
  getAllArticleSlugs,
} from "./mdx";

describe("mdx utilities", () => {
  describe("getArticleBySlug", () => {
    it("returns the article for a valid slug", () => {
      const article = getArticleBySlug("kosten-olietank-verwijderen");
      expect(article).not.toBeNull();
      expect(article!.slug).toBe("kosten-olietank-verwijderen");
    });

    it("returns frontmatter with required fields", () => {
      const article = getArticleBySlug("kosten-olietank-verwijderen");
      expect(article).not.toBeNull();

      const { frontmatter } = article!;
      expect(frontmatter.title).toBeTruthy();
      expect(frontmatter.description).toBeTruthy();
      expect(frontmatter.keywords).toBeInstanceOf(Array);
      expect(frontmatter.keywords.length).toBeGreaterThan(0);
      expect(frontmatter.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(frontmatter.readingTime).toBeTruthy();
      expect(frontmatter.targetKeyword).toBeTruthy();
    });

    it("returns markdown content", () => {
      const article = getArticleBySlug("kosten-olietank-verwijderen");
      expect(article).not.toBeNull();
      expect(article!.content).toBeTruthy();
      expect(article!.content.length).toBeGreaterThan(100);
    });

    it("returns null for non-existent slug", () => {
      const article = getArticleBySlug("dit-artikel-bestaat-niet");
      expect(article).toBeNull();
    });
  });

  describe("getAllArticles", () => {
    it("returns an array of articles", () => {
      const articles = getAllArticles();
      expect(articles).toBeInstanceOf(Array);
      expect(articles.length).toBeGreaterThan(0);
    });

    it("contains the expected article", () => {
      const articles = getAllArticles();
      const slugs = articles.map((a) => a.slug);
      expect(slugs).toContain("kosten-olietank-verwijderen");
    });

    it("each article has frontmatter with title and description", () => {
      const articles = getAllArticles();
      for (const article of articles) {
        expect(article.frontmatter.title).toBeTruthy();
        expect(article.frontmatter.description).toBeTruthy();
      }
    });

    it("articles are sorted by date descending", () => {
      const articles = getAllArticles();
      if (articles.length > 1) {
        for (let i = 1; i < articles.length; i++) {
          const prev = new Date(articles[i - 1].frontmatter.publishedAt);
          const curr = new Date(articles[i].frontmatter.publishedAt);
          expect(prev.getTime()).toBeGreaterThanOrEqual(curr.getTime());
        }
      }
    });
  });

  describe("getAllArticleSlugs", () => {
    it("returns an array of slugs", () => {
      const slugs = getAllArticleSlugs();
      expect(slugs).toBeInstanceOf(Array);
      expect(slugs.length).toBeGreaterThan(0);
    });

    it("contains the expected slug", () => {
      const slugs = getAllArticleSlugs();
      expect(slugs).toContain("kosten-olietank-verwijderen");
    });

    it("slugs match article slugs", () => {
      const slugs = getAllArticleSlugs();
      const articles = getAllArticles();
      const articleSlugs = articles.map((a) => a.slug);
      expect(slugs.sort()).toEqual(articleSlugs.sort());
    });
  });
});
