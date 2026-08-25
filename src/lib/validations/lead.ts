import { z } from "zod";

/**
 * Dutch postcode, getoetst op de al genormaliseerde vorm: 4 cijfers gevolgd
 * door 2 hoofdletters, zonder spatie. De invoer wordt eerst genormaliseerd
 * (zie het postcode-veld), dus "4873lg" en " 4873  LG " komen hier allebei
 * als "4873LG" binnen.
 */
const COMPACT_POSTCODE_REGEX = /^\d{4}[A-Z]{2}$/;

/**
 * Dutch postcode pattern: 4 digits + optional space + 2 uppercase letters.
 * Accepts "1234AB" and "1234 AB".
 */
const DUTCH_POSTCODE_REGEX = /^\d{4}\s?[A-Za-z]{2}$/;

export const leadSchema = z.object({
  naam: z.string().min(1, "Vul je naam in"),

  // Kleine letters: de dedup-lookup vergelijkt letterlijk op e-mailadres.
  email: z
    .email("Vul een geldig e-mailadres in")
    .transform((v) => v.trim().toLowerCase()),

  telefoon: z.string().optional(),

  // Genormaliseerd naar "1234 AB". Eerst normaliseren, dan pas valideren:
  // andersom zou " 4873  LG " een foutmelding opleveren terwijl het gewoon een
  // geldige postcode met een spatie te veel is. Zonder deze normalisatie kan de
  // dedup-lookup twee schrijfwijzen van dezelfde aanvraag niet aan elkaar koppelen.
  postcode: z
    .string()
    .min(1, "Vul je postcode in")
    .transform((v) => v.replace(/\s+/g, "").toUpperCase())
    .refine((v) => COMPACT_POSTCODE_REGEX.test(v),
            "Vul een geldige postcode in (bijv. 1234 AB)")
    .transform((v) => `${v.slice(0, 4)} ${v.slice(4)}`),

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
