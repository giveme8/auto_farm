export interface UiBridge {
  alert: (title: string, message: string) => Promise<void>;
  confirm: (title: string, message: string) => Promise<boolean>;

  setMsg: (msg: UiMessage) => void;
  updateInventory: (inv: any) => void;
  updateSlotLabel: (name: string) => void;

  setRunState: (running: boolean) => void;

  console: {
    log: (args: any[], source?: "user" | "system") => void;
    system: (msg: string) => void;
  };

  toggleUnlockTree: (show: boolean) => void;
}

export type UiMessage =
  | string
  | {
      key: import("@/i18n/core").TranslationKey;
      params?: Record<string, string | number>;
    };
