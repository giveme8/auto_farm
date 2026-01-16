import en from "./en.json";
import zhCN from "./zh-CN.json";
import zhTW from "./zh-TW.json";
import { defaultLocale, normalizeLocale } from "@/i18n/core";

const dictionaries = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

function normalizeLocaleInput(locale) {
  if (normalizeLocale) return normalizeLocale(locale);
  return locale || defaultLocale;
}

export function getCurrentLocale() {
  if (typeof document !== "undefined") {
    const lang = document.documentElement?.lang;
    if (lang) return normalizeLocaleInput(lang);
  }
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("coding-farm.locale");
    if (saved) return normalizeLocaleInput(saved);
  }
  return normalizeLocaleInput(defaultLocale);
}

export function getCommandDictionary(locale) {
  const key = normalizeLocaleInput(locale);
  return dictionaries[key] || dictionaries[defaultLocale];
}

export function getCropTypeAliases(locale) {
  return getCommandDictionary(locale)?.cropTypes || {};
}

export function getUnlockNameAliases(locale) {
  return getCommandDictionary(locale)?.unlockNames || {};
}

export function buildCropTypeLookup(locale, options = {}) {
  const lookup = new Map();
  const dicts = options.includeAll
    ? Object.values(dictionaries)
    : [getCommandDictionary(locale)];

  for (const dict of dicts) {
    const cropTypes = dict?.cropTypes || {};
    for (const [canonical, aliases] of Object.entries(cropTypes)) {
      const all = Array.isArray(aliases) ? aliases.slice() : [];
      all.push(canonical);
      for (const alias of all) {
        const key = String(alias ?? "").trim().toLowerCase();
        if (!key) continue;
        lookup.set(key, canonical);
      }
    }
  }

  return lookup;
}

export function getAllCropTypeAliases() {
  const merged = {};
  for (const dict of Object.values(dictionaries)) {
    const cropTypes = dict?.cropTypes || {};
    for (const [canonical, aliases] of Object.entries(cropTypes)) {
      if (!Array.isArray(aliases)) continue;
      if (!merged[canonical]) merged[canonical] = [];
      for (const alias of aliases) {
        if (!merged[canonical].includes(alias)) {
          merged[canonical].push(alias);
        }
      }
    }
  }
  return merged;
}

export function getLocalizedCropType(type, locale) {
  const cropTypes = getCropTypeAliases(locale);
  const aliases = cropTypes?.[type];
  if (Array.isArray(aliases) && aliases.length > 0) return aliases[0];
  return type;
}

export function getLocalizedUnlockName(key, locale) {
  const unlockNames = getUnlockNameAliases(locale);
  const aliases = unlockNames?.[key];
  if (Array.isArray(aliases) && aliases.length > 0) return aliases[0];
  return key;
}
