import { describe, it, expect } from "vitest";
import { leadSchema } from "./lead";

const validLead = {
  naam: "Jan de Vries",
  email: "jan@example.nl",
  telefoon: "0612345678",
  postcode: "4873 LG",
  type_dienst: "verwijdering" as const,
};

describe("leadSchema — normalisatie", () => {
  // Op 2026-06-26 diende dezelfde aanvrager twee keer binnen drie minuten in.
  // Er was hier helemaal geen dedup, dus dat werden twee losse leads. De
  // normalisatie hieronder is de voorwaarde waarop de dedup kan vergelijken.
  it("normaliseert de postcode naar 1234 AB", () => {
    for (const invoer of ["4873lg", "4873LG", "4873 lg", " 4873  LG "]) {
      const r = leadSchema.safeParse({ ...validLead, postcode: invoer });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.postcode).toBe("4873 LG");
    }
  });

  it("normaliseert het e-mailadres naar kleine letters", () => {
    const r = leadSchema.safeParse({ ...validLead, email: "Jan.DeVries@Example.NL" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("jan.devries@example.nl");
  });

  it("blijft een ongeldige postcode afwijzen", () => {
    expect(leadSchema.safeParse({ ...validLead, postcode: "48AB" }).success).toBe(false);
  });
});
