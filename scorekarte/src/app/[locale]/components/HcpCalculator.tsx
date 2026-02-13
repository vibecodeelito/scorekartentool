"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function HcpCalculator() {
  const t = useTranslations("hcp");
  const tTools = useTranslations("tools");

  const [handicapIndex, setHandicapIndex] = useState("");
  const [slopeRating, setSlopeRating] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [par, setPar] = useState("");
  const [isNineHole, setIsNineHole] = useState(false);
  const [selectedPar, setSelectedPar] = useState<number | null>(null);
  const [playingHandicap, setPlayingHandicap] = useState<number | null>(null);
  const [formulaText, setFormulaText] = useState("");

  const parOptions18 = [70, 71, 72];
  const parOptions9 = [34, 35, 36];
  const parOptions = isNineHole ? parOptions9 : parOptions18;

  const calculate = useCallback(() => {
    const hcp = parseFloat(handicapIndex);
    const slope = parseFloat(slopeRating);
    const cr = parseFloat(courseRating);
    const p = parseFloat(par);

    if (!isNaN(hcp) && !isNaN(slope) && !isNaN(cr) && !isNaN(p)) {
      let adjustedHcp = hcp;
      let formula = "";

      if (isNineHole) {
        adjustedHcp = Math.round((hcp / 2) * 10) / 10;
        formula = `9-Hole: (${hcp}/2) × (${slope}/113) + (${cr} - ${p}) = ${adjustedHcp} × (${slope}/113) + (${cr} - ${p})`;
      } else {
        formula = `18-Hole: ${hcp} × (${slope}/113) + (${cr} - ${p})`;
      }

      const exact = adjustedHcp * (slope / 113) + (cr - p);
      const rounded = Math.round(exact);
      formula += ` = ${exact.toFixed(2)} → ${rounded} (${t("roundedTo")})`;

      setPlayingHandicap(rounded);
      setFormulaText(formula);

      if (typeof window !== "undefined") {
        window.dataLayer?.push({
          event: "calculation_complete",
          tool_name: "hcp_calculator",
        });
      }
    } else {
      setPlayingHandicap(null);
      setFormulaText("");
    }
  }, [handicapIndex, slopeRating, courseRating, par, isNineHole, t]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const selectPar = (value: number) => {
    setPar(String(value));
    setSelectedPar(value);
  };

  const reset = () => {
    setHandicapIndex("");
    setSlopeRating("");
    setCourseRating("");
    setPar("");
    setSelectedPar(null);
    setPlayingHandicap(null);
    setFormulaText("");
    setIsNineHole(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">{t("subtitle")}</p>

      {/* 9-Hole Toggle */}
      <div className="flex items-center justify-between rounded-lg bg-surface-off p-3">
        <span className="text-sm font-semibold text-primary">
          {t("nineHoleMode")}
        </span>
        <button
          onClick={() => {
            setIsNineHole(!isNineHole);
            setPar("");
            setSelectedPar(null);
          }}
          className={`relative h-8 w-14 rounded-full transition-colors ${
            isNineHole ? "bg-accent" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
              isNineHole ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Handicap Index */}
      <div>
        <label className="mb-1.5 block text-sm text-text-muted">
          {t("handicapIndex")}
        </label>
        <input
          type="number"
          step="0.1"
          inputMode="decimal"
          value={handicapIndex}
          onChange={(e) => setHandicapIndex(e.target.value)}
          placeholder={t("handicapIndexPlaceholder")}
          className="w-full rounded-lg border-2 border-border bg-surface-off px-4 py-3 font-[var(--font-mono)] text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
        />
      </div>

      {/* Slope Rating */}
      <div>
        <label className="mb-1.5 block text-sm text-text-muted">
          {t("slopeRating")}
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={slopeRating}
          onChange={(e) => setSlopeRating(e.target.value)}
          placeholder={t("slopeRatingPlaceholder")}
          className="w-full rounded-lg border-2 border-border bg-surface-off px-4 py-3 font-[var(--font-mono)] text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
        />
      </div>

      {/* Course Rating */}
      <div>
        <label className="mb-1.5 block text-sm text-text-muted">
          {t("courseRating")} (
          {isNineHole ? t("use9HoleValue") : t("use18HoleValue")})
        </label>
        <input
          type="number"
          step="0.1"
          inputMode="decimal"
          value={courseRating}
          onChange={(e) => setCourseRating(e.target.value)}
          placeholder={
            isNineHole
              ? t("courseRatingPlaceholder9")
              : t("courseRatingPlaceholder18")
          }
          className="w-full rounded-lg border-2 border-border bg-surface-off px-4 py-3 font-[var(--font-mono)] text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
        />
      </div>

      {/* Par */}
      <div>
        <label className="mb-1.5 block text-sm text-text-muted">
          {t("par")} ({isNineHole ? t("use9HoleValue") : t("use18HoleValue")})
        </label>
        <div className="flex gap-2">
          {parOptions.map((p) => (
            <button
              key={p}
              onClick={() => selectPar(p)}
              className={`flex-1 rounded-lg border-2 px-4 py-3 font-[var(--font-mono)] font-semibold transition-all ${
                selectedPar === p
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface-off text-primary hover:border-accent/50"
              }`}
            >
              {p}
            </button>
          ))}
          <input
            type="number"
            inputMode="numeric"
            value={selectedPar ? "" : par}
            onChange={(e) => {
              setPar(e.target.value);
              setSelectedPar(null);
            }}
            placeholder={t("parOther")}
            className="flex-1 rounded-lg border-2 border-border bg-surface-off px-4 py-3 font-[var(--font-mono)] text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Result */}
      <div className="rounded-xl bg-accent p-6 text-center">
        <div className="mb-1 text-sm text-white/80">{t("playingHandicap")}</div>
        <motion.div
          key={playingHandicap}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-[var(--font-mono)] text-4xl font-bold text-white"
        >
          {playingHandicap !== null ? playingHandicap : "-"}
        </motion.div>
      </div>

      {/* Formula Info */}
      {formulaText && (
        <div className="rounded-lg border-l-4 border-accent bg-surface-off p-4">
          <div className="mb-1 text-xs font-semibold text-text-muted">
            {t("formula")}
          </div>
          <div className="font-[var(--font-mono)] text-xs text-primary">
            {formulaText}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={reset}
        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:bg-gray-300"
      >
        {tTools("reset")}
      </button>
    </div>
  );
}
