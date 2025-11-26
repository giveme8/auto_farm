"use client";

import styles from "./SaveCard.module.css";
import { useI18n } from "./I18nProvider";

export interface SaveCardProps {
  id: number;
  name: string;
  savedAt: number | null;
  onLoad: () => void;
  onDelete: () => void | Promise<void>;
}

export function SaveCard({
  id,
  name,
  savedAt,
  onLoad,
  onDelete,
}: SaveCardProps) {
  const { t } = useI18n();

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <div className={styles.title}>{name}</div>
        <div className={styles.time}>
          {savedAt
            ? new Date(savedAt).toLocaleString()
            : t("saveCard.neverSaved")}
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.load} onClick={onLoad}>
          ▶ {t("saveCard.load")}
        </button>
        <button className={styles.delete} onClick={onDelete}>
          🗑 {t("saveCard.delete")}
        </button>
      </div>
    </div>
  );
}
