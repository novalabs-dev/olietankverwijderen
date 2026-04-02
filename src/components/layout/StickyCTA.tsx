import Link from "next/link";

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] sm:hidden">
      <Link
        href="/offerte"
        className="block w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
      >
        Gratis offerte aanvragen
      </Link>
    </div>
  );
}
