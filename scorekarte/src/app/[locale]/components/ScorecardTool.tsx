"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface NDBEntry {
  strokeIndex: number;
  par: number;
  strokes: number;
  ndb: number;
}

export default function ScorecardTool() {
  const t = useTranslations("scorecard");
  const tHcp = useTranslations("hcp");
  const tTools = useTranslations("tools");

  // HCP fields
  const [handicapIndex, setHandicapIndex] = useState("");
  const [slopeRating, setSlopeRating] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [par, setPar] = useState("");
  const [isNineHole, setIsNineHole] = useState(false);
  const [playingHandicap, setPlayingHandicap] = useState<number | null>(null);

  // Scorecard
  const [isHoleByHole, setIsHoleByHole] = useState(false);
  const [bulkStrokes, setBulkStrokes] = useState("");
  const [holeScores, setHoleScores] = useState<string[]>(Array(18).fill(""));

  // NDB
  const [ndbEntries, setNdbEntries] = useState<NDBEntry[]>([]);
  const [ndbStrokeIndex, setNdbStrokeIndex] = useState("");
  const [ndbHolePar, setNdbHolePar] = useState("");

  // Calculate playing handicap
  useEffect(() => {
    const hcp = parseFloat(handicapIndex);
    const slope = parseFloat(slopeRating);
    const cr = parseFloat(courseRating);
    const p = parseFloat(par);

    if (!isNaN(hcp) && !isNaN(slope) && !isNaN(cr) && !isNaN(p)) {
      let adjustedHcp = hcp;
      if (isNineHole) {
        adjustedHcp = Math.round((hcp / 2) * 10) / 10;
      }
      setPlayingHandicap(Math.round(adjustedHcp * (slope / 113) + (cr - p)));
    } else {
      setPlayingHandicap(null);
    }
  }, [handicapIndex, slopeRating, courseRating, par, isNineHole]);

  // Calculate totals
  const getStrokesSum = useCallback(() => {
    if (isHoleByHole) {
      return holeScores.reduce((sum, s) => sum + (parseInt(s) || 0), 0);
    }
    return parseInt(bulkStrokes) || 0;
  }, [isHoleByHole, holeScores, bulkStrokes]);

  const ndbSum = ndbEntries.reduce((sum, e) => sum + e.ndb, 0);
  const strokesSum = getStrokesSum();
  const grossScore = strokesSum + ndbSum;

  // Score differential
  const getScoreDifferential = useCallback(() => {
    const cr = parseFloat(courseRating);
    const slope = parseFloat(slopeRating);
    const hcp = parseFloat(handicapIndex);

    if (grossScore && !isNaN(cr) && !isNaN(slope)) {
      let diff = (grossScore - cr) * (113 / slope);
      if (isNineHole && !isNaN(hcp)) {
        diff += hcp * 0.52 + 1.2;
      }
      return diff;
    }
    return null;
  }, [grossScore, courseRating, slopeRating, handicapIndex, isNineHole]);

  const scoreDifferential = getScoreDifferential();

  const addNDB = () => {
    if (playingHandicap === null) return;
    const si = parseInt(ndbStrokeIndex);
    const hp = parseInt(ndbHolePar);
    if (isNaN(si) || isNaN(hp)) return;

    let strokes = 0;
    if (playingHandicap >= si) strokes++;
    if (playingHandicap >= 18 + si) strokes++;
    if (playingHandicap >= 36 + si) strokes++;
    if (playingHandicap >= 54 + si) strokes++;

    setNdbEntries([
      ...ndbEntries,
      { strokeIndex: si, par: hp, strokes, ndb: hp + strokes + 2 },
    ]);
    setNdbStrokeIndex("");
    setNdbHolePar("");

    if (typeof window !== "undefined") {
      window.dataLayer?.push({
        event: "calculation_complete",
        tool_name: "scorecard",
      });
    }
  };

  const removeNDB = (index: number) => {
    setNdbEntries(ndbEntries.filter((_, i) => i !== index));
  };

  const updateHoleScore = (index: number, value: string) => {
    const newScores = [...holeScores];
    newScores[index] = value;
    setHoleScores(newScores);

    // Auto-focus next
    if (value && value.length >= 1 && index < 17) {
      setTimeout(() => {
        const next = document.querySelector(
          `input[data-hole="${index + 1}"]`
        ) as HTMLInputElement;
        next?.focus();
      }, 80);
    }
  };

  const resetAll = () => {
    setHandicapIndex("");
    setSlopeRating("");
    setCourseRating("");
    setPar("");
    setPlayingHandicap(null);
    setBulkStrokes("");
    setHoleScores(Array(18).fill(""));
    setNdbEntries([]);
    setIsNineHole(false);
    setIsHoleByHole(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">{t("subtitle")}</p>

      {/* 9-Hole Toggle */}
      <div className="flex items-center justify-between rounded-lg bg-surface-off p-3">
        <span className="text-sm font-semibold text-primary">
          {tHcp("nineHoleMode")}
        </span>
        <button
          onClick={() => setIsNineHole(!isNineHole)}
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

      {/* Course Data */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-text-muted">
            {tHcp("handicapIndex")}
          </label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            value={handicapIndex}
            onChange={(e) => setHandicapIndex(e.target.value)}
            placeholder={tHcp("handicapIndexPlaceholder")}
            className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">
            {tHcp("slopeRating")}
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={slopeRating}
            onChange={(e) => setSlopeRating(e.target.value)}
            placeholder={tHcp("slopeRatingPlaceholder")}
            className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">
            {tHcp("courseRating")}
          </label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            value={courseRating}
            onChange={(e) => setCourseRating(e.target.value)}
            placeholder={
              isNineHole
                ? tHcp("courseRatingPlaceholder9")
                : tHcp("courseRatingPlaceholder18")
            }
            className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">
            {tHcp("par")}
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={par}
            onChange={(e) => setPar(e.target.value)}
            placeholder={isNineHole ? "35" : "72"}
            className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2.5 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Playing Handicap Display */}
      {playingHandicap !== null && (
        <div className="rounded-lg bg-primary p-3 text-center">
          <div className="text-xs text-white/70">
            {tHcp("playingHandicap")}
          </div>
          <div className="font-[var(--font-mono)] text-2xl font-bold text-white">
            {playingHandicap}
          </div>
        </div>
      )}

      {/* Score Entry Toggle */}
      <div className="flex items-center justify-between rounded-lg bg-surface-off p-3">
        <span className="text-sm font-semibold text-primary">
          {isHoleByHole ? t("holeByHole") : t("totalStrokes")}
        </span>
        <button
          onClick={() => setIsHoleByHole(!isHoleByHole)}
          className={`relative h-8 w-14 rounded-full transition-colors ${
            isHoleByHole ? "bg-accent" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
              isHoleByHole ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Score Input */}
      {isHoleByHole ? (
        <div>
          <label className="mb-2 block text-sm text-text-muted">
            {t("strokesPerHole")}
          </label>
          <div className="grid grid-cols-6 gap-2">
            {holeScores.map((score, i) => (
              <input
                key={i}
                data-hole={i}
                type="number"
                inputMode="numeric"
                min="1"
                value={score}
                onChange={(e) => updateHoleScore(i, e.target.value)}
                placeholder={String(i + 1)}
                className="rounded-lg border-2 border-border bg-surface-off p-2 text-center font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">
            {t("totalStrokes")}
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={bulkStrokes}
            onChange={(e) => setBulkStrokes(e.target.value)}
            placeholder={t("totalStrokesPlaceholder")}
            className="w-full rounded-lg border-2 border-border bg-surface-off px-4 py-3 font-[var(--font-mono)] text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
      )}

      {/* NDB Section */}
      {playingHandicap !== null && (
        <div className="rounded-xl border border-border p-4">
          <h3 className="mb-1 text-sm font-bold text-primary">
            {t("ndbTitle")}
          </h3>
          <p className="mb-3 text-xs text-text-muted">{t("ndbSubtitle")}</p>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">
                {t("strokeIndex")}
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="18"
                value={ndbStrokeIndex}
                onChange={(e) => setNdbStrokeIndex(e.target.value)}
                placeholder="1-18"
                className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">
                {t("holePar")}
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="3"
                max="5"
                value={ndbHolePar}
                onChange={(e) => setNdbHolePar(e.target.value)}
                placeholder="3-5"
                className="w-full rounded-lg border-2 border-border bg-surface-off px-3 py-2 font-[var(--font-mono)] text-sm text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={addNDB}
            className="mb-3 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            {tTools("add")}
          </button>

          {/* NDB List */}
          {ndbEntries.map((entry, i) => (
            <div
              key={i}
              className="mb-2 flex items-center justify-between rounded-lg bg-surface-off p-3"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-text-muted">
                    SI {entry.strokeIndex}
                  </div>
                  <div className="font-[var(--font-mono)] text-lg font-bold text-primary">
                    {entry.ndb}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted">
                    Par {entry.par}
                  </div>
                  <div className="text-xs text-text-muted">
                    +{entry.strokes} {t("handicapStrokes")}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeNDB(i)}
                className="rounded-md bg-gray-300 px-3 py-1 text-xs font-semibold text-text-muted transition-colors hover:bg-gray-400"
              >
                {tTools("remove")}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-primary">{t("result")}</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border-2 border-accent bg-surface-off p-4 text-center">
            <div className="text-xs text-text-muted">{t("sumStrokes")}</div>
            <div className="font-[var(--font-mono)] text-2xl font-bold text-primary">
              {strokesSum}
            </div>
          </div>
          <div className="rounded-lg border-2 border-accent bg-surface-off p-4 text-center">
            <div className="text-xs text-text-muted">{t("sumNDB")}</div>
            <div className="font-[var(--font-mono)] text-2xl font-bold text-primary">
              {ndbSum}
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-accent bg-surface-off p-4 text-center">
          <div className="text-xs text-text-muted">{t("grossScore")}</div>
          <div className="font-[var(--font-mono)] text-2xl font-bold text-primary">
            {grossScore}
          </div>
        </div>

        <div className="rounded-xl bg-primary p-6 text-center">
          <div className="mb-1 text-sm text-white/70">
            {t("scoreDifferential")}
          </div>
          <motion.div
            key={scoreDifferential}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-[var(--font-mono)] text-4xl font-bold text-white"
          >
            {scoreDifferential !== null ? scoreDifferential.toFixed(1) : "-"}
          </motion.div>
        </div>
      </div>

      {/* Reset All */}
      <button
        onClick={resetAll}
        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:bg-gray-300"
      >
        {tTools("resetAll")}
      </button>
    </div>
  );
}
