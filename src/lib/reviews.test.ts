import { describe, expect, it } from "vitest";
import { formatteerPeildatum, reviewStructuredData } from "./reviews";

const input = {
  gemiddeldeRating: 4.5,
  aantalReviews: 12,
  reviews: [
    {
      reviewerNaam: "Jan",
      rating: 5,
      tekst: "Netjes gedaan",
      titel: "Tevreden",
      createdAt: "2024-03-01T10:00:00.000Z",
    },
  ],
};

describe("reviewStructuredData", () => {
  it("laat scores weg zolang de weergave uit staat", () => {
    expect(reviewStructuredData(input, false)).toEqual({});
  });

  it("zet bronvelden terug als de weergave aan staat", () => {
    const data = reviewStructuredData(input, true);
    expect(data.aggregateRating).toMatchObject({
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: 12,
    });
    expect(data.review).toHaveLength(1);
    expect(data.review?.[0]).toMatchObject({
      "@type": "Review",
      reviewBody: "Netjes gedaan",
      name: "Tevreden",
    });
  });

  it("slaat een lege score over", () => {
    expect(
      reviewStructuredData(
        { gemiddeldeRating: 0, aantalReviews: 0, reviews: [] },
        true,
      ),
    ).toEqual({});
  });
});

describe("formatteerPeildatum", () => {
  it("geeft een plek voor een ontbrekende peildatum", () => {
    expect(formatteerPeildatum(null)).toBe("nog niet ingevuld");
  });

  it("schrijft een ISO-datum in het Nederlands", () => {
    expect(formatteerPeildatum("2026-07-01")).toBe("1 juli 2026");
  });
});
