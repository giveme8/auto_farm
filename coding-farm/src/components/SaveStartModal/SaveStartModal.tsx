"use client";

import { useEffect, useState } from "react";
import {
  loadSlotMetaList,
  saveSlotMetaList,
  loadSlotData,
  SAVE_SLOT_PREFIX,
} from "@/utils/storage";
import { useConfirm } from "@/components/ConfirmProvider";
import { getCurrentTimeString } from "@/utils/time";
import { SaveCard } from "@/components/SaveCard";
import { useI18n } from "../I18nProvider";
import { LanguageSwitcher } from "../LanguageSwitcher";

import styles from "./SaveStartModal.module.css";

export interface SaveSlotMeta {
  id: number;
  name: string;
  savedAt: number | null;
}

export interface StartGameParams {
  saveData: any;
  slotId: number;
  slotName: string;
}

export function SaveStartModal({
  onStartGame,
}: {
  onStartGame: (info: StartGameParams) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const [showList, setShowList] = useState(false);
  const [slots, setSlots] = useState<SaveSlotMeta[]>([]);

  const confirm = useConfirm();

  /** 初始化加载所有存档信息 */
  useEffect(() => {
    Promise.resolve().then(() => {
      setSlots(loadSlotMetaList());
    });
  }, []);

  /** 刷新列表 */
  function refresh() {
    setSlots(loadSlotMetaList());
  }

  /** 创建新游戏 */
  function createNewGame() {
    const metaList = loadSlotMetaList();
    const newId =
      metaList.length > 0 ? Math.max(...metaList.map((m) => m.id)) + 1 : 1;

    const name = t("saveStart.autoName", { time: getCurrentTimeString() });

    const meta: SaveSlotMeta = { id: newId, name, savedAt: null };
    metaList.push(meta);
    saveSlotMetaList(metaList);

    setOpen(false);
    onStartGame({ saveData: null, slotId: newId, slotName: name });
  }

  /** 删除存档槽 */
  async function deleteSlot(id: number, name: string) {
    const ok = await confirm(
      t("confirm.deleteTitle"),
      t("confirm.deleteMessage", { name })
    );
    if (!ok) return;

    const metaList = loadSlotMetaList();
    const idx = metaList.findIndex((m) => m.id === id);
    if (idx !== -1) metaList.splice(idx, 1);

    localStorage.removeItem(SAVE_SLOT_PREFIX + id);
    saveSlotMetaList(metaList);

    refresh();
  }

  /** UI 关闭 */
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.langSwitcher}>
          <LanguageSwitcher />
        </div>
        <h2 className={styles.title}>{t("saveStart.title")}</h2>
        <p className={styles.subtitle}>{t("saveStart.subtitle")}</p>

        <div className={styles.actions}>
          <button className={styles.newGameBtn} onClick={createNewGame}>
            {t("saveStart.newGame")}
          </button>

          <button className={styles.loadBtn} onClick={() => setShowList(true)}>
            {t("saveStart.loadGame")}
          </button>
        </div>

        {showList && (
          <div className={styles.saveListWrap}>
            <div className={styles.headerRow}>
              <div className={styles.saveListTitle}>
                {t("saveStart.chooseSlot")}
              </div>
            </div>

            <div className={styles.slotList}>
              {slots.length === 0 && (
                <div className={styles.empty}>{t("saveStart.empty")}</div>
              )}

              {slots.map((slot) => (
                <SaveCard
                  key={slot.id}
                  id={slot.id}
                  name={slot.name}
                  savedAt={slot.savedAt}
                  onLoad={() => {
                    const data = loadSlotData(slot.id);
                    setOpen(false);
                    onStartGame({
                      saveData: data,
                      slotId: slot.id,
                      slotName: slot.name,
                    });
                  }}
                  onDelete={() => deleteSlot(slot.id, slot.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
