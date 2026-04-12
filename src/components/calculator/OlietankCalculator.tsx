"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Price data (2025-2026 NL market rates) ── */

type TanktypeKey = "bovengronds" | "ondergronds";

interface TanktypeInfo {
  label: string;
  description: string;
  prijsMin: number;
  prijsMax: number;
}

const TANKTYPEN: Record<TanktypeKey, TanktypeInfo> = {
  bovengronds: {
    label: "Bovengrondse tank",
    description: "Olietank die boven de grond staat, bijvoorbeeld in een kelder, schuur of bijkeuken",
    prijsMin: 800,
    prijsMax: 1500,
  },
  ondergronds: {
    label: "Ondergrondse tank",
    description: "Olietank die in de grond is ingegraven, vaak in de tuin of onder een oprit",
    prijsMin: 1500,
    prijsMax: 3500,
  },
};

type VolumeKey = "500" | "1000" | "2000" | "3000" | "onbekend";

const VOLUME_OPTIES: Record<VolumeKey, { label: string; factor: number }> = {
  "500": { label: "500 liter", factor: 1.0 },
  "1000": { label: "1.000 liter", factor: 1.0 },
  "2000": { label: "2.000 liter", factor: 1.2 },
  "3000": { label: "3.000+ liter", factor: 1.5 },
  onbekend: { label: "Weet ik niet", factor: 1.15 },
};

type VerontreinigingKey = "ja" | "nee" | "onbekend";

const VERONTREINIGING_OPTIES: Record<VerontreinigingKey, { label: string; description: string }> = {
  ja: { label: "Ja", description: "Er is lekkage geweest of er zijn aanwijzingen voor verontreiniging" },
  nee: { label: "Nee", description: "Geen aanwijzingen voor lekkage of verontreiniging" },
  onbekend: { label: "Onbekend", description: "Niet zeker, laat het onderzoeken" },
};

type ToegankelijkheidKey = "vrij" | "onder_gebouw" | "kruipruimte";

const TOEGANKELIJKHEID_OPTIES: Record<ToegankelijkheidKey, { label: string; factor: number }> = {
  vrij: { label: "Vrij bereikbaar", factor: 1.0 },
  onder_gebouw: { label: "Onder een gebouw", factor: 1.3 },
  kruipruimte: { label: "In kruipruimte", factor: 1.4 },
};

const BODEMONDERZOEK_KOSTEN = { min: 850, max: 1400 };
const SANERING_TOESLAG = { min: 2000, max: 11500 };
const MIN_PROJECT_KOSTEN = 800;

type Step = 1 | 2 | 3 | 4;

