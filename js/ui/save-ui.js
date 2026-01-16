// js/ui/save-ui.js

import { getCurrentTimeString } from "../utils/time.js";

import { confirmModal } from "./confirm.js";
import { getTranslator } from "../i18n/language/index.js";

const SAVE_META_KEY = "farm_save_slots";
const SAVE_SLOT_PREFIX = "farm_save_slot_";
const t = (key, params) => getTranslator()(key, undefined, params);

export function loadSlotMetaList() {
  try {
    const raw = localStorage.getItem(SAVE_META_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveSlotMetaList(list) {
  localStorage.setItem(SAVE_META_KEY, JSON.stringify(list));
}

export function loadSlotData(slotId) {
  const raw = localStorage.getItem(SAVE_SLOT_PREFIX + slotId);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSlotData(slotId, data) {
  localStorage.setItem(SAVE_SLOT_PREFIX + slotId, JSON.stringify(data));
}

/**
 * 主菜单初始化（方案 A）
 */
export function initStartUI({ onStartGame, onCollectSave }) {
  const overlay = document.getElementById("start-overlay");
  const btnNew = document.getElementById("btn-new-game");
  const btnLoad = document.getElementById("btn-load-game");
  const saveWrap = document.getElementById("save-list-wrap");
  const slotListEl = document.getElementById("save-slot-list");
  const btnCreateEmpty = document.getElementById("btn-create-empty");

  if (!overlay) {
    console.warn(t("log.startOverlayMissing"));
    return;
  }

  // ------------------------------
  // 渲染卡片式存档（方案 A 核心）
  // ------------------------------
  function renderSlotList() {
    const metaList = loadSlotMetaList();
    slotListEl.innerHTML = "";

    if (!metaList.length) {
      const li = document.createElement("li");
      li.textContent = "暂无存档，请新建存档槽。";
      li.style.opacity = "0.6";
      li.style.fontSize = "14px";
      slotListEl.appendChild(li);
      return;
    }

    metaList.forEach((meta) => {
      const li = document.createElement("li");
      li.className = "save-card";

      // ===== 左侧文本区 =====
      const info = document.createElement("div");
      info.className = "save-card-info";

      // 大标题
      const title = document.createElement("div");
      title.className = "save-card-title";
      title.textContent = meta.name || `存档 ${meta.id}`;

      // 时间
      const time = document.createElement("div");
      time.className = "save-card-time";
      time.textContent = meta.savedAt
        ? "上次保存：" + new Date(meta.savedAt).toLocaleString()
        : "尚未保存";

      info.appendChild(title);
      info.appendChild(time);

      // ===== 右侧按钮组 =====
      const btns = document.createElement("div");
      btns.className = "save-card-buttons";

      // 加载按钮
      const btnLoadSlot = document.createElement("button");
      btnLoadSlot.className = "save-btn load";
      btnLoadSlot.innerHTML = "▶ 加载";
      btnLoadSlot.addEventListener("click", () => {
        const data = loadSlotData(meta.id);
        overlay.classList.add("hidden");
        onStartGame?.({
          saveData: data || null,
          slotId: meta.id,
          slotName: meta.name,
        });
      });

      // 删除按钮
      const btnDelete = document.createElement("button");
      btnDelete.className = "save-btn delete";
      btnDelete.textContent = "🗑 删除";
      btnDelete.addEventListener("click", async () => {
        console.log("BBBB")
        const ok = await confirmModal(
          "🗑 删除存档",
          `确定要删除 “${meta.name}” 吗？`
        );
        console.log("AAA")
        if (!ok) return;
        const idx = metaList.findIndex((m) => m.id === meta.id);
        if (idx >= 0) metaList.splice(idx, 1);
        localStorage.removeItem(SAVE_SLOT_PREFIX + meta.id);
        saveSlotMetaList(metaList);
        renderSlotList();
      });

      btns.appendChild(btnLoadSlot);

      btns.appendChild(btnDelete);

      li.appendChild(info);
      li.appendChild(btns);
      slotListEl.appendChild(li);
    });
  }

  // 新游戏
  btnNew.addEventListener("click", () => {
    const metaList = loadSlotMetaList();
    const newId = metaList.length
      ? Math.max(...metaList.map((m) => m.id)) + 1
      : 1;
    const name = "存档 " + getCurrentTimeString();

    const meta = { id: newId, name, savedAt: null };
    metaList.push(meta);
    saveSlotMetaList(metaList);

    overlay.classList.add("hidden");
    onStartGame?.({
      saveData: null,
      slotId: newId,
      slotName: name,
    });
  });

  // 加载存档列表
  btnLoad.addEventListener("click", () => {
    saveWrap.classList.remove("hidden");
    renderSlotList();
  });

  // 创建空存档槽
  btnCreateEmpty?.addEventListener("click", () => {
    const metaList = loadSlotMetaList();
    const id = metaList.length ? Math.max(...metaList.map((m) => m.id)) + 1 : 1;

    const name = prompt("请输入存档名称：", `存档 ${id}`) || `存档 ${id}`;
    const meta = { id, name, savedAt: null };
    metaList.push(meta);
    saveSlotMetaList(metaList);

    renderSlotList();
  });
}
