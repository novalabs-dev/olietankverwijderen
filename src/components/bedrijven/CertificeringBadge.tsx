import type { BedrijfCertificering } from "@/lib/types";
import { ERKENNINGENREGISTER } from "@/lib/erkenningen";

interface CertificeringBadgeProps {
  certificering: BedrijfCertificering;
  size?: "sm" | "md";
}

const badgeColors: Record<string, string> = {
  "BRL-7000": "bg-green-100 text-green-800 border-green-200",
};

export function CertificeringBadge({
  certificering,
  size = "md",
}: CertificeringBadgeProps) {
  const code = certificering.certificering_types.code;
  const colorClasses = badgeColors[code] ?? "bg-gray-100 text-gray-800 border-gray-200";
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClasses} ${sizeClasses}`}
      title={`Code uit ons bestand. Herkomst: ${ERKENNINGENREGISTER.naam}, peildatum ${ERKENNINGENREGISTER.peildatumLabel}. Voor tanksanering: ${ERKENNINGENREGISTER.certificaten}. Niet automatisch bijgewerkt.`}
    >
      {code}
    </span>
  );
}
