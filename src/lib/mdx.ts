import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/kennisbank");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  targetKeyword: string;
  searchVolume?: number;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export interface ArticleSummary {
  slug: string;
  frontmatter: ArticleFrontmatter;
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

export function getAllArticles(): ArticleSummary[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
    };
  });

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime(),
  );
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
