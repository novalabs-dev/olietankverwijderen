"use client";

import { useState } from "react";
import Link from "next/link";
import { leadSchema, type LeadFormData } from "@/lib/validations/lead";

type FieldErrors = Partial<Record<keyof LeadFormData, string>>;

const TYPE_DIENST_OPTIONS = [
  { value: "verwijdering", label: "Tankverwijdering" },
  { value: "sanering", label: "Bodemsanering" },
  { value: "beide", label: "Verwijdering + sanering" },
] as const;

const TYPE_TANK_OPTIONS = [
  { value: "ondergronds", label: "Ondergrondse tank" },
  { value: "bovengronds", label: "Bovengrondse tank" },
  { value: "onbekend", label: "Weet ik niet" },
] as const;

const INHOUD_TANK_OPTIONS = [
  { value: "0-1000", label: "Tot 1.000 liter" },
  { value: "1000-3000", label: "1.000 - 3.000 liter" },
  { value: "3000-6000", label: "3.000 - 6.000 liter" },
  { value: "6000+", label: "Meer dan 6.000 liter" },
  { value: "onbekend", label: "Weet ik niet" },
] as const;

const URGENTIE_OPTIONS = [
  { value: "direct", label: "Zo snel mogelijk" },
  { value: "binnen-maand", label: "Binnen een maand" },
  { value: "binnen-3-maanden", label: "Binnen 3 maanden" },
  { value: "orienterend", label: "Ik orienteer me nog" },
] as const;

