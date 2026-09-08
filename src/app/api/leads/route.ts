import { NextResponse } from "next/server";

/**
 * De offertebemiddeling is op 8 september 2026 gestopt (besluit Wouter).
 *
 * Deze route blijft bestaan zodat een achtergebleven client, een gecachte pagina
 * of een bot een duidelijk antwoord krijgt in plaats van een 404 of, erger, een
 * lead die in de database belandt die niemand meer verwerkt. 410 Gone zegt
 * precies wat er aan de hand is: dit eindpunt bestond, en is definitief weg.
 */
const GESTOPT = {
  success: false,
  error:
    "De offerteservice is gestopt. Je vindt de gecertificeerde bedrijven op /bedrijven en kunt ze zelf rechtstreeks benaderen.",
};

export function POST() {
  return NextResponse.json(GESTOPT, { status: 410 });
}

export function GET() {
  return NextResponse.json(GESTOPT, { status: 410 });
}
