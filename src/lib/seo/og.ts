import type { Metadata } from "next";
import { nicheConfig } from "@/lib/niche.config";

/**
 * Default Open Graph images for the site. Next.js auto-serves
 * `/opengraph-image` via src/app/opengraph-image.tsx. Route-level pages that
 * override `openGraph` import this so they keep the site-wide image
 * (Next.js does NOT merge openGraph.images across segments).
 */
export const DEFAULT_OG_IMAGES: NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${nicheConfig.siteNaam} — ${nicheConfig.tagline}`,
  },
];
