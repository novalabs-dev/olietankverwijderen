// Database row types matching the Supabase schema

export interface Bedrijf {
  id: string;
  naam: string;
  slug: string;
  kvk_nummer: string | null;
  beschrijving: string | null;
  korte_beschrijving: string | null;
  email: string | null;
  telefoon: string | null;
  website: string | null;
  straat: string | null;
  huisnummer: string | null;
  postcode: string | null;
  stad: string;
  provincie: string;
  latitude: number | null;
  longitude: number | null;
  opgericht_jaar: number | null;
  aantal_medewerkers: string | null;
  gemiddelde_rating: number;
  aantal_reviews: number;
  is_gecertificeerd: boolean;
  is_claimed: boolean;
  is_premium: boolean;
  is_published: boolean;
  prijs_vanaf: number | null;
  prijs_indicatie: string | null;
  logo_url: string | null;
  header_image_url: string | null;
  bron: string | null;
  ascert_id: string | null;
  data_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CertificeringType {
  id: string;
  code: string;
  naam: string;
  beschrijving: string | null;
  url: string | null;
}

export interface BedrijfCertificering {
  id: string;
  bedrijf_id: string;
  certificering_type_id: string;
  certificaat_nummer: string | null;
  geldig_tot: string | null;
  verificatie_url: string | null;
  verified_at: string | null;
  created_at: string;
  certificering_types: CertificeringType;
}

export interface SpecialisatieType {
  id: string;
  naam: string;
  slug: string;
  beschrijving: string | null;
}

export interface BedrijfSpecialisatie {
  bedrijf_id: string;
  specialisatie_id: string;
  specialisatie_types: SpecialisatieType;
}

export interface Provincie {
  id: string;
  naam: string;
  slug: string;
}

export interface Stad {
  id: string;
  naam: string;
  slug: string;
  provincie_id: string;
  postcode_range: string | null;
  latitude: number | null;
  longitude: number | null;
  inwoners: number | null;
  heeft_landing_page: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  bedrijf_id: string;
  reviewer_naam: string;
  reviewer_email: string | null;
  reviewer_stad: string | null;
  rating: number;
  titel: string | null;
  tekst: string;
  type_opdracht: string | null;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
}

export interface BedrijfWerkgebied {
  bedrijf_id: string;
  stad_id: string;
  steden: Stad;
}

// Composite types for pages
export interface BedrijfMetRelaties extends Bedrijf {
  bedrijf_certificeringen: BedrijfCertificering[];
  bedrijf_specialisaties: BedrijfSpecialisatie[];
  bedrijf_werkgebieden: BedrijfWerkgebied[];
  reviews: Review[];
}

export interface BedrijfCardData extends Bedrijf {
  bedrijf_certificeringen: BedrijfCertificering[];
}
