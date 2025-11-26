"use client";

import { useI18n } from "@/components/I18nProvider";

export default function DocHome() {
  const { t } = useI18n();
  return <div>{t("doc.prompt")}</div>;
}
