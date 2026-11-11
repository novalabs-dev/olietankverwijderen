/** Legal identity of the site. Used in the footer and the privacy statement. */
export const UITGEVER = {
  site: "Olietankverwijderen.nl",
  organisatie: "AckNova Automations",
  straat: "Raamstraat 4",
  postcode: "8861 CV",
  plaats: "Harlingen",
  kvk: "93870949",
  email: "info@olietankverwijderen.nl",
} as const;

export const COLOFON = `${UITGEVER.site} is een website van ${UITGEVER.organisatie}, ${UITGEVER.straat}, ${UITGEVER.postcode} ${UITGEVER.plaats}, KvK ${UITGEVER.kvk}`;
