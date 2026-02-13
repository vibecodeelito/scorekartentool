/* eslint-disable no-var */

interface Window {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
}

declare var window: Window & typeof globalThis;
