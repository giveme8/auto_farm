"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import styles from "./Console.module.css";
import { useI18n } from "../I18nProvider";

type LogItem = {
  time: string;
  source: "user" | "system";
  body: string;
};

type ConsoleContextType = {
  log: (args: any[], source?: "user" | "system") => void;
  system: (msg: string) => void;
};

const ConsoleContext = createContext<ConsoleContextType | null>(null);

export const useConsole = () => {
  const ctx = useContext(ConsoleContext);
  if (!ctx) throw new Error("useConsole must be inside ConsoleProvider");
  return ctx;
};

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 客户端挂载后添加欢迎消息，避免 SSR hydration 不匹配
  useEffect(() => {
    setMounted(true);
    setLogs([{
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 }).replace(",", "."),
      source: "system" as const,
      body: t("console.welcome"),
    }]);
  }, [t]);

  function getTimestamp() {
    const d = new Date();
    return (
      `${String(d.getHours()).padStart(2, "0")}:` +
      `${String(d.getMinutes()).padStart(2, "0")}:` +
      `${String(d.getSeconds()).padStart(2, "0")}.` +
      `${String(d.getMilliseconds()).padStart(3, "0")}`
    );
  }

  function formatValue(v: any) {
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (typeof v === "object") {
      try {
        return JSON.stringify(v, null, 2);
      } catch {
        return String(v);
      }
    }
    return String(v);
  }

  function log(args: any[], source: "user" | "system" = "user") {
    const body = args.map((a) => formatValue(a)).join(" ");
    setLogs((prev) => [
      ...prev,
      {
        time: getTimestamp(),
        source,
        body,
      },
    ]);
  }

  function system(msg: string) {
    log([msg], "system");
  }

  // 自动滚动到底部
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logs]);

  return (
    <ConsoleContext.Provider value={{ log, system }}>
      {children}

      {mounted && (
        <div className={`${styles.consolePanel} consolePanel ${collapsed ? "consoleCollapsed" : ""}`}>
          <button
            className={`${styles.toggleBtn} consoleToggle`}
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? t("console.expand") : t("console.collapse")}
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M7 9l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          {!collapsed && (
            <div className={`${styles.consoleBody} consoleBody`}>
              <div className={`${styles.output} output`} ref={ref}>
                {logs.map((log, i) => (
                  <div key={i} className={`${styles.logLine} logLine`}>
                    <span className={`${styles.logTime} logTime`}>[{log.time}]</span>
                    <span
                      className={`${styles.logFrom} logFrom`}
                      style={{
                        color: log.source === "user" ? "#4caf50" : "#03a9f4",
                      }}
                    >
                      {log.source === "user" ? t("console.user") : t("console.system")}
                    </span>
                    <pre className={`${styles.logBody} logBody`}>{log.body}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ConsoleContext.Provider>
  );
}
