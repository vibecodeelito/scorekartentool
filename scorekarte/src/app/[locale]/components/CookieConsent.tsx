"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) {
      // Small delay so it doesn't appear immediately
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const applyConsent = (state: ConsentState) => {
    localStorage.setItem("cookie-consent", JSON.stringify(state));
    setIsVisible(false);

    // Update Google Consent Mode v2
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: state.marketing ? "granted" : "denied",
        ad_user_data: state.marketing ? "granted" : "denied",
        ad_personalization: state.marketing ? "granted" : "denied",
        analytics_storage: state.analytics ? "granted" : "denied",
      });
    }

    // Load ads only if marketing consent given
    if (state.marketing) {
      loadAds();
    }
  };

  const acceptAll = () => {
    applyConsent({ necessary: true, analytics: true, marketing: true });
  };

  const rejectAll = () => {
    applyConsent({ necessary: true, analytics: false, marketing: false });
  };

  const saveSettings = () => {
    applyConsent(consent);
  };

  const loadAds = () => {
    // Dynamically load AdSense
    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9829683139148070";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:inset-x-auto md:right-6 md:left-auto md:bottom-6"
        >
          <h3 className="mb-2 font-[var(--font-heading)] text-lg font-bold text-primary">
            {t("title")}
          </h3>
          <p className="mb-4 text-sm text-text-muted">{t("description")}</p>

          {showSettings ? (
            <div className="mb-4 space-y-3">
              {/* Necessary - always on */}
              <div className="flex items-center justify-between rounded-lg bg-surface-off p-3">
                <div>
                  <div className="text-sm font-semibold text-primary">
                    {t("necessary")}
                  </div>
                  <div className="text-xs text-text-muted">
                    {t("necessaryDesc")}
                  </div>
                </div>
                <div className="relative h-8 w-14 rounded-full bg-accent">
                  <div className="absolute top-1 left-7 h-6 w-6 rounded-full bg-white shadow-md" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between rounded-lg bg-surface-off p-3">
                <div>
                  <div className="text-sm font-semibold text-primary">
                    {t("analytics")}
                  </div>
                  <div className="text-xs text-text-muted">
                    {t("analyticsDesc")}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setConsent({ ...consent, analytics: !consent.analytics })
                  }
                  className={`relative h-8 w-14 rounded-full transition-colors ${
                    consent.analytics ? "bg-accent" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                      consent.analytics ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between rounded-lg bg-surface-off p-3">
                <div>
                  <div className="text-sm font-semibold text-primary">
                    {t("marketing")}
                  </div>
                  <div className="text-xs text-text-muted">
                    {t("marketingDesc")}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setConsent({ ...consent, marketing: !consent.marketing })
                  }
                  className={`relative h-8 w-14 rounded-full transition-colors ${
                    consent.marketing ? "bg-accent" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                      consent.marketing ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={saveSettings}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
              >
                {t("save")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={acceptAll}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-light"
              >
                {t("acceptAll")}
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:bg-gray-300"
              >
                {t("rejectAll")}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:bg-surface-off"
              >
                {t("settings")}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
