"use client";

import { useEffect, useState, useRef } from "react";

interface AdSlotProps {
  slot: string;
  className?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
}

export default function AdSlot({
  slot,
  className = "",
  format = "auto",
}: AdSlotProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const adPushed = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (stored) {
      const consent = JSON.parse(stored);
      setHasConsent(consent.marketing === true);
    }
  }, []);

  useEffect(() => {
    if (hasConsent && adRef.current && !adPushed.current) {
      try {
        ((window as unknown as Record<string, unknown[]>).adsbygoogle =
          (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
        adPushed.current = true;
      } catch {
        // AdSense not loaded yet
      }
    }
  }, [hasConsent]);

  if (!hasConsent) {
    // Placeholder to prevent CLS
    return (
      <div className={`mx-auto max-w-[1280px] px-6 ${className}`}>
        <div className="h-[90px] rounded-lg bg-surface-off md:h-[90px]" />
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-[1280px] px-6 ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9829683139148070"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
