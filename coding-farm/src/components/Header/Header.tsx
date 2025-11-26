"use client";
import styles from "./Header.module.css";
import { useI18n } from "../I18nProvider";

interface HeaderProps {
  msg: string;
  inventory: string | number;
  slotName: string;
  isRunning: boolean;
  onRun: () => void;
  onAbort: () => void;
  onReset: () => void;
  onSave: () => void;
  onToggleTech: () => void;
}

export default function Header({
  msg,
  inventory,
  slotName,
  isRunning,
  onRun,
  onAbort,
  onReset,
  onSave,
  onToggleTech,
}: HeaderProps) {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <h1>{t("app.title")}</h1>
      <span>{msg}</span>
      <span>🎒 {inventory}</span>
      <span>{slotName}</span>

      <button onClick={isRunning ? onAbort : onRun}>
        {isRunning ? t("header.abort") : t("header.run")}
      </button>

      <button className="secondary" onClick={onReset}>
        {t("header.reset")}
      </button>
      <button className="secondary" onClick={onSave}>
        {t("header.save")}
      </button>
      <button className="secondary" onClick={onToggleTech}>
        {t("header.techTree")}
      </button>
    </header>
  );
}
