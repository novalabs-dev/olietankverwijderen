"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Olietankverwijderen<span className="text-blue-600">.nl</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/bedrijven"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Bedrijven
          </Link>
          <Link
            href="/kennisbank"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Kennisbank
          </Link>
          <Link
            href="/offerte"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Gratis offerte
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/bedrijven"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen(false)}
            >
              Bedrijven
            </Link>
            <Link
              href="/kennisbank"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen(false)}
            >
              Kennisbank
            </Link>
            <Link
              href="/offerte"
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Gratis offerte
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