export function OfferteForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    naam: "",
    email: "",
    telefoon: "",
    postcode: "",
    type_dienst: "verwijdering",
    type_tank: undefined,
    inhoud_tank: undefined,
    urgentie: undefined,
    toelichting: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  function updateField<K extends keyof LeadFormData>(
    field: K,
    value: LeadFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleSelectChange(
    field: keyof LeadFormData,
    value: string,
  ) {
    // Treat empty string as undefined for optional enum fields
    updateField(field, value === "" ? undefined : value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSubmitStatus("idle");
    setSubmitError("");

    // Validate with Zod
    const result = leadSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof LeadFormData | undefined;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          (body as { error?: string } | null)?.error ??
            "Er ging iets mis bij het versturen",
        );
      }

      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Er ging iets mis bij het versturen. Probeer het later opnieuw.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success state
  if (submitStatus === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Aanvraag ontvangen
        </h2>
        <p className="mt-2 text-gray-600">
          Bedankt voor je aanvraag! We koppelen je aan gecertificeerde
          olietankverwijderaars in jouw regio. Je ontvangt binnen 2 werkdagen
          offertes in je mailbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* API error */}
      {submitStatus === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Section 1: Contact information */}
      <fieldset className="rounded-lg bg-gray-50 p-6">
        <legend className="text-lg font-semibold text-gray-900">
          Jouw gegevens
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Naam */}
          <div className="sm:col-span-2">
            <label
              htmlFor="naam"
              className="block text-sm font-medium text-gray-700"
            >
              Naam <span className="text-red-500">*</span>
            </label>
            <input
              id="naam"
              type="text"
              autoComplete="name"
              value={formData.naam}
              onChange={(e) => updateField("naam", e.target.value)}
              placeholder="Je volledige naam"
              className={`mt-1 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.naam
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 bg-white"
              }`}
            />
            {errors.naam && (
              <p className="mt-1 text-sm text-red-600">{errors.naam}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mailadres <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="je@email.nl"
              className={`mt-1 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 bg-white"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Telefoon */}
          <div>
            <label
              htmlFor="telefoon"
              className="block text-sm font-medium text-gray-700"
            >
              Telefoonnummer
            </label>
            <input
              id="telefoon"
              type="tel"
              autoComplete="tel"
              value={formData.telefoon ?? ""}
              onChange={(e) => updateField("telefoon", e.target.value)}
              placeholder="06 12345678"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </fieldset>

      {/* Section 2: Location */}
      <fieldset className="rounded-lg bg-gray-50 p-6">
        <legend className="text-lg font-semibold text-gray-900">
          Locatie
        </legend>
        <div className="mt-4 max-w-xs">
          <label
            htmlFor="postcode"
            className="block text-sm font-medium text-gray-700"
          >
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            id="postcode"
            type="text"
            autoComplete="postal-code"
            value={formData.postcode}
            onChange={(e) => updateField("postcode", e.target.value)}
            placeholder="1234 AB"
            className={`mt-1 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.postcode
                ? "border-red-300 bg-red-50 focus:ring-red-500"
                : "border-gray-300 bg-white"
            }`}
          />
          {errors.postcode && (
            <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
          )}
        </div>
      </fieldset>

      {/* Section 3: Assignment details */}
      <fieldset className="rounded-lg bg-gray-50 p-6">
        <legend className="text-lg font-semibold text-gray-900">
          Over de opdracht
        </legend>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {/* Type dienst (required) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Welke dienst heb je nodig?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
              {TYPE_DIENST_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="type_dienst"
                    value={option.value}
                    checked={formData.type_dienst === option.value}
                    onChange={(e) =>
                      updateField(
                        "type_dienst",
                        e.target.value as LeadFormData["type_dienst"],
                      )
                    }
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.type_dienst && (
              <p className="mt-1 text-sm text-red-600">{errors.type_dienst}</p>
            )}
          </div>

          {/* Type tank */}
          <div>
            <label
              htmlFor="type_tank"
              className="block text-sm font-medium text-gray-700"
            >
              Type tank
            </label>
            <select
              id="type_tank"
              value={formData.type_tank ?? ""}
              onChange={(e) =>
                handleSelectChange("type_tank", e.target.value)
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecteer...</option>
              {TYPE_TANK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Inhoud tank */}
          <div>
            <label
              htmlFor="inhoud_tank"
              className="block text-sm font-medium text-gray-700"
            >
              Geschatte inhoud tank
            </label>
            <select
              id="inhoud_tank"
              value={formData.inhoud_tank ?? ""}
              onChange={(e) =>
                handleSelectChange("inhoud_tank", e.target.value)
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecteer...</option>
              {INHOUD_TANK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Section 4: Planning */}
      <fieldset className="rounded-lg bg-gray-50 p-6">
        <legend className="text-lg font-semibold text-gray-900">
          Planning
        </legend>
        <div className="mt-4">
          <label
            htmlFor="urgentie"
            className="block text-sm font-medium text-gray-700"
          >
            Wanneer wil je het laten uitvoeren?
          </label>
          <select
            id="urgentie"
            value={formData.urgentie ?? ""}
            onChange={(e) => handleSelectChange("urgentie", e.target.value)}
            className="mt-1 block w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecteer...</option>
            {URGENTIE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* Section 5: Additional information */}
      <fieldset className="rounded-lg bg-gray-50 p-6">
        <legend className="text-lg font-semibold text-gray-900">
          Toelichting
        </legend>
        <div className="mt-4">
          <label
            htmlFor="toelichting"
            className="block text-sm font-medium text-gray-700"
          >
            Aanvullende informatie
          </label>
          <textarea
            id="toelichting"
            rows={4}
            value={formData.toelichting ?? ""}
            onChange={(e) => updateField("toelichting", e.target.value)}
            placeholder="Beschrijf je situatie, bijv. locatie van de tank, bijzonderheden, of specifieke wensen."
            maxLength={1000}
            className={`mt-1 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.toelichting
                ? "border-red-300 bg-red-50 focus:ring-red-500"
                : "border-gray-300 bg-white"
            }`}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.toelichting ? (
              <p className="text-sm text-red-600">{errors.toelichting}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {(formData.toelichting ?? "").length} / 1000
            </span>
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Bezig met versturen..." : "Gratis offerte aanvragen"}
        </button>
        <p className="mt-3 text-xs text-gray-500">
          Door dit formulier te versturen ga je akkoord met onze{" "}
          <Link href="/privacy" className="text-blue-600 underline hover:text-blue-800">
            privacyverklaring
          </Link>
          . Je gegevens worden uitsluitend gebruikt om offertes bij je op te
          vragen.
        </p>
      </div>
    </form>
  );
}
