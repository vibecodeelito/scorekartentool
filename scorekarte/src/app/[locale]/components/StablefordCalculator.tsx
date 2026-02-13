"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface HoleEntry {
  par: number;
  strokes: number;
  handicapStrokes: number;
}

function calculateStablefordPoints(
  par: number,
  strokes: number,
  handicapStrokes: number
): number {
  const netScore = strokes - handicapStrokes;
  const diff = netScore - par;

  if (diff <= -3) return 5; // Albatross or better
  if (diff === -2) return 4; // Eagle
  if (diff === -1) return 3; // Birdie
  if (diff === 0) return 2; // Par
  if (diff === 1) return 1; // Bogey
  return 0; // Double Bogey or worse
}

export default function StablefordCalculator() {
  const t = useTranslations("stableford");
  const tTools = useTranslations("tools");

  const [holes, setHoles] = useState<HoleEntry[]>([]);
  const [currentPar, setCurrentPar] = useState("");
  const [currentStrokes, setCurrentStrokes] = useState("");
  const [currentHandicap, setCurrentHandicap] = useState("");

  const addHole = useCallback(() => {
    const par = parseInt(currentPar);
    const strokes = parseInt(currentStrokes);
    const hcpStrokes = parseInt(currentHandicap) || 0;

    if (isNaN(par) || isNaN(strokes)) return;

    setHoles([...holes, { par, strokes, handicapStrokes: hcpStrokes }]);
    setCurrentPar("");
    setCurrentStrokes("");
    setCurrentHandicap("");

    if (typeof window !== "undefined") {
      window.dataLayer?.push({
        event: "calculation_complete",
        tool_name: "stableford",
      });
    }
  }, [holes, currentPar, currentStrokes, currentHandicap]);

  const removeHole = (index: number) => {
    setHoles(holes.filter((_, i) => i !== index));
  };

  const totalPoints = holes.reduce(
    (sum, h) =>
      sum + calculateStablefordPoints(h.par, h.strokes, h.handicapStrokes),
    0
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">{t("subtitle")}</p>

      {/* Points Table */}
      <div className="rounded-lg bg-surface-off p-4">
        <h3 className="mb-3 text-sm font-bold text-primary">
          {t("pointsTable")}
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {[
            { label: t("albatross"), points: "5+" },
            { label: t("eagle"), points: "4" },
            { label: t("birdie"), points: "3" },
            { label: t("parScore"), points: "2" },
            { label: t("bogey"), points: "1" },
            { label: t("doubleBogey") + " +", points: "0" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-border/50 py-1"
            >
              <span className="text-text-muted">{row.label}</span>
              <span className="font-[var(--font-mono)] font-bold text-primary">
                {row.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Hole */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs text-text-muted">
              {t("holePar")}
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="3"
              max="5"
              value={currentPar}
              onChange={(e) => setCurrentPar(e.target.value)}
              placeholder="3-5"
              className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">
              {t("strokes")}
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={currentStrokes}
              onChange={(e) => setCurrentStrokes(e.target.value)}
              placeholder="4"
              className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">
              {t("handicapStrokes")}
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={currentHandicap}
              onChange={(e) => setCurrentHandicap(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={addHole}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
        >
          {t("addHole")}
        </button>
      </div>

      {/* Hole Entries */}
      {holes.length > 0 && (
        <div className="space-y-2">
          {holes.map((hole, i) => {
            const points = calculateStablefordPoints(
              hole.par,
              hole.strokes,
              hole.handicapStrokes
            );
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-lg bg-surface-off p-3"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="text-xs text-text-muted">
                    Par {hole.par} | {hole.strokes} {t("strokes")} |{" "}
                    {hole.handicapStrokes > 0
                      ? `+${hole.handicapStrokes} HCP`
                      : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-[var(--font-mono)] text-lg font-bold text-accent">
                    {points} Pts
                  </div>
                  <button
                    onClick={() => removeHole(i)}
                    className="text-text-muted hover:text-red-500"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Total */}
      <div className="rounded-xl bg-accent p-6 text-center">
        <div className="mb-1 text-sm text-white/80">{t("totalPoints")}</div>
        <motion.div
          key={totalPoints}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-[var(--font-mono)] text-4xl font-bold text-white"
        >
          {totalPoints}
        </motion.div>
      </div>

      {/* Reset */}
      <button
        onClick={() => setHoles([])}
        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:bg-gray-300"
      >
        {tTools("reset")}
      </button>
    </div>
  );
}
