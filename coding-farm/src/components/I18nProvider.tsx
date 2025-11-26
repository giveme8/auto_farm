"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Locale,
  TranslationKey,
  defaultLocale,
  normalizeLocale,
  translate,
} from "@/i18n/core";

const STORAGE_KEY = "coding-farm.locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number>
  ) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      const browserPref = typeof navigator !== "undefined"
        ? navigator.languages?.[0] || navigator.language
        : null;
      return normalizeLocale(saved || browserPref || defaultLocale);
    }
    return defaultLocale;
  });

  // Sync localStorage if needed (runs once on mount).
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== locale) {
        localStorage.setItem(STORAGE_KEY, locale);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocale(next);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, next);
        }
      },
      t: (key, params) => translate(locale, key, params),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
