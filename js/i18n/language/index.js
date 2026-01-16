import en from "./en.json";
import zhCN from "./zh-CN.json";
import zhTW from "./zh-TW.json";
import { getCurrentLocale } from "../commands/index.js";

const defaultLocale = "zh-CN";
const dictionaries = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

function normalizeLocaleInput(input) {
  if (!input) return defaultLocale;
  const lower = String(input).toLowerCase();
  if (
    lower.startsWith("zh-tw") ||
    lower.startsWith("zh-hk") ||
    lower.startsWith("zh-hant")
  ) {
    return "zh-TW";
  }
  if (lower.startsWith("zh")) return "zh-CN";
  if (lower.startsWith("en")) return "en";
  return defaultLocale;
}

function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return key in params ? String(params[key]) : `{${key}}`;
  });
}

export function translate(locale, key, params) {
  if (!key) return undefined;
  const normalized = normalizeLocaleInput(locale);
  const dict = dictionaries[normalized] || dictionaries[defaultLocale];
  const template = dict?.[key] ?? dictionaries[defaultLocale]?.[key];
  if (!template) return undefined;
  return interpolate(template, params);
}

export function getTranslator(locale = getCurrentLocale()) {
  const normalized = normalizeLocaleInput(locale);
  return (key, fallback, params) => {
    if (!key) return fallback ?? "";
    const value = translate(normalized, key, params);
    if (value == null) return fallback ?? key;
    return value;
  };
}
