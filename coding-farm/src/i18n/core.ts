import en from "./language/en.json";
import zhCN from "./language/zh-CN.json";
import zhTW from "./language/zh-TW.json";

export type Locale = "en" | "zh-CN" | "zh-TW";

export const defaultLocale: Locale = "zh-CN";

export const localeOptions: { code: Locale; labelKey: TranslationKey }[] = [
  { code: "en", labelKey: "language.en" },
  { code: "zh-CN", labelKey: "language.zh-CN" },
  { code: "zh-TW", labelKey: "language.zh-TW" },
];

type TranslationShape = typeof en;

const dictionaries = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
} satisfies Record<Locale, TranslationShape>;

export type TranslationKey = keyof TranslationShape;

function interpolate(
  template: string,
  params?: Record<string, string | number>
) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return key in params ? String(params[key]) : `{${key}}`;
  });
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
) {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  const template = dict[key] ?? dictionaries[defaultLocale][key];
  return interpolate(template, params);
}

export function normalizeLocale(input?: string | null): Locale {
  if (!input) return defaultLocale;

  const lower = input.toLowerCase();

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
