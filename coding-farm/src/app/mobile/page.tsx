"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SVGProps,
} from "react";
import Script from "next/script";
import { SaveStartModal } from "@/components/SaveStartModal/SaveStartModal";
import { MobileUnlockTree } from "@/components/Unlock/MobileUnlockTree";
import { useAlert } from "@/components/AlertProvider";
import { useConfirm } from "@/components/ConfirmProvider";
import { useConsole } from "@/components/Console/Console";
import { useI18n } from "@/components/I18nProvider";
import { initMain } from "@/app/game/initMain";
import type { UiBridge, UiMessage } from "@/app/game/types";
import { isMobileUserAgent } from "@/utils/device";
import styles from "./MobilePage.module.css";

const ACE_SRC =
  "https://cdn.jsdelivr.net/npm/ace-builds@1.32.0/src-min-noconflict/ace.js";
const ACE_EXT_SRC =
  "https://cdn.jsdelivr.net/npm/ace-builds@1.32.0/src-noconflict/ext-language_tools.js";

type InventorySnapshot = Record<string, number>;

function formatCount(value: number | string) {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "0";
  if (value >= 100000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function AssetIcon({ src, label }: { src: string; label: string }) {
  return (
    <span
      className={styles.assetIcon}
      style={{ backgroundImage: `url(${src})` }}
      aria-label={label}
      role="img"
    />
  );
}

type IconProps = SVGProps<SVGSVGElement>;

function CoinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" fill="#f5d04c" />
      <circle cx="12" cy="12" r="7" stroke="#d69b22" strokeWidth="2" />
      <path
        d="M12 7v10m-3-2h6m-6-4h6"
        stroke="#9a5f12"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8 6h8l-1.5 2.5L17 10v7c0 .8-.7 1.5-1.6 1.5H8.6C7.7 18.5 7 17.8 7 17v-7l2.5-1.5L8 6Z"
        fill="#d9b26b"
        stroke="#7b531b"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 6.5c.4-.6 1.2-1 2.5-1s2.1.4 2.5 1"
        stroke="#7b531b"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PickaxeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m8 7.5 8 9m-3.5-3-3.7 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13 10.5c2.5-1 4.8-1 7 0-1.5 2-3.8 3.2-7 3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TerminalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m8 10 3 2-3 2m4.5 2H16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3.2c-4.4 0-8 3.6-8 8.1 0 3.6 2.3 6.7 5.5 7.8.4.1.6-.2.6-.5v-1.8c-2.2.5-2.6-1-2.6-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.8 2.3.6.1-.5.3-.8.5-1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2 0 0-.1-.2 0-.6 0-.2.2-.1.6.2a4.1 4.1 0 0 1 2.9 0c.4-.3.6-.4.6-.2.1.4 0 .6 0 .6.5.6.8 1.3.8 2.2 0 3.1-1.8 3.8-3.6 4 .3.2.6.7.6 1.4v2c0 .3.2.6.6.5A8.1 8.1 0 0 0 20 11.3c0-4.5-3.6-8.1-8-8.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SaveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 5h9l3 3v10H6z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9 5v4h6V5M9 17h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 8h14M5 12h14M5 16h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WrenchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14.5 5.3c.5 2.4-.3 4.1-2.2 5.2l-3.5 2.1-.8-.8 2.1-3.5c1-1.9 2.8-2.7 5.2-2.2l2-2c.4 1.6 0 3.1-.9 4.2l-1.9-1.9Z"
        fill="currentColor"
      />
      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function SeedsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M11 6c-2.5.5-4 2.4-4 4.6 0 2 1.6 3.6 3.6 3.4C13 13.8 15 11 15 8.5 15 7.6 14 6 11 6Zm2.8 7.2c-.7 2 .2 4.3 2.2 4.7 2 .4 3.8-1.6 3.4-3.7-.4-2-2.6-3.3-5.6-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShovelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m7.5 16.5 4.5-4.5m2-2L17 7c.6-.6 1.6-.6 2.2 0 .6.6.6 1.6 0 2.2l-3 3c-.6.6-1.6.6-2.2 0l-.5-.5m-3 9-3-3c-.8-.8-.8-2.2 0-3l1-1 4 4-1 1c-.8.8-2.2.8-3 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropletIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 4c-2.5 3.3-4.5 5.8-4.5 8.6C7.5 16.5 9.9 19 12 19s4.5-2.5 4.5-6.4C16.5 9.8 14.5 7.3 12 4Z"
        fill="currentColor"
      />
      <path
        d="M9.8 14.3c.4 1.1 1.3 1.8 2.4 1.9"
        stroke="#d7f2ff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MobilePage() {
  const appRef = useRef<any | null>(null);
  const alert = useAlert();
  const confirm = useConfirm();
  const { t } = useI18n();
  const consoleApi = useConsole();
  const consoleRef = useRef(consoleApi);
  consoleRef.current = consoleApi;

  const [msg, setMsg] = useState("...");
  const [slotName, setSlotName] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventorySnapshot | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [isLandscape, setIsLandscape] = useState(true);
  const [ready, setReady] = useState(false);
  const [aceLoaded, setAceLoaded] = useState(false);

  const slotLabel = slotName ?? t("app.unusedSlot");

  useEffect(() => {
    document.body.classList.add("mobile-body");
    return () => {
      document.body.classList.remove("mobile-body");
      document.body.classList.remove("mobile-console-hidden");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-console-hidden", !showLogs);
  }, [showLogs]);

  // 当编辑器抽屉打开时，调用 Ace resize 确保正确渲染
  useEffect(() => {
    if (showEditor && appRef.current?.editor) {
      // 稍微延迟以等待 CSS transition 完成
      const timer = setTimeout(() => {
        try {
          appRef.current.editor.resize();
        } catch (e) {
          // 忽略 resize 错误
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [showEditor]);

  useEffect(() => {
    const updateOrientation = () =>
      setIsLandscape(
        typeof window !== "undefined"
          ? window.innerWidth >= window.innerHeight
          : true
      );
    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    // Allow direct access on desktop but still render; main entry already redirects mobile users here.
    if (ua && !isMobileUserAgent(ua)) {
      setReady(true);
      return;
    }
    setReady(true);
  }, []);

  const ui: UiBridge = {
    alert,
    confirm,
    setMsg: (m: UiMessage) => {
      let message: string;
      if (typeof m === "string") {
        message = m;
      } else {
        message = t(m.key, m.params);
      }
      setMsg(message);
      consoleRef.current.system(message);
    },
    updateInventory: (inv) => setInventory(inv),
    updateSlotLabel: (name) => setSlotName(name),
    setRunState: (running) => {
      setIsRunning(running);
      if (running) setShowLogs(true);
    },
    console: {
      log: (args: any[], source?: "user" | "system") => consoleRef.current.log(args, source),
      system: (msg: string) => consoleRef.current.system(msg),
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
    appRef.current = await initMain({
      saveData,
      slotId,
      slotName,
      ui: ui,
    });
    setSlotName(slotName);
  };

  const handleRun = () => {
    if (!appRef.current) return;
    appRef.current.runUserCode();
  };

  const handleAbort = () => appRef.current?.abortRun();
  const handleReset = () => appRef.current?.resetGame();
  const handleSave = () => {
    appRef.current?.saveCurrentSlot();
    consoleRef.current.system(t("status.saved"));
  };

  const resources = useMemo(() => {
    const inv = inventory ?? {};
    return [
      {
        id: "hay",
        value: inv.hay ?? 0,
        icon: <AssetIcon src="/images/hay.png" label={t("inventory.hay")} />,
      },
      {
        id: "wood",
        value: inv.wood ?? 0,
        icon: <AssetIcon src="/images/tree.png" label={t("inventory.wood")} />,
      },
      {
        id: "carrot",
        value: inv.carrot ?? 0,
        icon: <AssetIcon src="/images/carrot.png" label={t("inventory.carrot")} />,
      },
      {
        id: "pumpkin",
        value: inv.pumpkin ?? 0,
        icon: <AssetIcon src="/images/pumpkin.png" label={t("inventory.pumpkin")} />,
      },
      {
        id: "cactus",
        value: inv.cactus ?? 0,
        icon: <AssetIcon src="/images/cactus.png" label={t("inventory.cactus")} />,
      },
      {
        id: "gold",
        value: inv.gold ?? 0,
        icon: <AssetIcon src="/images/treasure.png" label={t("inventory.gold")} />,
      },
      {
        id: "apple",
        value: inv.apple ?? 0,
        icon: <AssetIcon src="/images/apple.png" label={t("inventory.apple")} />,
      },
      {
        id: "sunflower",
        value: inv.sunflower ?? 0,
        icon: <AssetIcon src="/images/sunflower.png" label={t("inventory.sunflower")} />,
      },
      {
        id: "water",
        value: inv.water ?? 0,
        icon: <DropletIcon className={styles.vectorIcon} aria-hidden />,
      },
      {
        id: "fertilizer",
        value: inv.fertilizer ?? 0,
        icon: <BagIcon className={styles.vectorIcon} aria-hidden />,
      },
    ];
  }, [inventory, t]);

  if (!ready) return null;

  return (
    <>
      <Script
        src={ACE_SRC}
        strategy="afterInteractive"
        onReady={() => setAceLoaded(true)}
      />
      {aceLoaded && (
        <Script
          src={ACE_EXT_SRC}
          strategy="afterInteractive"
          id="ace-ext"
          onReady={() => {
            (window as any).__aceReady = true;
          }}
        />
      )}

      <SaveStartModal onStartGame={handleStartGame} />

      <div className={styles.mobileShell}>
        <div className={styles.topBar}>
          <div className={styles.statusList}>
            {resources.map((item) => (
              <div
                key={item.id}
                className={styles.statusItem}
                aria-label={item.id}
              >
                {item.icon}
                <span className={styles.statusValue}>
                  {formatCount(item.value)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.rightCluster}>
            <div className={styles.quickActions}>
              <button
                className={styles.iconButton}
                aria-label={t("header.techTree")}
                onClick={() => setShowUnlock(true)}
              >
                <GithubIcon className={styles.vectorIcon} />
              </button>
              <button
                className={styles.iconButton}
                aria-label={t("header.save")}
                onClick={handleSave}
              >
                <SaveIcon className={styles.vectorIcon} />
              </button>
              <button
                className={styles.iconButton}
                aria-label={t("mobile.toggleEditor")}
                onClick={() => setShowEditor((v) => !v)}
              >
                <TerminalIcon className={styles.vectorIcon} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.mainArea}>
          <div className={styles.gameBoard}>
            <div className={styles.gameSurface}>
              <div className={styles.mapFrame}>
                <div id="game">
                  <canvas id="map" width={400} height={400} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionBar}>
          <button
            className={styles.toolBtn}
            aria-label={t("header.reset")}
            onClick={handleReset}
          >
            <WrenchIcon className={styles.vectorIcon} />
          </button>
          <button
            className={`${styles.toolBtn} ${styles.toolSecondary}`}
            aria-label={t("header.techTree")}
            onClick={() => setShowUnlock(true)}
          >
            <SeedsIcon className={styles.vectorIcon} />
          </button>
          <button
            className={`${styles.toolBtn} ${styles.toolTertiary}`}
            aria-label={t("mobile.toggleEditor")}
            onClick={() => setShowEditor((v) => !v)}
          >
            <ShovelIcon className={styles.vectorIcon} />
          </button>

          <button
            className={`${styles.runBtn} ${
              isRunning ? styles.runBtnRunning : ""
            }`}
            onClick={isRunning ? handleAbort : handleRun}
          >
            {isRunning ? t("header.abort") : t("header.run")}
          </button>
        </div>
      </div>

      <div
        className={`${styles.editorDrawer} ${
          showEditor ? styles.editorDrawerOpen : ""
        }`}
      >
        <div className={styles.editorHeader}>
          <span>{t("mobile.editorTitle")}</span>
          <button
            className={styles.iconButton}
            aria-label={t("mobile.toggleEditor")}
            onClick={() => setShowEditor(false)}
          >
            <TerminalIcon className={styles.vectorIcon} />
          </button>
        </div>
        <div className={styles.editorHost}>
          <div id="editor" />
        </div>
      </div>

      <MobileUnlockTree
        appRef={appRef}
        open={showUnlock}
        onClose={() => setShowUnlock(false)}
      />

      {!isLandscape && (
        <div className={styles.rotateMask}>
          <div className={styles.rotateCard}>
            <div>{t("mobile.landscapeTitle")}</div>
            <div className={styles.rotateHint}>
              {t("mobile.landscapeHint")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
