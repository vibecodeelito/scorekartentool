"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import ToolOverlay from "./components/ToolOverlay";
import HcpCalculator from "./components/HcpCalculator";
import ScorecardTool from "./components/ScorecardTool";
import StablefordCalculator from "./components/StablefordCalculator";
import HandicapCalculation from "./components/HandicapCalculation";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import AdSlot from "./components/AdSlot";

type ToolType = "hcp" | "scorecard" | "stableford" | "vorgaben" | null;

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const t = useTranslations();

  const openTool = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    if (typeof window !== "undefined") {
      window.dataLayer?.push({
        event: "tool_open",
        tool_name: tool,
      });
    }
  }, []);

  const closeTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  const toolTitles: Record<string, string> = {
    hcp: t("hcp.title"),
    scorecard: t("scorecard.title"),
    stableford: t("stableford.title"),
    vorgaben: t("vorgaben.title"),
  };

  return (
    <>
      <Navigation onToolOpen={openTool} />
      <Hero onToolOpen={openTool} />

      {/* Top ad banner */}
      <AdSlot slot="top-banner" className="py-4" />

      <HowItWorks />

      {/* In-content ad */}
      <AdSlot slot="in-content" className="py-4" />

      <Footer />

      {/* Tool Overlays */}
      <ToolOverlay
        isOpen={activeTool !== null}
        onClose={closeTool}
        title={activeTool ? toolTitles[activeTool] : ""}
      >
        {activeTool === "hcp" && <HcpCalculator />}
        {activeTool === "scorecard" && <ScorecardTool />}
        {activeTool === "stableford" && <StablefordCalculator />}
        {activeTool === "vorgaben" && <HandicapCalculation />}
      </ToolOverlay>

      <CookieConsent />
    </>
  );
}
