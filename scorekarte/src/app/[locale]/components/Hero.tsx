"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

type ToolType = "hcp" | "scorecard" | "stableford" | "vorgaben";

interface HeroProps {
  onToolOpen: (tool: ToolType) => void;
}

export default function Hero({ onToolOpen }: HeroProps) {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.webp"
        className="absolute inset-0 h-full w-full object-cover"
        preload="none"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Diagonal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 font-[var(--font-heading)] text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-xl text-lg text-white/80 md:text-xl"
        >
          {t("subtitle")}
        </motion.p>

        {/* Tool Quick Access Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {(
            [
              { key: "hcp" as ToolType, label: tNav("hcpCalculator") },
              { key: "scorecard" as ToolType, label: tNav("scorecard") },
              { key: "stableford" as ToolType, label: tNav("stableford") },
              { key: "vorgaben" as ToolType, label: tNav("handicap") },
            ] as const
          ).map((tool) => (
            <button
              key={tool.key}
              onClick={() => onToolOpen(tool.key)}
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-accent/20 hover:text-accent-light md:px-8 md:py-3.5 md:text-base"
            >
              {tool.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-white/60">
            {t("scrollDown")}
          </span>
          <svg
            className="h-5 w-5 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
