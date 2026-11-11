import { ERKENNINGENREGISTER } from "@/lib/erkenningen";

interface ErkenningenregisterLinkProps {
  children?: string;
  className?: string;
}

export function ErkenningenregisterLink({
  children = ERKENNINGENREGISTER.naam,
  className = "text-blue-600 underline hover:text-blue-800",
}: ErkenningenregisterLinkProps) {
  return (
    <a
      href={ERKENNINGENREGISTER.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
