"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { routing } from "@/i18n/routing";

type ToolType = "hcp" | "scorecard" | "stableford" | "vorgaben";

interface NavigationProps {
  onToolOpen: (tool: ToolType) => void;
}

export default function Navigation({ onToolOpen }: NavigationProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));

    if (typeof window !== "undefined") {
      window.dataLayer?.push({
        event: "language_switch",
        language_from: locale,
        language_to: newLocale,
      });
    }
  };

  const tools: { key: ToolType; label: string }[] = [
    { key: "hcp", label: t("hcpCalculator") },
    { key: "scorecard", label: t("scorecard") },
    { key: "stableford", label: t("stableford") },
    { key: "vorgaben", label: t("handicap") },
  ];

  const handleToolClick = (tool: ToolType) => {
    onToolOpen(tool);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
            href={`/${locale}`}
            className={`font-[var(--font-heading)] text-xl font-bold tracking-tight transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            scorekarte.ch
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {tools.map((tool) => (
              <button
                key={tool.key}
                onClick={() => handleToolClick(tool.key)}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isScrolled ? "text-text-dark" : "text-white"
                }`}
              >
                {tool.label}
              </button>
            ))}

            {/* Language Switcher */}
            <div className="ml-4 flex items-center gap-1 rounded-full border border-white/20 px-1 py-1">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-all ${
                    locale === loc
                      ? "bg-accent text-white"
                      : isScrolled
                        ? "text-text-muted hover:text-text-dark"
                        : "text-white/70 hover:text-white"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Menu"
          >
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isMenuOpen
                  ? "translate-y-2 rotate-45 bg-white"
                  : isScrolled
                    ? "bg-text-dark"
                    : "bg-white"
              }`}
            />
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isMenuOpen
                  ? "opacity-0"
                  : isScrolled
                    ? "bg-text-dark"
                    : "bg-white"
              }`}
            />
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isMenuOpen
                  ? "-translate-y-2 -rotate-45 bg-white"
                  : isScrolled
                    ? "bg-text-dark"
                    : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-primary"
          >
            <motion.div className="flex flex-col items-center gap-8">
              {tools.map((tool, index) => (
                <motion.button
                  key={tool.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  onClick={() => handleToolClick(tool.key)}
                  className="text-2xl font-semibold text-white transition-colors hover:text-accent"
                >
                  {tool.label}
                </motion.button>
              ))}

              {/* Mobile Language Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center gap-2"
              >
                {routing.locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      switchLocale(loc);
                      setIsMenuOpen(false);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold uppercase transition-all ${
                      locale === loc
                        ? "bg-accent text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
