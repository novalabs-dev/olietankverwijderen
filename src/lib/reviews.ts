/**
 * Public review display.
 *
 * Scores were copied from Google and shown without a source or census date.
 * Keep them hidden until both can be shown next to the score.
 *
 * While `zichtbaar` is false, company lists must stay alphabetical. Turning
 * this on also means updating /hoe-werkt-de-vergelijking and the sort in
 * getBedrijven / getBedrijvenByStad in the same change.
 */
export const reviewWeergave: {
  zichtbaar: boolean;
  bron: string;
  /** ISO date (YYYY-MM-DD) of the snapshot. Fill this in before showing scores. */
  peildatum: string | null;
} = {
  zichtbaar: false,
  bron: "Google",
  peildatum: null,
};

export function formatteerPeildatum(iso: string | null): string {
  if (!iso) return "nog niet ingevuld";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "nog niet ingevuld";
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export interface ReviewVoorStructuredData {
  reviewerNaam: string;
  rating: number;
  tekst: string;
  titel: string | null;
  createdAt: string;
}

export interface ReviewStructuredInput {
  gemiddeldeRating: number;
  aantalReviews: number;
  reviews: ReviewVoorStructuredData[];
}

/**
 * Schema.org fields for scores. Empty while reviews are hidden, so
 * aggregateRating and review are omitted from JSON-LD.
 */
export function reviewStructuredData(
  input: ReviewStructuredInput,
  zichtbaar: boolean = reviewWeergave.zichtbaar,
): {
  aggregateRating?: Record<string, unknown>;
  review?: Record<string, unknown>[];
} {
  if (!zichtbaar) return {};

  const result: {
    aggregateRating?: Record<string, unknown>;
    review?: Record<string, unknown>[];
  } = {};

  if (input.gemiddeldeRating > 0 && input.aantalReviews > 0) {
    result.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(input.gemiddeldeRating).toFixed(1),
      reviewCount: input.aantalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (input.reviews.length > 0) {
    result.review = input.reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.reviewerNaam,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      datePublished: review.createdAt.split("T")[0],
      reviewBody: review.tekst,
      ...(review.titel ? { name: review.titel } : {}),
    }));
  }

  return result;
}
