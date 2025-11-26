"use client";

import { localeOptions, type Locale } from "@/i18n/core";
import { useI18n } from "./I18nProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        border: "1px solid #333",
        borderRadius: 8,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <span style={{ fontSize: 12, opacity: 0.8 }}>
        {t("language.label")}:
      </span>
      <select
        value={locale}
        aria-label={t("language.label")}
        onChange={(e) => setLocale(e.target.value as Locale)}
        style={{
          background: "transparent",
          color: "inherit",
          border: "none",
          fontSize: 12,
        }}
      >
        {localeOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
