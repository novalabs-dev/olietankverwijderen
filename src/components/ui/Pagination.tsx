import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  function buildHref(page: number): string {
    const separator = basePath.includes("?") ? "&" : "?";
    if (page === 1) return basePath;
    return `${basePath}${separator}pagina=${page}`;
  }

  return (
    <nav aria-label="Paginering" className="mt-8 flex justify-center">
      <ul className="flex items-center gap-1">
        {currentPage > 1 && (
          <li>
            <Link
              href={buildHref(currentPage - 1)}
              className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              aria-label="Vorige pagina"
            >
              &larr; Vorige
            </Link>
          </li>
        )}

        {pages.map((page, i) =>
          page === "..." ? (
            <li key={`ellipsis-${i}`}>
              <span className="flex h-10 w-10 items-center justify-center text-sm text-gray-400">
                &hellip;
              </span>
            </li>
          ) : (
            <li key={page}>
              <Link
                href={buildHref(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            </li>
          ),
        )}

        {currentPage < totalPages && (
          <li>
            <Link
              href={buildHref(currentPage + 1)}
              className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              aria-label="Volgende pagina"
            >
              Volgende &rarr;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

/** Build a compact page number list with ellipsis, e.g. [1, 2, 3, '...', 10] */
function getPageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}
