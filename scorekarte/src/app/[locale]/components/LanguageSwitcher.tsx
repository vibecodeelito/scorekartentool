"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border px-1 py-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-all ${
            locale === loc
              ? "bg-accent text-white"
              : "text-text-muted hover:text-text-dark"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