export function OlietankCalculator() {
  // Form state
  const [tanktype, setTanktype] = useState<TanktypeKey | "">("");
  const [volume, setVolume] = useState<VolumeKey | "">("");
  const [verontreiniging, setVerontreiniging] = useState<VerontreinigingKey>("onbekend");
  const [toegankelijkheid, setToegankelijkheid] = useState<ToegankelijkheidKey>("vrij");
  const [inclBodemonderzoek, setInclBodemonderzoek] = useState(true);

  // Lead capture
  const [email, setEmail] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Step tracker
  const [currentStep, setCurrentStep] = useState<Step>(1);

  function handleTanktypeChange(key: TanktypeKey) {
    setTanktype(key);
    if (currentStep === 1) setCurrentStep(2);
  }

  function handleVolumeNext() {
    if (volume) setCurrentStep(3);
  }

  function handleDetailsNext() {
    setCurrentStep(4);
    setShowResult(true);
  }

  // Calculate
  function berekenKosten() {
    if (!tanktype || !volume) return null;

    const tank = TANKTYPEN[tanktype];
    const vFactor = VOLUME_OPTIES[volume]?.factor ?? 1;
    const tFactor = TOEGANKELIJKHEID_OPTIES[toegankelijkheid]?.factor ?? 1;

    let verwijderingMin = Math.round(tank.prijsMin * vFactor * tFactor);
    let verwijderingMax = Math.round(tank.prijsMax * vFactor * tFactor);

    // Enforce minimum project cost
    verwijderingMin = Math.max(verwijderingMin, MIN_PROJECT_KOSTEN);
    verwijderingMax = Math.max(verwijderingMax, MIN_PROJECT_KOSTEN);

    // Sanering toeslag bij verontreiniging
    const saneringMin = verontreiniging === "ja" ? SANERING_TOESLAG.min : 0;
    const saneringMax = verontreiniging === "ja" ? SANERING_TOESLAG.max : 0;

    const bodemonderzoekMin = inclBodemonderzoek ? BODEMONDERZOEK_KOSTEN.min : 0;
    const bodemonderzoekMax = inclBodemonderzoek ? BODEMONDERZOEK_KOSTEN.max : 0;

    return {
      verwijderingMin,
      verwijderingMax,
      saneringMin,
      saneringMax,
      bodemonderzoekMin,
      bodemonderzoekMax,
      totaalMin: verwijderingMin + saneringMin + bodemonderzoekMin,
      totaalMax: verwijderingMax + saneringMax + bodemonderzoekMax,
    };
  }

  const kosten = berekenKosten();

  function formatBedrag(n: number) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !kosten) return;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: "",
          email,
          postcode: "",
          type_dienst: "verwijdering",
          toelichting: `Via kostenberekening: ${TANKTYPEN[tanktype as TanktypeKey]?.label}, ${VOLUME_OPTIES[volume as VolumeKey]?.label}, verontreiniging: ${verontreiniging}, toegankelijkheid: ${toegankelijkheid}, bodemonderzoek: ${inclBodemonderzoek ? "ja" : "nee"}. Indicatie: ${formatBedrag(kosten.totaalMin)} - ${formatBedrag(kosten.totaalMax)}.`,
        }),
      });
    } catch {
      // silent - don't block the UX
    }

    setEmailSubmitted(true);
  }

  // Step indicator
  const steps = [
    { nr: 1, label: "Tanktype" },
    { nr: 2, label: "Volume" },
    { nr: 3, label: "Details" },
    { nr: 4, label: "Resultaat" },
  ];

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s.nr} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  currentStep >= s.nr
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > s.nr ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  s.nr
                )}
              </div>
              <span className="mt-1 text-xs text-gray-500">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-1 mb-5 h-0.5 flex-1 ${
                  currentStep > s.nr ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Tank type selection */}
      <fieldset className="rounded-lg bg-gray-50 p-6">
        <legend className="text-lg font-semibold text-gray-900">
          1. Wat voor type olietank heeft u?
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.entries(TANKTYPEN) as [TanktypeKey, TanktypeInfo][]).map(
            ([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTanktypeChange(key)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  tanktype === key
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <span className="block text-sm font-semibold text-gray-900">
                  {info.label}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {info.description}
                </span>
                <span className="mt-2 block text-xs font-medium text-blue-600">
                  Vanaf {formatBedrag(info.prijsMin)}
                </span>
              </button>
            )
          )}
        </div>
      </fieldset>

      {/* Step 2: Volume selection */}
      {currentStep >= 2 && tanktype && (
        <fieldset className="rounded-lg bg-gray-50 p-6">
          <legend className="text-lg font-semibold text-gray-900">
            2. Wat is het geschatte volume van de tank?
          </legend>
          <div className="mt-4 space-y-3">
            {(Object.entries(VOLUME_OPTIES) as [VolumeKey, { label: string; factor: number }][]).map(
              ([key, info]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    volume === key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="volume"
                    value={key}
                    checked={volume === key}
                    onChange={() => {
                      setVolume(key);
                      if (currentStep === 2) setCurrentStep(3);
                    }}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{info.label}</span>
                </label>
              )
            )}
          </div>
          {volume && currentStep === 2 && (
            <button
              type="button"
              onClick={handleVolumeNext}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Volgende
            </button>
          )}
        </fieldset>
      )}

      {/* Step 3: Details (verontreiniging, toegankelijkheid, bodemonderzoek) */}
      {currentStep >= 3 && (
        <fieldset className="rounded-lg bg-gray-50 p-6">
          <legend className="text-lg font-semibold text-gray-900">
            3. Aanvullende details
          </legend>
          <div className="mt-4 space-y-6">
            {/* Verontreiniging */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verwacht u bodemverontreiniging?
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Bij lekkage of een oude tank kan de bodem verontreinigd zijn. Dit heeft grote invloed op de kosten.
              </p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
                {(Object.entries(VERONTREINIGING_OPTIES) as [VerontreinigingKey, { label: string; description: string }][]).map(
                  ([key, info]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 transition-colors ${
                        verontreiniging === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verontreiniging"
                        value={key}
                        checked={verontreiniging === key}
                        onChange={() => setVerontreiniging(key)}
                        className="mt-0.5 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-medium text-gray-900">{info.label}</span>
                        <span className="block text-xs text-gray-500">{info.description}</span>
                      </div>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Toegankelijkheid */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Toegankelijkheid van de tank
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
                {(Object.entries(TOEGANKELIJKHEID_OPTIES) as [ToegankelijkheidKey, { label: string; factor: number }][]).map(
                  ([key, info]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                        toegankelijkheid === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="toegankelijkheid"
                        value={key}
                        checked={toegankelijkheid === key}
                        onChange={() => setToegankelijkheid(key)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{info.label}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Bodemonderzoek checkbox */}
            <div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={inclBodemonderzoek}
                  onChange={(e) => setInclBodemonderzoek(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Inclusief bodemonderzoek
                  </span>
                  <span className="block text-xs text-gray-500">
                    Aanbevolen bij elke tankverwijdering ({formatBedrag(BODEMONDERZOEK_KOSTEN.min)} - {formatBedrag(BODEMONDERZOEK_KOSTEN.max)})
                  </span>
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={handleDetailsNext}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Bereken kosten
            </button>
          </div>
        </fieldset>
      )}

      {/* Step 4: Result */}
      {showResult && kosten && tanktype && (
        <div className="space-y-6">
          {/* Cost overview */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Geschatte kosten
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {TANKTYPEN[tanktype].label} - {VOLUME_OPTIES[volume as VolumeKey]?.label}
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Tankverwijdering</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatBedrag(kosten.verwijderingMin)} - {formatBedrag(kosten.verwijderingMax)}
                </span>
              </div>
              {verontreiniging === "ja" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Bodemsanering (indicatie)</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatBedrag(kosten.saneringMin)} - {formatBedrag(kosten.saneringMax)}
                  </span>
                </div>
              )}
              {inclBodemonderzoek && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Bodemonderzoek</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatBedrag(kosten.bodemonderzoekMin)} - {formatBedrag(kosten.bodemonderzoekMax)}
                  </span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">Totaal (incl. BTW)</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatBedrag(kosten.totaalMin)} - {formatBedrag(kosten.totaalMax)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-sell alert for bodemverontreiniging */}
          {(verontreiniging === "ja" || verontreiniging === "onbekend") && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Bodemonderzoek bij tankverwijdering
                  </p>
                  <p className="mt-1 text-sm text-amber-700">
                    Na het verwijderen van een olietank is bodemonderzoek wettelijk verplicht bij vermoeden van verontreiniging.
                    Bereken ook de kosten voor bodemonderzoek op{" "}
                    <a
                      href="https://bodemonderzoekvergelijken.nl/calculator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline hover:text-amber-900"
                    >
                      bodemonderzoekvergelijken.nl/calculator
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Waar is deze schatting op gebaseerd?
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                Gemiddelde marktprijzen van gecertificeerde tankverwijderingsbedrijven in Nederland (2025-2026)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                Tanktype: {TANKTYPEN[tanktype]?.label}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                Volume: {VOLUME_OPTIES[volume as VolumeKey]?.label} (factor {VOLUME_OPTIES[volume as VolumeKey]?.factor}x)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                Toegankelijkheid: {TOEGANKELIJKHEID_OPTIES[toegankelijkheid]?.label}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                Minimale projectkosten: {formatBedrag(MIN_PROJECT_KOSTEN)} (voorrijkosten, materiaal, afvoer)
              </li>
              {verontreiniging === "ja" && (
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                  Bodemsanering: indicatie op basis van gemiddelde saneringskosten bij olietanklekkage
                </li>
              )}
              {inclBodemonderzoek && (
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                  Bodemonderzoek: {formatBedrag(BODEMONDERZOEK_KOSTEN.min)} - {formatBedrag(BODEMONDERZOEK_KOSTEN.max)}
                </li>
              )}
            </ul>
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Let op: deze berekening geeft een indicatie. De werkelijke kosten hangen af van de specifieke situatie,
              de staat van de tank en de grondgesteldheid. Laat altijd een gecertificeerd bedrijf een vrijblijvende offerte uitbrengen.
            </p>
          </div>

          {/* Lead capture */}
          {!emailSubmitted ? (
            <div className="rounded-lg border border-blue-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Ontvang offertes van bedrijven bij jou in de buurt
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Vul je e-mailadres in en ontvang binnen 2 werkdagen vrijblijvende offertes
                van gecertificeerde olietankverwijderaars.
              </p>
              <form onSubmit={handleEmailSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label htmlFor="calc-email" className="block text-sm font-medium text-gray-700">
                    E-mailadres
                  </label>
                  <input
                    id="calc-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="je@email.nl"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Gratis offertes ontvangen
                </button>
              </form>
              <p className="mt-2 text-xs text-gray-400">
                Geen spam. Je gegevens worden alleen gebruikt om offertes bij je op te vragen.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Aanvraag ontvangen</h3>
              <p className="mt-1 text-sm text-gray-600">
                We koppelen je aan gecertificeerde olietankverwijderaars in jouw regio.
                Je ontvangt binnen 2 werkdagen offertes.
              </p>
            </div>
          )}

          {/* Alternative CTA */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Liever direct uitgebreid offertes vergelijken?
            </p>
            <Link
              href="/offerte"
              className="mt-2 inline-block rounded-lg border border-blue-600 px-6 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Naar het uitgebreide offerteformulier
            </Link>
          </div>

          {/* Reset */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setTanktype("");
                setVolume("");
                setVerontreiniging("onbekend");
                setToegankelijkheid("vrij");
                setInclBodemonderzoek(true);
                setShowResult(false);
                setCurrentStep(1);
                setEmailSubmitted(false);
                setEmail("");
              }}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Nieuwe berekening maken
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
