import { describe, it, expect } from "vitest";
import { leadSchema } from "./lead";

const validLead = {
  naam: "Jan de Vries",
  email: "jan@example.nl",
  postcode: "1234 AB",
  type_dienst: "verwijdering" as const,
};

describe("leadSchema", () => {
  describe("valid submissions", () => {
    it("accepts minimal valid data", () => {
      const result = leadSchema.safeParse(validLead);
      expect(result.success).toBe(true);
    });

    it("accepts fully filled form", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        telefoon: "0612345678",
        type_materiaal: "dak",
        oppervlakte_m2: "25-50",
        bouwjaar_pand: "voor-1980",
        urgentie: "binnen-maand",
        toelichting: "Golfplaten op de schuur.",
      });
      expect(result.success).toBe(true);
    });

    it("accepts postcode without space", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        postcode: "1234AB",
      });
      expect(result.success).toBe(true);
    });

    it("accepts postcode with space", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        postcode: "9999 ZZ",
      });
      expect(result.success).toBe(true);
    });

    it("accepts all type_dienst values", () => {
      for (const dienst of ["verwijdering", "inventarisatie", "beide"]) {
        const result = leadSchema.safeParse({
          ...validLead,
          type_dienst: dienst,
        });
        expect(result.success).toBe(true);
      }
    });

    it("accepts all type_materiaal values", () => {
      for (const mat of ["dak", "vloer", "isolatie", "onbekend"]) {
        const result = leadSchema.safeParse({
          ...validLead,
          type_materiaal: mat,
        });
        expect(result.success).toBe(true);
      }
    });

    it("accepts all oppervlakte values", () => {
      for (const opp of ["0-10", "10-25", "25-50", "50-100", "100+"]) {
        const result = leadSchema.safeParse({
          ...validLead,
          oppervlakte_m2: opp,
        });
        expect(result.success).toBe(true);
      }
    });

    it("accepts all urgentie values", () => {
      for (const urg of [
        "direct",
        "binnen-maand",
        "binnen-3-maanden",
        "orienterend",
      ]) {
        const result = leadSchema.safeParse({
          ...validLead,
          urgentie: urg,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("required fields", () => {
    it("rejects empty naam", () => {
      const result = leadSchema.safeParse({ ...validLead, naam: "" });
      expect(result.success).toBe(false);
    });

    it("rejects missing naam", () => {
      const { naam: _, ...noNaam } = validLead;
      const result = leadSchema.safeParse(noNaam);
      expect(result.success).toBe(false);
    });

    it("rejects missing email", () => {
      const { email: _, ...noEmail } = validLead;
      const result = leadSchema.safeParse(noEmail);
      expect(result.success).toBe(false);
    });

    it("rejects missing postcode", () => {
      const { postcode: _, ...noPostcode } = validLead;
      const result = leadSchema.safeParse(noPostcode);
      expect(result.success).toBe(false);
    });

    it("rejects missing type_dienst", () => {
      const { type_dienst: _, ...noDienst } = validLead;
      const result = leadSchema.safeParse(noDienst);
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("rejects invalid email", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        email: "niet-een-email",
      });
      expect(result.success).toBe(false);
    });

    it("rejects email without domain", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        email: "jan@",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("postcode validation", () => {
    it("rejects too short postcode", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        postcode: "123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects postcode without letters", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        postcode: "1234",
      });
      expect(result.success).toBe(false);
    });

    it("rejects postcode with only letters", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        postcode: "ABCD EF",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty postcode", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        postcode: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("enum validation", () => {
    it("rejects invalid type_dienst", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        type_dienst: "iets-anders",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid type_materiaal", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        type_materiaal: "hout",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("toelichting validation", () => {
    it("accepts toelichting within limit", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        toelichting: "Kort bericht.",
      });
      expect(result.success).toBe(true);
    });

    it("rejects toelichting exceeding 1000 characters", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        toelichting: "a".repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it("accepts toelichting of exactly 1000 characters", () => {
      const result = leadSchema.safeParse({
        ...validLead,
        toelichting: "a".repeat(1000),
      });
      expect(result.success).toBe(true);
    });
  });
});
