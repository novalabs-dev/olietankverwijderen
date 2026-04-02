"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostcodeSearchProps {
  size?: "lg" | "md";
  className?: string;
}

export function PostcodeSearch({ size = "lg", className = "" }: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = postcode.trim();
    if (!cleaned) {
      router.push("/bedrijven");
      return;
    }
    router.push(`/bedrijven?postcode=${encodeURIComponent(cleaned)}`);
  }

  const inputClasses = size === "lg"
    ? "rounded-l-lg border border-r-0 border-gray-300 px-4 py-3.5 text-base"
    : "rounded-l-lg border border-r-0 border-gray-300 px-3 py-2.5 text-sm";

  const buttonClasses = size === "lg"
    ? "rounded-r-lg bg-blue-600 px-6 py-3.5 text-base font-medium text-white hover:bg-blue-700"
    : "rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700";

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-md ${className}`}>
      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        placeholder="Vul je postcode in"
        className={`w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClasses}`}
      />
      <button type="submit" className={`shrink-0 shadow-sm transition-colors ${buttonClasses}`}>
        Zoek
      </button>
    </form>
  );
}
