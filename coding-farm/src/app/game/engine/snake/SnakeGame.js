// engine/snake/SnakeGame.js

import { Snake } from "./Snake.js";
import { SnakeBase } from "./SnakeBase.js";
import { SnakeManager } from "./SnakeManager.js";
import { SnakeController } from "./SnakeController.js";
import { makeSnakeTextures } from "./snakeTextures.js";
import { getCurrentLocale } from "@/i18n/commands";
import { translate } from "@/i18n/core";

const t = (key, params) => translate(getCurrentLocale(), key, params);

export class SnakeGame {
  constructor(app, { startX, startY }) {
    this.app = app;
    this.renderer = null;
    if (!app.snakeTextures) {
      app.snakeTextures = makeSnakeTextures(() => {
        console.log("🐍 Snake textures ready!");

        // ---------- Renderer ----------
        this.renderer = new SnakeManager(
          app,
          new SnakeBase({
            headTexture: app.snakeTextures.head,
            bodyTexture: app.snakeTextures.body,
            tailTexture: app.snakeTextures.tail,
            appleTexture: app.snakeTextures.apple,
          }),
          tileSize,
          worldSize
        );
      });
    }
    // ----------- 正确读取 GameState -----------
    const worldSize = app.gameState.world.size;
    const tileSize = app.gameState.world.tileSize;

    this.startX = startX ?? 0;
    this.startY = startY ?? 0;

    // ---------- Model ----------
    this.model = new Snake(worldSize, this.startX, this.startY);

    // ---------- Controller ----------
    this.controller = new SnakeController(this.model);
    this.spawnFood();
  }

  getFood() {
    return this.model.food;
  }

  spawnFood() {
    const need = 64;

    if (!(this.app.inventory.get("cactus")>= need)) {
      console.log(t("log.insufficientCactus", { need }));
      this.model.food = null;
      return false;
    }

    this.app.inventory.remove("cactus", need);
    this.model.food = this.model.randomFood();
    return true;
  }
  /** 🌀 死亡后重开 */
  restart() {
    const worldSize = this.app.gameState.world.size;
    const tileSize = this.app.gameState.world.tileSize;

    this.model = new Snake(worldSize, this.startX, this.startY);
    this.controller = new SnakeController(this.model);
    this.spawnFood();
    if (this.renderer.updateConfig) {
      this.renderer.updateConfig(tileSize, worldSize);
    }
  }

  /** 🏃 移动一步 */
  step(dir) {
    const alive = this.controller.step(dir);
    if (!alive) {
      console.warn(t("log.snakeDiedRestarting"));
      this.app.inventory.add("apple", this.model.len() - 1);
      this.restart();
    }
    // 🟩 这里处理吃到食物
    const head = this.model.head();
    if (
      this.model.food &&
      head.x === this.model.food.x &&
      head.y === this.model.food.y
    ) {
      // 🟩 吃到食物，蛇自动增长由 controller 管理

      // 🎯 再次生成食物（并扣费 64 cactus）
      this.spawnFood();
    }
  }

  /** 🎨 每帧渲染 */
  render() {
    const worldSize = this.app.gameState.world.size;
    const tileSize = this.app.gameState.world.tileSize;

    if (this.renderer == null) {
      return;
    }
    // 如果世界变化（setWorldSize） → 同步渲染器
    if (
      this.renderer.worldSize !== worldSize ||
      this.renderer.tileSize !== tileSize
    ) {
      if (this.renderer.updateConfig) {
        this.renderer.updateConfig(tileSize, worldSize);
      } else {
        this.renderer.worldSize = worldSize;
        this.renderer.tileSize = tileSize;
      }

      if (this.renderer.clear) this.renderer.clear();
    }

    this.renderer.draw(this.model);
  }
}
