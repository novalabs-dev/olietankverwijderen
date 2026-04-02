import type { MetadataRoute } from "next";

import { createAdminClient } from "@/lib/supabase/admin";
import { STEDEN, getProvincies } from "@/lib/data/steden";
import { getAllArticles } from "@/lib/mdx";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/bedrijven`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/offerte`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/kennisbank`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Published company pages: /bedrijven/[slug]
  const bedrijvenResult = supabase
    ? await supabase
        .from("bedrijven")
        .select("slug, updated_at")
        .eq("is_published", true)
    : { data: null };
  const bedrijven = bedrijvenResult.data;

  const companyPages: MetadataRoute.Sitemap = (bedrijven ?? []).map(
    (bedrijf) => ({
      url: `${BASE_URL}/bedrijven/${bedrijf.slug}`,
      lastModified: bedrijf.updated_at
        ? new Date(bedrijf.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  // Kennisbank article pages: /kennisbank/[slug]
  const articles = getAllArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/kennisbank/${article.slug}`,
    lastModified: article.frontmatter.updatedAt
      ? new Date(article.frontmatter.updatedAt)
      : new Date(article.frontmatter.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Province landing pages: /[provincie-slug]
  const provinciePages: MetadataRoute.Sitemap = getProvincies().map((p) => ({
    url: `${BASE_URL}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // City landing pages from static data: /[provincie-slug]/[stad-slug]
  const cityPages: MetadataRoute.Sitemap = STEDEN.map((stad) => ({
    url: `${BASE_URL}/${stad.provincieSlug}/${stad.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...companyPages,
    ...articlePages,
    ...provinciePages,
    ...cityPages,
  ];
}
