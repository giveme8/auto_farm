// src/app/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { SaveStartModal } from "@/components/SaveStartModal/SaveStartModal";
import { useAlert } from "@/components/AlertProvider";
import { useConfirm } from "@/components/ConfirmProvider";
import Script from "next/script";
import { useConsole } from "@/components/Console/Console";

import HeaderBar from "@/components/Header/Header";
import { UnlockTree } from "@/components/Unlock/UnlockTree";
import { initMain } from "./game/initMain";
import { UiBridge, UiMessage } from "./game/types";
import { useI18n } from "@/components/I18nProvider";
import type { TranslationKey } from "@/i18n/core";

const ACE_SRC =
  "https://cdn.jsdelivr.net/npm/ace-builds@1.32.0/src-min-noconflict/ace.js";
const ACE_EXT_SRC =
  "https://cdn.jsdelivr.net/npm/ace-builds@1.32.0/src-noconflict/ext-language_tools.js";

const INVENTORY_LABEL_MAP: Record<string, TranslationKey> = {
  hay: "inventory.hay",
  wood: "inventory.wood",
  carrot: "inventory.carrot",
  pumpkin: "inventory.pumpkin",
  cactus: "inventory.cactus",
  gold: "inventory.gold",
  apple: "inventory.apple",
  sunflower: "inventory.sunflower",
  water: "inventory.water",
  fertilizer: "inventory.fertilizer",
};

type InventorySnapshot = Record<string, number>;

export default function HomePage() {
  const appRef = useRef<any | null>(null);
  const alert = useAlert();
  const confirm = useConfirm();
  const { t } = useI18n();

  const consoleApi = useConsole();

  const [msg, setMsg] = useState("...");
  const [slotName, setSlotName] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventorySnapshot | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const slotLabel = slotName ?? t("app.unusedSlot");

  const inventoryLabel = useMemo(() => {
    if (!inventory) return "";

    const merged = new Map<string, number>();

    for (const [key, rawValue] of Object.entries(inventory)) {
      const value = Number.isFinite(rawValue) ? (rawValue as number) : 0;
      const labelKey = INVENTORY_LABEL_MAP[key];
      const label = labelKey ? t(labelKey) : key;
      merged.set(label, (merged.get(label) ?? 0) + value);
    }

    return Array.from(merged.entries())
      .map(([label, value]) => `${label}(${value})`)
      .join(" ");
  }, [inventory, t]);

  const ui: UiBridge = {
    alert,
    confirm,

    setMsg: (m: UiMessage) => {
      if (typeof m === "string") {
        setMsg(m);
        return;
      }
      setMsg(t(m.key, m.params));
    },

    updateInventory: (inv) => {
      setInventory(inv);
    },

    updateSlotLabel: (name) => setSlotName(name),

    setRunState: (running) => setIsRunning(running),

    console: {
      log: consoleApi.log,
      system: consoleApi.system,
    },

    toggleUnlockTree: (show) => setShowUnlock(show),
  };

  const handleStartGame = async ({
    saveData,
    slotId,
    slotName,
  }: {
    saveData: any;
    slotId: number;
    slotName: string;
  }) => {
    // 真正启动游戏
    appRef.current = await initMain({
      saveData,
      slotId,
      slotName,
      ui: ui,
    });
    setSlotName(slotName);
  };

  // 以后 run / reset / save 都可以通过 appRef.current 调用
  // 比如将来：
  // const handleSave = () => appRef.current?.saveCurrentSlot?.();

  return (
    <>
      <Script
        src={ACE_SRC}
        strategy="afterInteractive"
      />
      <Script
        src={ACE_EXT_SRC}
        strategy="afterInteractive"
        id="ace-ext"
      />

      {/* 自定义标记：Ace 已经加载完成 */}
      <Script id="ace-ready" strategy="afterInteractive">
        {`window.__aceReady = true;`}
      </Script>

      {/* 启动 / 存档选择弹窗 */}
      <SaveStartModal onStartGame={handleStartGame} />

      <HeaderBar
        msg={msg}
        inventory={inventoryLabel}
        slotName={slotLabel}
        isRunning={isRunning}
        onRun={() => appRef.current?.runUserCode()}
        onAbort={() => appRef.current?.abortRun()}
        onReset={() => appRef.current?.resetGame()}
        onSave={() => appRef.current?.saveCurrentSlot()}
        onToggleTech={() => ui.toggleUnlockTree(true)}
      />

      <UnlockTree
        appRef={appRef}
        open={showUnlock}
        onClose={() => setShowUnlock(false)}
      />

      <div id="editor" />

      <div id="game">
        <canvas id="map" width={400} height={400} />
      </div>
    </>
  );
}
