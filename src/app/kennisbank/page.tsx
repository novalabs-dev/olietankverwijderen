import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

export const metadata: Metadata = {
  title: "Kennisbank Olietankverwijdering — Alles over Olietanks",
  description:
    "Lees alles over olietankverwijdering: kosten, regelgeving, certificeringen en meer. Praktische informatie voor huiseigenaren en bedrijven.",
  openGraph: {
    title: "Kennisbank Olietankverwijdering — Alles over Olietanks",
    description:
      "Lees alles over olietankverwijdering: kosten, regelgeving, certificeringen en meer. Praktische informatie voor huiseigenaren en bedrijven.",
    url: `${BASE_URL}/kennisbank`,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  alternates: {
    canonical: "/kennisbank",
  },
};

export default function KennisbankPage() {
  const articles = getAllArticles();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kennisbank Olietankverwijdering",
    description:
      "Praktische informatie over olietankverwijdering, kosten, regelgeving en certificeringen.",
    url: `${BASE_URL}/kennisbank`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BASE_URL}/kennisbank/${article.slug}`,
        name: article.frontmatter.title,
      })),
    },
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Kennisbank" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={collectionJsonLd} />

      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Kennisbank Olietankverwijdering
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-600">
        Alles wat je moet weten over olietanks: van kosten en regelgeving tot
        certificeringen en veilig verwijderen. Praktische informatie voor
        huiseigenaren en bedrijven.
      </p>

      {articles.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/kennisbank/${article.slug}`}
              className="group rounded-lg border border-gray-200 p-6 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
            >
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                {article.frontmatter.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                {article.frontmatter.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <span>{article.frontmatter.readingTime}</span>
                <span>
                  {new Date(
                    article.frontmatter.publishedAt,
                  ).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">
          Er zijn nog geen artikelen gepubliceerd. Kom binnenkort terug!
        </p>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Hulp nodig bij olietankverwijdering?
        </h2>
        <p className="mt-2 text-gray-600">
          Vraag gratis en vrijblijvend offertes aan bij gecertificeerde
          olietankverwijderaars.
        </p>
        <Link
          href="/offerte"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Gratis offerte aanvragen
        </Link>
      </div>
    </div>
  );
}
