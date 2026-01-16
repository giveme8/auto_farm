// engine/map.js
import { drawCrops } from './crops.js';
import { getCurrentLocale } from "@/i18n/commands";
import { translate } from "@/i18n/core";
// 将来这里也可以 import updateEntities
import { updateDrones } from './drone.js';

const t = (key, params) => translate(getCurrentLocale(), key, params);
export function drawMapFrame({ app, mapSize, tileSize, crops, entities }) {

  console.log(t("log.drawMapFrame"), mapSize, tileSize);
  app.cropManager.draw({
    crops,
    mapSize,
    tileSize
  });

  app.characterManager.update(entities, mapSize, tileSize);
}
