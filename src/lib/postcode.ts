/**
 * Map Dutch postcode prefix (first 2 digits) to province.
 * Based on the official Dutch postcode system.
 */
const postcodeProvincieMap: Record<string, string> = {
  "10": "Noord-Holland",
  "11": "Noord-Holland",
  "12": "Noord-Holland",
  "13": "Noord-Holland",
  "14": "Noord-Holland",
  "15": "Noord-Holland",
  "16": "Flevoland",
  "17": "Noord-Holland",
  "18": "Noord-Holland",
  "19": "Noord-Holland",
  "20": "Zuid-Holland",
  "21": "Zuid-Holland",
  "22": "Zuid-Holland",
  "23": "Zuid-Holland",
  "24": "Zuid-Holland",
  "25": "Zuid-Holland",
  "26": "Zuid-Holland",
  "27": "Zuid-Holland",
  "28": "Zuid-Holland",
  "29": "Zuid-Holland",
  "30": "Utrecht",
  "31": "Utrecht",
  "32": "Flevoland",
  "33": "Overijssel",
  "34": "Utrecht",
  "35": "Utrecht",
  "36": "Gelderland",
  "37": "Gelderland",
  "38": "Flevoland",
  "39": "Utrecht",
  "40": "Noord-Brabant",
  "41": "Noord-Brabant",
  "42": "Noord-Brabant",
  "43": "Zeeland",
  "44": "Zeeland",
  "45": "Zeeland",
  "46": "Noord-Brabant",
  "47": "Noord-Brabant",
  "48": "Noord-Brabant",
  "49": "Noord-Brabant",
  "50": "Noord-Brabant",
  "51": "Noord-Brabant",
  "52": "Noord-Brabant",
  "53": "Noord-Brabant",
  "54": "Limburg",
  "55": "Limburg",
  "56": "Limburg",
  "57": "Limburg",
  "58": "Limburg",
  "59": "Limburg",
  "60": "Limburg",
  "61": "Limburg",
  "62": "Limburg",
  "63": "Gelderland",
  "64": "Gelderland",
  "65": "Gelderland",
  "66": "Gelderland",
  "67": "Gelderland",
  "68": "Gelderland",
  "69": "Gelderland",
  "70": "Gelderland",
  "71": "Gelderland",
  "72": "Overijssel",
  "73": "Overijssel",
  "74": "Overijssel",
  "75": "Overijssel",
  "76": "Overijssel",
  "77": "Overijssel",
  "78": "Overijssel",
  "79": "Drenthe",
  "80": "Overijssel",
  "81": "Overijssel",
  "82": "Flevoland",
  "83": "Friesland",
  "84": "Friesland",
  "85": "Friesland",
  "86": "Friesland",
  "87": "Friesland",
  "88": "Friesland",
  "89": "Drenthe",
  "90": "Groningen",
  "91": "Groningen",
  "92": "Groningen",
  "93": "Drenthe",
  "94": "Drenthe",
  "95": "Groningen",
  "96": "Groningen",
  "97": "Groningen",
  "98": "Groningen",
  "99": "Groningen",
};

/**
 * Extract the province from a Dutch postcode.
 * Returns null if the postcode is invalid or unmapped.
 */
export function getProvincieFromPostcode(postcode: string): string | null {
  const digits = postcode.replace(/\s/g, "").slice(0, 2);
  if (!/^\d{2}$/.test(digits)) return null;
  return postcodeProvincieMap[digits] ?? null;
}

/**
 * Extract the 4-digit area code from a Dutch postcode.
 */
export function getPostcodeArea(postcode: string): string | null {
  const cleaned = postcode.replace(/\s/g, "");
  const match = cleaned.match(/^(\d{4})/);
  return match ? match[1] : null;
}
