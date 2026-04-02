import { z } from "zod";

/**
 * Dutch postcode pattern: 4 digits + optional space + 2 uppercase letters.
 * Accepts "1234AB" and "1234 AB".
 */
const DUTCH_POSTCODE_REGEX = /^\d{4}\s?[A-Za-z]{2}$/;

export const leadSchema = z.object({
  naam: z.string().min(1, "Vul je naam in"),

  email: z.email("Vul een geldig e-mailadres in"),

  telefoon: z.string().optional(),

  postcode: z
    .string()
    .min(1, "Vul je postcode in")
    .regex(DUTCH_POSTCODE_REGEX, "Vul een geldige postcode in (bijv. 1234 AB)"),

  type_dienst: z.enum(["verwijdering", "sanering", "beide"], {
    error: "Kies het type dienst",
  }),

  type_tank: z
    .enum(["ondergronds", "bovengronds", "onbekend"])
    .optional(),

  inhoud_tank: z
    .enum(["0-1000", "1000-3000", "3000-6000", "6000+", "onbekend"])
    .optional(),

  urgentie: z
    .enum(["direct", "binnen-maand", "binnen-3-maanden", "orienterend"])
    .optional(),

  toelichting: z
    .string()
    .max(1000, "Toelichting mag maximaal 1000 tekens bevatten")
    .optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
