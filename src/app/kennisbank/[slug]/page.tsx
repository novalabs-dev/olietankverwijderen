import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/mdx";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel niet gevonden" };
  }

  const { frontmatter } = article;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${BASE_URL}/kennisbank/${slug}`,
      type: "article",
      publishedTime: frontmatter.publishedAt,
      ...(frontmatter.updatedAt
        ? { modifiedTime: frontmatter.updatedAt }
        : {}),
    },
    alternates: {
      canonical: `/kennisbank/${slug}`,
    },
  };
}

function buildArticleJsonLd(
  slug: string,
  frontmatter: {
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
  },
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    url: `${BASE_URL}/kennisbank/${slug}`,
    datePublished: frontmatter.publishedAt,
    ...(frontmatter.updatedAt
      ? { dateModified: frontmatter.updatedAt }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "Olietankverwijderen.nl",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/kennisbank/${slug}`,
    },
  };
}

const mdxComponents = {
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Kennisbank", href: "/kennisbank" },
    { label: frontmatter.title },
  ];

  const articleJsonLd = buildArticleJsonLd(slug, frontmatter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={articleJsonLd} />

      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Article content */}
        <article className="lg:col-span-2">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {frontmatter.title}
            </h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <time dateTime={frontmatter.publishedAt}>
                {new Date(frontmatter.publishedAt).toLocaleDateString("nl-NL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>{frontmatter.readingTime}</span>
            </div>
          </header>

          <div className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:mt-8 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-xl prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:leading-relaxed">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* CTA */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Offerte aanvragen
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Vergelijk gratis en vrijblijvend offertes van gecertificeerde
                olietankverwijderaars bij jou in de buurt.
              </p>
              <Link
                href="/offerte"
                className="mt-4 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Gratis offerte aanvragen
              </Link>
            </div>

            {/* Related links */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Handige links
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/bedrijven"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Vind een olietankverwijderaar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kennisbank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Meer artikelen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/offerte"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Offerte aanvragen
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
