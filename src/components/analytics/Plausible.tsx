import Script from "next/script";
import { nicheConfig } from "@/lib/niche.config";

export function Plausible() {
  const scriptName = nicheConfig.plausibleScript;
  if (!scriptName) return null;

  return (
    <>
      <Script
        src={`https://plausible.io/js/${scriptName}`}
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
      </Script>
    </>
  );
}
