// js/game/editor.js
import { getDefaultCode } from "../data/default_code.js";
import { getCropTypeAliases, getCurrentLocale } from "@/i18n/commands";
import { translate } from "@/i18n/core";

const NUM_ITEM_LABELS = [
  ["pumpkin", "inventory.pumpkin"],
  ["gold", "inventory.gold"],
  ["apple", "inventory.apple"],
  ["hay", "inventory.hay"],
  ["wood", "inventory.wood"],
  ["carrot", "inventory.carrot"],
  ["cactus", "inventory.cactus"],
  ["sunflower", "inventory.sunflower"],
  ["water", "inventory.water"],
  ["fertilizer", "inventory.fertilizer"],
];

function buildNumItemsDoc(t) {
  const lines = [
    "<b>numItems(itemType)</b><br/>",
    `${t("editor.completion.numItems.desc")}<br/><br/>`,
    `<b>${t("editor.completion.numItems.paramLabel", { name: "itemType" })}</b><br/>`,
    `${t("editor.completion.numItems.options")}<br/>`,
    "<code>",
  ];

  for (const [item, labelKey] of NUM_ITEM_LABELS) {
    lines.push(`  "${item}"   ${t(labelKey)}<br/>`);
  }

  lines.push("</code><br/>");
  lines.push(
    `<b>${t("editor.completion.numItems.returnLabel")}</b> ${t(
      "editor.completion.numItems.returnValue"
    )}`
  );

  return lines.join("\n");
}

export async function setupEditor(app, saveData = null) {
  const editor = ace.edit("editor");

  // 设置初始化代码（支持从存档恢复）
  const locale = getCurrentLocale();
  const cropAliases = getCropTypeAliases(locale);
  const initialCode =
    saveData?.editor?.code ||
    getDefaultCode({
      potato: cropAliases.potato?.[0],
      pumpkin: cropAliases.pumpkin?.[0],
    });
  editor.setValue(initialCode, -1);

  // 使用本地 ACE 资源
  ace.config.set("basePath", "/ace");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
  });

  // 自定义 API 提示（先不动）
  setupCustomCompletions();

  // 将 editor 挂到 app 上（方便 save/restore 使用）
  app.editor = editor;

  // 延迟调用 resize 确保编辑器在移动端抽屉等场景下正确渲染
  setTimeout(() => {
    try {
      editor.resize();
    } catch (e) {
      // 忽略 resize 错误，编辑器打开时会再次 resize
    }
  }, 100);
}

// -------------------------
// 自定义 Ace 自动补全
// -------------------------
function setupCustomCompletions() {
  const customCompleter = {
    getCompletions(editor, session, pos, prefix, callback) {
      const locale = getCurrentLocale();
      const cropAliases = getCropTypeAliases(locale);
      const potato = cropAliases.potato?.[0] || "potato";
      const t = (key, params) => translate(locale, key, params);
      const metaGameApi = t("editor.completion.metaGameApi");
      const numItemsDoc = buildNumItemsDoc(t);

      const list = [
        { caption: "till", value: "till()", meta: metaGameApi },
        { caption: "useWater", value: "useWater()", meta: metaGameApi },
        { caption: "getWater", value: "getWater()", meta: metaGameApi },
        { caption: "getWorldSize", value: "getWorldSize()", meta: metaGameApi },
        {
          caption: "useFertilizer",
          value: "useFertilizer()",
          meta: metaGameApi,
        },
        {
          caption: "getGroundType",
          value: "getGroundType()",
          meta: metaGameApi,
        },
        { caption: "getCropType", value: "getCropType()", meta: metaGameApi },
        { caption: "canHarvest", value: "canHarvest()", meta: metaGameApi },
        { caption: "canMove", value: "canMove()", meta: metaGameApi },
        { caption: "clear", value: "clear()", meta: metaGameApi },
        { caption: "random", value: "random()", meta: metaGameApi },
        { caption: "max", value: "max()", meta: metaGameApi },
        { caption: "min", value: "min()", meta: metaGameApi },
        { caption: "abs", value: "abs()", meta: metaGameApi },
        {
          caption: "getMaxEntityCount",
          value: "getMaxEntityCount()",
          meta: metaGameApi,
        },
        {
          caption: "getEntityCount",
          value: "getEntityCount()",
          meta: metaGameApi,
        },
        {
          caption: "numItems",
          value: "numItems(itemType)",
          meta: metaGameApi,
          docHTML: numItemsDoc,
        },

        { caption: "measure", value: "measure()", meta: metaGameApi },

        {
          caption: "console.log(msg)",
          value: "console.log('hello world')",
          meta: metaGameApi,
          docHTML: `<b>console.log(msg)</b><br/>${t(
            "editor.completion.consoleLog"
          )}`,
        },
        {
          caption: "move(dir)",
          value: "move('up')",
          meta: metaGameApi,
          docHTML:
            `<b>move(dir)</b><br/>${t("editor.completion.move")}`,
        },

        {
          caption: "setWorldSize(size)",
          value: "setWorldSize(10)",
          meta: metaGameApi,
          docHTML: `<b>setWorldSize(size)</b><br/>${t(
            "editor.completion.setWorldSize"
          )}`,
        },

        {
          caption: "createMaze(n)",
          value: "createMaze(3)",
          meta: metaGameApi,
          docHTML: `<b>createMaze(n)</b><br/>${t(
            "editor.completion.createMaze"
          )}`,
        },

        {
          caption: "plant(type)",
          value: `plant('${potato}')`,
          meta: metaGameApi,
          docHTML:
            `<b>plant(type)</b><br/>${t("editor.completion.plant")}`,
        },

        {
          caption: "harvest()",
          value: "harvest()",
          meta: metaGameApi,
          docHTML: `<b>harvest()</b><br/>${t(
            "editor.completion.harvest"
          )}`,
        },

        {
          caption: "changeCharacter(type)",
          value: "changeCharacter('dino')",
          meta: metaGameApi,
          docHTML: `<b>changeCharacter(type)</b><br/>${t(
            "editor.completion.changeCharacter"
          )}`,
        },

        {
          caption: "spawn(async ({ move, plant, harvest, id }) => {})",
          meta: "snippet",
          value: `spawn(async ({ move, plant, harvest, id }) => {
  await move(0, 1)
  await plant('${potato}')
  await harvest()
})`,
          docHTML: `<b>spawn(callback)</b><br/>${t(
            "editor.completion.spawn"
          )}`,
        },
      ];

      callback(null, list);
    },
  };

  ace.require("ace/ext/language_tools").addCompleter(customCompleter);
}
