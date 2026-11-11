import type { BedrijfCertificering } from "@/lib/types";
import { ERKENNINGENREGISTER } from "@/lib/erkenningen";

interface CertificeringBadgeProps {
  certificering: BedrijfCertificering;
  size?: "sm" | "md";
}

const badgeColors: Record<string, string> = {
  K902: "bg-green-100 text-green-800 border-green-200",
  K904: "bg-green-100 text-green-800 border-green-200",
  K905: "bg-sky-100 text-sky-800 border-sky-200",
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
      title={`${certificering.certificering_types.naam}. Peildatum ${ERKENNINGENREGISTER.peildatumLabel}. Deze site werkt erkenningen niet automatisch bij.`}
    >
      {code}
    </span>
  );
}
