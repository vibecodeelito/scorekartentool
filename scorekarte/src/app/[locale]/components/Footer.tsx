"use client";

import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary py-12 text-white">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-3 font-[var(--font-heading)] text-xl font-bold">
              scorekarte.ch
            </h3>
            <p className="text-sm text-white/60">
              Golf Handicap Tools
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-accent">Tools</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>{tNav("hcpCalculator")}</li>
              <li>{tNav("scorecard")}</li>
              <li>{tNav("stableford")}</li>
              <li>{tNav("handicap")}</li>
            </ul>
          </div>

          {/* Legal + Language */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-accent">Legal</h4>
            <ul className="mb-4 space-y-2 text-sm text-white/60">
              <li>
                <a href={`/${locale}/impressum`} className="hover:text-white">
                  {t("imprint")}
                </a>
              </li>
              <li>
                <a href={`/${locale}/datenschutz`} className="hover:text-white">
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href={`/${locale}/kontakt`} className="hover:text-white">
                  {t("contact")}
                </a>
              </li>
            </ul>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {year} scorekarte.ch. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
