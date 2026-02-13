"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

export default function HandicapCalculation() {
  const t = useTranslations("vorgaben");
  const tTools = useTranslations("tools");

  const [playingHandicap, setPlayingHandicap] = useState("");

  // Standard stroke index order for 18 holes
  const standardSI = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const distribution = useMemo(() => {
    const hcp = parseInt(playingHandicap);
    if (isNaN(hcp) || hcp < 0) return [];

    return standardSI.map((si) => {
      let extraStrokes = 0;
      if (hcp >= si) extraStrokes++;
      if (hcp >= 18 + si) extraStrokes++;
      if (hcp >= 36 + si) extraStrokes++;
      if (hcp >= 54 + si) extraStrokes++;
      return { hole: si, si, extraStrokes };
    });
  }, [playingHandicap]);

  const totalExtra = distribution.reduce((sum, d) => sum + d.extraStrokes, 0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">{t("subtitle")}</p>

      <div>
        <label className="mb-1.5 block text-sm text-text-muted">
          {t("playingHandicap")}
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={playingHandicap}
          onChange={(e) => setPlayingHandicap(e.target.value)}
          placeholder={t("playingHandicapPlaceholder")}
          className="w-full rounded-lg border-2 border-border bg-surface-off px-4 py-3 font-[var(--font-mono)] text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
        />
      </div>

      {distribution.length > 0 && (
        <>
          <div className="overflow-hidden rounded-xl border border-border">
            {/* Header */}
            <div className="grid grid-cols-3 bg-primary px-4 py-2 text-xs font-semibold text-white">
              <div>{t("hole")}</div>
              <div className="text-center">{t("si")}</div>
              <div className="text-right">{t("extraStrokes")}</div>
            </div>

            {/* Rows */}
            {distribution.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-4 py-2 text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-surface-off"
                }`}
              >
                <div className="font-medium text-primary">{row.hole}</div>
                <div className="text-center font-[var(--font-mono)] text-text-muted">
                  {row.si}
                </div>
                <div className="text-right font-[var(--font-mono)] font-bold text-accent">
                  {row.extraStrokes > 0 ? `+${row.extraStrokes}` : "-"}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="rounded-xl bg-primary p-4 text-center">
            <div className="text-xs text-white/70">{t("totalExtra")}</div>
            <div className="font-[var(--font-mono)] text-3xl font-bold text-white">
              {totalExtra}
            </div>
          </div>

          <p className="text-xs text-text-muted">{t("explanation")}</p>
        </>
      )}

      <button
        onClick={() => setPlayingHandicap("")}
        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:bg-gray-300"
      >
        {tTools("reset")}
      </button>
    </div>
  );
}
