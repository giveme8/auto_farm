"use client";

import { useEffect, useRef } from "react";
import styles from "./MobileUnlockTree.module.css";
// @ts-ignore - JS module
import { renderMobileUnlockPixi } from "@/app/game/engine/unlock/mobile-unlock-pixi";
import { useI18n } from "../I18nProvider";

export function MobileUnlockTree({
  appRef,
  open,
  onClose,
}: {
  appRef: any;
  open: boolean;
  onClose: () => void;
}) {
  const graphRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // --- 渲染科技树 ---
  useEffect(() => {
    if (!open) return;
    const app = appRef.current;
    if (!app) return;
    if (!graphRef.current) return;

    graphRef.current.innerHTML = "";

    renderMobileUnlockPixi(app, app.unlockManager.techTree, graphRef.current, t);
  }, [open, appRef, t]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <div className={styles.scroll}>
          <div ref={graphRef} className={styles.graph} />
        </div>
      </div>
    </div>
  );
}
