// engine/crops/CropManager.js
import { cropsLayer } from "../layers.js";

import { PotatoCrop } from "./PotatoCrop.js";
import { PumpkinCrop } from "./PumpkinCrop.js";
import { HayCrop } from "./HayCrop.js";
import { BushCrop } from "./BushCrop.js";
import { CarrotCrop } from "./CarrotCrop.js";
import { TreeCrop } from "./TreeCrop.js";
import { CactusCrop } from "./CactusCrop.js";
import { SunFlowerCrop } from "./SunFlowerCrop.js";
import { Crop } from "./Crop.js";
import CONSTANTS from "../core/constants.js";
import {
  buildCropTypeLookup,
  getCurrentLocale,
  getLocalizedCropType,
} from "@/i18n/commands";
import { translate } from "@/i18n/core";

let cachedLocale = null;
let cachedLookup = new Map();

const t = (key, params) => translate(getCurrentLocale(), key, params);

function getCropTypeLookup() {
  const locale = getCurrentLocale();
  if (locale !== cachedLocale) {
    cachedLocale = locale;
    cachedLookup = buildCropTypeLookup(locale, { includeAll: true });
  }
  return cachedLookup;
}

export function resolveCropType(type) {
  const raw = String(type ?? "").trim();
  if (!raw) return "";
  const key = raw.toLowerCase();
  const resolved = getCropTypeLookup().get(key);
  if (resolved) return resolved;
  if (key.endsWith("s")) {
    const singular = key.slice(0, -1);
    return getCropTypeLookup().get(singular) || raw;
  }
  return raw;
}

export function localizeCropType(type) {
  const locale = getCurrentLocale();
  return getLocalizedCropType(type, locale);
}

export const CROP_TYPES = {
  potato: {
    time: 3000,
    item: "potato",
    unlock: CONSTANTS.UNLOCKS.Potato,
    renderer: new PotatoCrop(),
  },

  peanut: {
    time: 5000,
    item: "peanut",
    unlock: CONSTANTS.UNLOCKS.Peanut,
    renderer: null, // 还没做 PeanutCrop，可以先留空
  },

  pumpkin: {
    time: 7000,
    item: "pumpkin",
    unlock: CONSTANTS.UNLOCKS.Pumpkins,
    renderer: new PumpkinCrop(),
  },

  grass: {
    time: 0,
    item: "hay",
    unlock: CONSTANTS.UNLOCKS.Grass,
    renderer: new HayCrop(),
  },
  bush: {
    time: 0,
    item: "wood",
    unlock: CONSTANTS.UNLOCKS.Trees,
    renderer: new BushCrop(),
  },
  carrot: {
    time: 0,
    item: "carrot",
    unlock: CONSTANTS.UNLOCKS.Carrots,
    renderer: new CarrotCrop(),
    cost: { hay: 512, wood: 512 },
  },
  tree: {
    time: 0,
    item: "wood",
    unlock: CONSTANTS.UNLOCKS.Trees,
    renderer: new TreeCrop(),
  },
  cactus: {
    time: 0,
    item: "cactus",
    unlock: CONSTANTS.UNLOCKS.Cactus,
    renderer: new CactusCrop(),
    cost: { pumpkin: 64 },
  },
  sunflower: {
    time: 0,
    item: "sunflower",
    unlock: CONSTANTS.UNLOCKS.Sunflowers,
    renderer: new SunFlowerCrop(),
    cost: { carrot: 1 },
  },
};

export class CropManager {
  constructor() {
    // key: "x_y" → { sprite, frameIdx }
    this.cropSprites = new Map();
    this.crops = {};
  }

  applyMergeArea({ x, y, n }) {
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        const crop = this.get(x + ix, y + iy);
        if (crop) {
          crop.mergeArea = { x, y, n }; // 左上角 + 边长
        }
      }
    }
  }
  key(x, y) {
    return `${x}_${y}`;
  }

  get(x, y) {
    return this.crops[this.key(x, y)];
  }

  exist(x, y) {
    return !!this.get(x, y);
  }

  set(crop) {
    this.crops[crop.key] = crop;
  }

  delete(x, y) {
    delete this.crops[this.key(x, y)];
  }

  all() {
    return this.crops;
  }

  export() {
    return Object.values(this.crops).map((c) => ({
      type: c.type,
      x: c.x,
      y: c.y,
      plantedAt: c.plantedAt,
      matureTime: c.matureTime,
      yieldMultiplier: c.yieldMultiplier ?? 1,
      mergeArea: c.mergeArea || null,
    }));
  }

  import(cropList) {
    this.reset();
    cropList.forEach((c) => {
      const resolvedType = resolveCropType(c.type);
      const crop = new Crop({
        type: resolvedType,
        plantedAt: c.plantedAt,
        matureTime: c.matureTime,
        key: `${c.x}_${c.y}`,
      });

      crop.x = c.x;
      crop.y = c.y;
      crop.yieldMultiplier = c.yieldMultiplier ?? 1;
      crop.mergeArea = c.mergeArea ?? null;

      this.set(crop);
    });
  }

  reset() {
    this.crops = {};
  }

  applyFertilizer(x, y, ms = 2000) {
    const crop = this.get(x, y);
    if (!crop) return false;

    crop.applyFertilizer(ms);
    return true;
  }

  /**
   * 种杂草
   * @param {number} x 坐标
   * @param {number} y 坐标
   */
  plantWeed(x, y, mul) {
    const key = this.key(x, y);
    if (this.exist(x, y)) {
      console.warn(t("log.weedPlantBlocked", { key }));
      return;
    }

    const weedCrop = new Crop({
      type: "grass",
      key: `${x}_${y}`,
      plantedAt: Date.now(),
      matureTime: 0,
    });
    weedCrop.setYieldMultiplier(mul);

    this.set(weedCrop);
    //CropEventBus.emit("cropPlanted", weedCrop);
  }

  updateCrops() {
    for (const key in this.crops) {
      const crop = this.crops[key];
      if (crop && typeof crop.checkMature === "function") {
        crop.checkMature();
      }
    }
  }

  updateConfig(mapSize, tileSize) {
    this.mapSize = mapSize;
    this.tileSize = tileSize;
  }
  draw({ mapSize, tileSize }) {
    const now = Date.now();
    const seen = new Set();

    for (let screenY = 0; screenY < mapSize; screenY++) {
      for (let x = 0; x < mapSize; x++) {
        const ly = mapSize - 1 - screenY; // 世界坐标转 screen 坐标
        const key = `${x}_${ly}`;
        const crop = this.crops[key];
        if (!crop) continue;

        seen.add(key);

        const resolvedType = resolveCropType(crop.type);
        const cropConfig = CROP_TYPES[resolvedType];
        const renderer = cropConfig?.renderer;
        if (!renderer) {
          console.warn(t("log.unknownCropType", { type: crop.type }));
          continue;
        }

        renderer.render({
          crop,
          key,
          x,
          screenY,
          tileSize,
          now,
          store: this.cropSprites,
        });
      }
    }

    // 清理消失的作物
    for (const [key, entry] of this.cropSprites.entries()) {
      if (!seen.has(key)) {
        cropsLayer.removeChild(entry.sprite);
        this.cropSprites.delete(key);
      }
    }
  }
}
