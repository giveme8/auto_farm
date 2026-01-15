// mobile-unlock-pixi.js
// 移动端专用的科技树渲染

import * as PIXI from "pixi.js";
import { buildTree } from "./tech-layout.js";

const inventoryNameKeyMap = {
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

let mobileTechApp = null;

/**
 * 移动端专用布局：垂直方向，更小的卡片尺寸
 */
function mobileLayoutTree(roots, cardW, cardH, levelGap = 50, siblingGap = 8) {
  function dfs(node, depth) {
    node.depth = depth;

    if (node.children.length === 0) {
      node.width = cardW;
      return cardW;
    }

    let total = 0;
    node.children.forEach((c) => {
      total += dfs(c, depth + 1) + siblingGap;
    });
    total -= siblingGap;

    node.width = Math.max(cardW, total);
    return node.width;
  }

  roots.forEach((r) => dfs(r, 0));

  let maxX = 0;
  let maxDepth = 0;

  function place(node, left) {
    const x = left + node.width / 2;
    maxX = Math.max(maxX, x + cardW / 2);
    maxDepth = Math.max(maxDepth, node.depth);

    node.x = x;
    node.y = node.depth * (cardH + levelGap) + cardH / 2 + 10;

    let offset = left;
    node.children.forEach((c) => {
      place(c, offset);
      offset += c.width + siblingGap;
    });
  }

  place(roots[0], 12);

  return {
    width: maxX + 12,
    height: (maxDepth + 1) * (cardH + levelGap) + cardH + 20,
  };
}

export function renderMobileUnlockPixi(
  app,
  TECH_TREE,
  graphEl,
  t = (key) => key
) {
  const unlockMgr = app.unlockManager;

  const tr = (key, fallback = "") =>
    t ? t(key, undefined) ?? fallback : fallback;

  const getName = (node) =>
    tr(`unlock.${node.key}.name`, node.name || node.key);
  const getDesc = (node) =>
    node.desc ? tr(`unlock.${node.key}.desc`, node.desc) : "";
  const getAbilityName = (ability) => {
    const key =
      ability.nameKey ||
      (typeof ability.name === "string" && ability.name.startsWith("unlock.")
        ? ability.name
        : null);
    if (key) return tr(key, ability.name || key);
    return ability.name || "";
  };
  const getReqName = (item) =>
    tr(inventoryNameKeyMap[item] || item, item) || item;

  // 构建树结构
  const { roots, map } = buildTree(TECH_TREE);

  // 移动端卡片尺寸（稍大以容纳文字）
  const cardW = 64;
  const cardH = 52;

  // 移动端专用布局
  const { width: graphW, height: graphH } = mobileLayoutTree(
    roots,
    cardW,
    cardH,
    40,
    8
  );

  // 初始化 Pixi
  if (!mobileTechApp) {
    mobileTechApp = new PIXI.Application({
      width: graphW,
      height: graphH,
      backgroundColor: 0x1a1a1a,
      resolution: window.devicePixelRatio || 2,
      autoDensity: true,
    });

    mobileTechApp.stage.sortableChildren = true;

    mobileTechApp.graphLayer = new PIXI.Container();
    mobileTechApp.graphLayer.zIndex = 1;
    mobileTechApp.stage.addChild(mobileTechApp.graphLayer);

    mobileTechApp.uiLayer = new PIXI.Container();
    mobileTechApp.uiLayer.zIndex = 9999;
    mobileTechApp.stage.addChild(mobileTechApp.uiLayer);
  } else {
    mobileTechApp.renderer.resize(graphW, graphH);
  }

  // 每次都确保 canvas 被添加到当前的 graphEl 中
  graphEl.innerHTML = "";
  graphEl.appendChild(mobileTechApp.view);

  // 清空图层
  mobileTechApp.graphLayer.removeChildren();
  mobileTechApp.uiLayer.removeChildren();

  // === 详情面板（替代 tooltip，更适合触摸） ===
  const detailPanel = new PIXI.Container();
  detailPanel.visible = false;

  const detailBg = new PIXI.Graphics();
  detailPanel.addChild(detailBg);

  const detailText = new PIXI.Text("", {
    fontSize: 11,
    fill: "#fff",
    wordWrap: true,
    wordWrapWidth: Math.min(graphW - 30, 220),
    breakWords: true,
    lineHeight: 15,
  });
  detailPanel.addChild(detailText);

  // 关闭按钮
  const closeBtn = new PIXI.Container();
  const closeBg = new PIXI.Graphics();
  closeBg.beginFill(0x444444);
  closeBg.drawRoundedRect(0, 0, 22, 22, 4);
  closeBg.endFill();
  closeBtn.addChild(closeBg);

  const closeX = new PIXI.Text("✕", {
    fontSize: 12,
    fill: "#fff",
  });
  closeX.x = 6;
  closeX.y = 2;
  closeBtn.addChild(closeX);

  closeBtn.interactive = true;
  closeBtn.buttonMode = true;
  closeBtn.on("pointertap", () => {
    detailPanel.visible = false;
  });
  detailPanel.addChild(closeBtn);

  mobileTechApp.uiLayer.addChild(detailPanel);

  let selectedNode = null;

  function showDetail(node) {
    selectedNode = node;

    const featureLabel = tr("unlock.tooltip.feature");
    const currentLevelLabel = tr("unlock.tooltip.currentLevel");
    const lockedLabel = tr("unlock.tooltip.locked");
    const currentEffectLabel = tr("unlock.tooltip.currentEffect");
    const upgradeNeedsLabel = tr("unlock.tooltip.upgradeNeeds");
    const nextEffectLabel = tr("unlock.tooltip.nextEffect");
    const maxLevelLabel = tr("unlock.tooltip.maxLevel");

    const curLv = unlockMgr.isUnlocked(node.key)
      ? unlockMgr.getLevel(node.key)
      : -1;

    const curLevelObj = node.levels[curLv] || null;
    const nextLevelObj = node.levels[curLv + 1] || null;

    const curAbility = curLevelObj?.ability || null;
    const nextAbility = nextLevelObj?.ability || null;
    const requires = nextLevelObj?.requires || null;

    let lines = [];

    // 节点名称（加粗效果用全角符号）
    lines.push(`【${getName(node)}】`);
    lines.push("");

    const nodeDesc = getDesc(node);
    if (nodeDesc) {
      lines.push(nodeDesc);
      lines.push("");
    }

    lines.push(
      `${currentLevelLabel}${curLv >= 0 ? curLv + 1 : lockedLabel}`
    );

    if (curAbility && curAbility.length > 0) {
      lines.push("");
      lines.push(currentEffectLabel);
      curAbility.forEach((a) => {
        lines.push(`  • ${getAbilityName(a)}：${a.value}`);
      });
    }

    if (requires) {
      lines.push("");
      lines.push(upgradeNeedsLabel);
      Object.entries(requires).forEach(([item, qty]) => {
        lines.push(`  • ${getReqName(item)}: ${qty}`);
      });
    }

    if (nextAbility && nextAbility.length > 0) {
      lines.push("");
      lines.push(nextEffectLabel);
      nextAbility.forEach((a) => {
        lines.push(
          `  • ${getAbilityName(a)}：${(a.value * 100).toFixed(0) + "%"}`
        );
      });
    }

    if (!nextLevelObj) {
      lines.push("");
      lines.push(maxLevelLabel);
    }

    detailText.text = lines.join("\n");
    detailText.x = 10;
    detailText.y = 10;

    const pad = 10;
    const panelW = detailText.width + pad * 2;
    const panelH = detailText.height + pad * 2;

    detailBg.clear();
    detailBg.beginFill(0x000000, 0.95);
    detailBg.lineStyle(1.5, 0xe8d49f);
    detailBg.drawRoundedRect(0, 0, panelW, panelH, 8);
    detailBg.endFill();

    // 关闭按钮位置
    closeBtn.x = panelW - 28;
    closeBtn.y = 6;

    // 居中显示面板
    detailPanel.x = Math.max(8, (graphW - panelW) / 2);
    detailPanel.y = Math.min(node.y + cardH / 2 + 8, graphH - panelH - 16);

    detailPanel.visible = true;
  }

  function handleNodeClick(node) {
    const key = node.key;

    // 如果面板已打开且是同一个节点，尝试解锁/升级
    if (detailPanel.visible && selectedNode === node) {
      if (!unlockMgr.isUnlocked(key)) {
        if (unlockMgr.unlock(key)) {
          renderMobileUnlockPixi(app, TECH_TREE, graphEl, t);
          return;
        }
      }

      if (unlockMgr.canUpgrade(key)) {
        if (unlockMgr.upgrade(key)) {
          renderMobileUnlockPixi(app, TECH_TREE, graphEl, t);
          return;
        }
      }

      console.log(`❌ 无法升级 ${getName(node)}`);
      return;
    }

    // 否则显示详情
    showDetail(node);
  }

  // 画线条
  const g = new PIXI.Graphics();
  g.lineStyle(1.5, 0xe8d49f, 0.5);
  mobileTechApp.graphLayer.addChild(g);

  Object.values(map).forEach((node) => {
    (node.deps || []).forEach((parentKey) => {
      const parent = map[parentKey];
      if (!parent) return;

      g.moveTo(parent.x, parent.y + cardH / 2);
      g.lineTo(node.x, node.y - cardH / 2);
    });
  });

  // === 画节点 ===
  Object.values(map).forEach((node) => {
    const unlocked = unlockMgr.isUnlocked(node.key);
    const canUpgradeNow = unlockMgr.canUpgrade(node.key);
    const canUnlockNow = !unlocked && unlockMgr.canUnlock(node.key);

    // 卡片容器
    const cardContainer = new PIXI.Container();
    cardContainer.x = node.x;
    cardContainer.y = node.y;

    // 卡片背景
    const card = new PIXI.Graphics();

    // 根据状态选择边框颜色
    let borderColor = 0x555555; // 未解锁
    if (unlocked) {
      borderColor = 0xe8d49f; // 已解锁
    }
    if (canUpgradeNow || canUnlockNow) {
      borderColor = 0x4caf50; // 可操作（绿色高亮）
    }

    card.lineStyle(2, borderColor);
    card.beginFill(unlocked ? 0x2a2a2a : 0x1a1a1a);
    card.drawRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 6);
    card.endFill();

    cardContainer.addChild(card);

    // 图标
    if (node.icon) {
      const sprite = PIXI.Sprite.from(node.icon);
      sprite.width = 20;
      sprite.height = 20;
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = -10;
      if (!unlocked) {
        sprite.alpha = 0.5;
      }
      cardContainer.addChild(sprite);
    }

    // 名字（底部显示）
    const displayName = getName(node);
    const tName = new PIXI.Text(displayName, {
      fill: unlocked ? "#fff" : "#777",
      fontSize: 9,
      fontWeight: unlocked ? "600" : "400",
    });
    tName.anchor.set(0.5, 0);
    tName.x = 0;
    tName.y = node.icon ? 2 : -8;

    // 如果文字太长，缩小
    if (tName.width > cardW - 6) {
      tName.scale.set((cardW - 6) / tName.width);
    }

    cardContainer.addChild(tName);

    // 等级显示（名字下方）
    const realLv = unlockMgr.getLevel(node.key);
    const maxLv = unlockMgr.getMaxLevel(node) + 1;
    const uiLv = unlocked ? realLv + 1 : 0;

    if (maxLv > 1) {
      const lvText = new PIXI.Text(`${uiLv}/${maxLv}`, {
        fill: unlocked ? "#e8d49f" : "#555",
        fontSize: 8,
      });
      lvText.anchor.set(0.5, 1);
      lvText.x = 0;
      lvText.y = cardH / 2 - 3;
      cardContainer.addChild(lvText);
    }

    // 可操作标记（右上角小圆点）
    if (canUpgradeNow || canUnlockNow) {
      const badge = new PIXI.Graphics();
      badge.beginFill(0x4caf50);
      badge.drawCircle(cardW / 2 - 5, -cardH / 2 + 5, 4);
      badge.endFill();
      cardContainer.addChild(badge);
    }

    // 事件
    cardContainer.interactive = true;
    cardContainer.buttonMode = true;
    cardContainer.on("pointertap", () => handleNodeClick(node));

    mobileTechApp.graphLayer.addChild(cardContainer);
  });

  // 点击空白区域关闭详情面板
  mobileTechApp.stage.interactive = true;
  mobileTechApp.stage.on("pointertap", (ev) => {
    // 如果点击的是空白区域，关闭面板
    if (ev.target === mobileTechApp.stage) {
      detailPanel.visible = false;
    }
  });
}
