// js/data/tech-tree.js

export const TECH_TREE = [
  /* -------------------------------------------------------
   * Auto Unlock
   * -----------------------------------------------------*/
  /*{
    key: "auto_unlock",
    name: "autoUnlock()",
    tier: 8,
    deps: ["costs"],
    desc: "让科技树进入自动化时代。当资源满足条件时自动解锁科技，无需手动操作。",
    levels: [{ level: 0, requires: { pumpkin: 5000 } }],
  },*/

  /* -------------------------------------------------------
   * Cactus
   * -----------------------------------------------------*/
  {
    key: "cactus",
    name: "unlock.cactus.name",
    tier: 6,
    deps: ["pumpkins"],
    desc: "unlock.cactus.desc",
    levels: [
      {
        level: 0,
        requires: { pumpkin: 5000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { pumpkin: 20000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { pumpkin: 120000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { pumpkin: 720000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { pumpkin: 4320000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { pumpkin: 25900000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 32 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Carrots
   * -----------------------------------------------------*/
  {
    key: "carrots",
    name: "unlock.carrots.name",
    tier: 3,
    deps: ["grass"],
    desc: "unlock.carrots.desc",

    levels: [
      {
        level: 0,
        requires: { wood: 50 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { wood: 250 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { wood: 1250 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { wood: 6250 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { wood: 31200 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { wood: 156000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 32 }],
      },
      {
        level: 6,
        requires: { wood: 781000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 64 }],
      },
      {
        level: 7,
        requires: { wood: 3910000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 128 }],
      },
      {
        level: 8,
        requires: { wood: 19500000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 256 }],
      },
      {
        level: 9,
        requires: { wood: 97700000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 512 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Costs
   * -----------------------------------------------------*/
  /*{
    key: "costs",
    name: "getCost()",
    desc: "解锁 getCost() 函数，使你能够在代码中动态查询作物种植的资源花费，为自动化种植与资源规划提供必要支持。",

    tier: 7,
    deps: ["dictionaries"],
    levels: [{ level: 0, requires: { pumpkin: 2500 } }],
  },*/

  /* -------------------------------------------------------
   * Debug
   * -----------------------------------------------------*/
  {
    key: "debug",
    name: "unlock.debug.name",
    desc: "unlock.debug.desc",
    tier: 3,
    deps: ["plant"],
    levels: [{ level: 0, requires: { hay: 50, wood: 50 } }],
  },

  /*{
    key: "debug_2",
    name: "setSpeed",
    desc: "解锁 setSpeed() 函数，用于设置游戏运行速度，方便调试与游戏体验调整。",
    tier: 4,
    deps: ["debug"],
    levels: [{ level: 0, requires: { gold: 500 } }],
  },*/

  /* -------------------------------------------------------
   * Dictionaries
   * -----------------------------------------------------*/
  {
    key: "dictionaries",
    name: "unlock.dictionaries.name",
    desc: "unlock.dictionaries.desc",

    tier: 6,
    deps: ["lists"],
    levels: [{ level: 0, requires: { pumpkin: 2500 } }],
  },

  /* -------------------------------------------------------
   * Snake
   * -----------------------------------------------------*/
  {
    key: "snake",
    name: "unlock.snake.name",
    tier: 7,
    deps: ["cactus"],
    desc: "unlock.snake.desc",
    levels: [
      {
        level: 0,
        requires: { cactus: 2000 },
        ability: [{ name: "unlock.ability.appleYieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { cactus: 12000 },
        ability: [{ name: "unlock.ability.appleYieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { cactus: 72000 },
        ability: [{ name: "unlock.ability.appleYieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { cactus: 432000 },
        ability: [{ name: "unlock.ability.appleYieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { cactus: 2590000 },
        ability: [{ name: "unlock.ability.appleYieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { cactus: 15600000 },
        ability: [{ name: "unlock.ability.appleYieldMultiplier", value: 32 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Expand
   * -----------------------------------------------------*/
  {
    key: "expand",
    name: "unlock.expand.name",
    desc: "unlock.expand.desc",
    tier: 2,
    deps: ["speed"],

    levels: [
      {
        level: 0,
        requires: { hay: 30 },
        ability: [
          { name: "unlock.ability.worldSize", value: 4 }, // 4x4
        ],
      },
      {
        level: 1,
        requires: { wood: 20 },
        ability: [
          { name: "unlock.ability.worldSize", value: 6 }, // 6x6
        ],
      },
      {
        level: 2,
        requires: { wood: 30, carrot: 20 },
        ability: [
          { name: "unlock.ability.worldSize", value: 8 }, // 8x8
        ],
      },
      {
        level: 3,
        requires: { wood: 100, carrot: 50 },
        ability: [
          { name: "unlock.ability.worldSize", value: 12 }, // 12x12
        ],
      },
      {
        level: 4,
        requires: { pumpkin: 1000 },
        ability: [
          { name: "unlock.ability.worldSize", value: 16 }, // 16x16
        ],
      },
      {
        level: 5,
        requires: { pumpkin: 8000 },
        ability: [
          { name: "unlock.ability.worldSize", value: 20 }, // 20x20
        ],
      },
      {
        level: 6,
        requires: { pumpkin: 64000 },
        ability: [
          { name: "unlock.ability.worldSize", value: 24 }, // 24x24
        ],
      },
      {
        level: 7,
        requires: { pumpkin: 512000 },
        ability: [
          { name: "unlock.ability.worldSize", value: 28 }, // 28x28
        ],
      },
      {
        level: 8,
        requires: { pumpkin: 4100000 },
        ability: [
          { name: "unlock.ability.worldSize", value: 32 }, // 32x32 最终
        ],
      },
    ],
  },

  /* -------------------------------------------------------
   * Fertilizer
   * -----------------------------------------------------*/
  {
    key: "fertilizer",
    name: "unlock.fertilizer.name",
    tier: 5,
    desc: "unlock.fertilizer.desc",
    deps: ["watering"],

    levels: [
      {
        level: 0,
        requires: { wood: 500 },
        ability: [
          { name: "unlock.ability.growthBonus", value: 0.2 }, // +20%
        ],
      },
      {
        level: 1,
        requires: { wood: 1500 },
        ability: [
          { name: "unlock.ability.growthBonus", value: 0.5 }, // +50%
        ],
      },
      {
        level: 2,
        requires: { wood: 9000 },
        ability: [
          { name: "unlock.ability.growthBonus", value: 1.2 }, // +120%
        ],
      },
      {
        level: 3,
        requires: { wood: 54000 },
        ability: [
          { name: "unlock.ability.growthBonus", value: 2.5 }, // +250%
        ],
      },
    ],
  },

  /* -------------------------------------------------------
   * Functions
   * -----------------------------------------------------*/
  {
    key: "functions",
    name: "unlock.functions.name",
    desc: "unlock.functions.desc",
    tier: 5,
    deps: ["variables"],
    levels: [{ level: 0, requires: { carrot: 40 } }],
  },

  /* -------------------------------------------------------
   * Grass
   * -----------------------------------------------------*/
  {
    key: "grass",
    name: "unlock.grass.name",
    desc: "unlock.grass.desc",
    tier: 1,
    deps: ["loops"],

    levels: [
      {
        level: 0,
        requires: { hay: 100 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { hay: 300 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { wood: 500 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { wood: 2500 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { wood: 12500 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { wood: 62500 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 32 }],
      },
      {
        level: 6,
        requires: { wood: 312000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 64 }],
      },
      {
        level: 7,
        requires: { wood: 1560000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 128 }],
      },
      {
        level: 8,
        requires: { wood: 7810000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 256 }],
      },
      {
        level: 9,
        requires: { wood: 39100000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 512 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Dino
   * -----------------------------------------------------*/
  {
    key: "dino",
    name: "unlock.dino.name",
    desc: "unlock.dino.desc",
    tier: 1,
    deps: ["loops"],
    levels: [{ level: 0, requires: { hay: 50 } }],
  },

  /* -------------------------------------------------------
   * Import
   * -----------------------------------------------------*/
  /*{
    key: "import",
    name: "导入",
    desc: "解锁导入功能，使你能够从外部文件导入数据，为游戏添加更多的交互性和灵活性。",
    tier: 6,
    deps: ["functions"],
    levels: [{ level: 0, requires: { carrot: 80 } }],
  },*/

  /* -------------------------------------------------------
   * Leaderboard
   * -----------------------------------------------------*/
  /*{
    key: "leaderboard",
    name: "排行榜",
    tier: 6,
    deps: ["simulation"],
    levels: [
      { level: 0, requires: { apple: 2000000, gold: 1000000 } }
    ]
  },*/

  /* -------------------------------------------------------
   * Lists
   * -----------------------------------------------------*/
  {
    key: "lists",
    name: "unlock.lists.name",
    desc: "unlock.lists.desc",
    tier: 5,
    deps: ["variables"],
    levels: [{ level: 0, requires: { carrot: 500 } }],
  },

  /* -------------------------------------------------------
   * Loops
   * -----------------------------------------------------*/
  {
    key: "loops",
    name: "unlock.loops.name",
    desc: "unlock.loops.desc",
    tier: 0,
    deps: [],
    levels: [{ level: 0, requires: { hay: 5 } }],
  },

  /* -------------------------------------------------------
   * Mazes
   * -----------------------------------------------------*/
  {
    key: "mazes",
    name: "unlock.mazes.name",
    tier: 6,
    deps: ["fertilizer"],
    desc: "unlock.mazes.desc",
    levels: [
      {
        level: 0,
        requires: { cactus: 300 },
        ability: [{ name: "unlock.ability.goldYieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { cactus: 12000 },
        ability: [{ name: "unlock.ability.goldYieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { cactus: 72000 },
        ability: [{ name: "unlock.ability.goldYieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { cactus: 432000 },
        ability: [{ name: "unlock.ability.goldYieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { cactus: 2590000 },
        ability: [{ name: "unlock.ability.goldYieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { cactus: 15600000 },
        ability: [{ name: "unlock.ability.goldYieldMultiplier", value: 32 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Megafarm
   * -----------------------------------------------------*/
  {
    key: "megafarm",
    name: "unlock.megafarm.name",
    tier: 7,
    deps: ["mazes"],
    desc: "unlock.megafarm.desc",
    levels: [
      {
        level: 0,
        requires: { gold: 2000 },
        ability: [{ name: "unlock.ability.spawnConcurrency", value: 4 }],
      },
      {
        level: 1,
        requires: { gold: 8000 },
        ability: [{ name: "unlock.ability.spawnConcurrency", value: 8 }],
      },
      {
        level: 2,
        requires: { gold: 32000 },
        ability: [{ name: "unlock.ability.spawnConcurrency", value: 12 }],
      },
      {
        level: 3,
        requires: { gold: 128000 },
        ability: [{ name: "unlock.ability.spawnConcurrency", value: 20 }],
      },
      {
        level: 4,
        requires: { gold: 512000 },
        ability: [
          { name: "unlock.ability.spawnConcurrency", value: 32 }, // 上限
        ],
      },
    ],
  },

  /* -------------------------------------------------------
   * Operators
   * -----------------------------------------------------*/
  {
    key: "operators",
    name: "unlock.operators.name",
    desc: "unlock.operators.desc",
    tier: 3,
    deps: ["plant"],
    levels: [{ level: 0, requires: { hay: 150, wood: 10 } }],
  },

  /* -------------------------------------------------------
   * Plant
   * -----------------------------------------------------*/
  {
    key: "plant",
    name: "unlock.plant.name",
    desc: "unlock.plant.desc",
    tier: 2,
    deps: ["speed"],
    levels: [{ level: 0, requires: { hay: 50 } }],
  },

  /* -------------------------------------------------------
   * Polycul ture
   * -----------------------------------------------------*/
  /*{
    key: "polyculture",
    name: "多种栽培",
    tier: 6,
    deps: ["pumpkins"],
    desc: "提升多种作物同时栽培时的整体产量，作物种类越丰富，农场的总产能就越高。",
    levels: [
      {
        level: 0,
        requires: { pumpkin: 3000 },
        ability: [{ name: "产量倍率", value: 1 }],
      },
      {
        level: 1,
        requires: { apple: 10000 },
        ability: [{ name: "产量倍率", value: 2 }],
      },
      {
        level: 2,
        requires: { apple: 50000 },
        ability: [{ name: "产量倍率", value: 3 }],
      },
      {
        level: 3,
        requires: { apple: 250000 },
        ability: [{ name: "产量倍率", value: 4 }],
      },
      {
        level: 4,
        requires: { apple: 1250000 },
        ability: [{ name: "产量倍率", value: 5 }],
      },
    ],
  },*/

  /* -------------------------------------------------------
   * Pumpkins
   * -----------------------------------------------------*/
  {
    key: "pumpkins",
    name: "unlock.pumpkins.name",
    desc: "unlock.pumpkins.desc",
    tier: 5,
    deps: ["trees"],

    levels: [
      {
        level: 0,
        requires: { wood: 500, carrot: 200 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { carrot: 1000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { carrot: 4000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { carrot: 16000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { carrot: 64000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { carrot: 256000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 32 }],
      },
      {
        level: 6,
        requires: { carrot: 1020000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 64 }],
      },
      {
        level: 7,
        requires: { carrot: 4100000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 128 }],
      },
      {
        level: 8,
        requires: { carrot: 16400000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 256 }],
      },
      {
        level: 9,
        requires: { carrot: 65500000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 512 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Senses
   * -----------------------------------------------------*/
  {
    key: "senses",
    name: "unlock.senses.name",
    desc: "unlock.senses.desc",
    tier: 4,
    deps: ["debug"],
    levels: [{ level: 0, requires: { hay: 100 } }],
  },

  /* -------------------------------------------------------
   * Simulation
   * -----------------------------------------------------*/
  /*{
    key: "simulation",
    name: "模拟",
    tier: 5,
    deps: ["timing"],
    levels: [
      { level: 0, requires: { gold: 5000 } }
    ]
  },*/

  /* -------------------------------------------------------
   * Speed
   * -----------------------------------------------------*/
  {
    key: "speed",
    name: "unlock.speed.name",
    desc: "unlock.speed.desc",
    tier: 1,
    deps: ["loops"],

    levels: [
      {
        level: 0,
        requires: { hay: 20 },
        ability: [{ name: "unlock.ability.speedMultiplier", value: 1.0 }],
      },
      {
        level: 1,
        requires: { wood: 20 },
        ability: [{ name: "unlock.ability.speedMultiplier", value: 1.3 }],
      },
      {
        level: 2,
        requires: { wood: 50, carrot: 50 },
        ability: [{ name: "unlock.ability.speedMultiplier", value: 1.6 }],
      },
      {
        level: 3,
        requires: { carrot: 500 },
        ability: [{ name: "unlock.ability.speedMultiplier", value: 2.0 }],
      },
      {
        level: 4,
        requires: { carrot: 1000 },
        ability: [{ name: "unlock.ability.speedMultiplier", value: 2.5 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Sunflowers
   * -----------------------------------------------------*/
  {
    key: "sunflowers",
    name: "unlock.sunflowers.name",
    tier: 5,
    desc: "unlock.sunflowers.desc",
    deps: ["watering"],
    levels: [{ level: 0, requires: { carrot: 500 } }],
  },

  /* -------------------------------------------------------
   * The Farmer's Remains
   * -----------------------------------------------------*/
  {
    key: "remains",
    name: "unlock.remains.name",
    tier: 8,
    deps: ["snake"],
    desc: "unlock.remains.desc",
    levels: [{ level: 0, requires: { apple: 100000000 } }],
  },

  /* -------------------------------------------------------
   * Timing
   * -----------------------------------------------------*/
  /*{
    key: "timing",
    name: "getTime()",
    tier: 4,
    desc:"还没想好怎么实现",
    deps: ["debug"],
    levels: [{ level: 0, requires: { pumpkin: 1000 } }],
  }, */

  /* -------------------------------------------------------
   * Top Hat
   * -----------------------------------------------------*/
  /*{
    key: "top_hat",
    name: "高礼帽",
    desc: "解锁高礼帽皮肤",
    tier: 7,
    deps: ["mazes"],
    levels: [
      {
        level: 0,
        requires: {
          hay: 1000000000,
          wood: 10000000000,
          carrot: 1000000000,
          cactus: 1000000000,
          gold: 100000000,
        },
      },
    ],
  },*/

  /* -------------------------------------------------------
   * Trees
   * -----------------------------------------------------*/
  {
    key: "trees",
    name: "unlock.trees.name",
    tier: 4,
    deps: ["carrots"],
    desc: "unlock.trees.desc",
    levels: [
      {
        level: 0,
        requires: { wood: 50, carrot: 70 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 1 }],
      },
      {
        level: 1,
        requires: { hay: 300 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 2 }],
      },
      {
        level: 2,
        requires: { hay: 1200 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 4 }],
      },
      {
        level: 3,
        requires: { hay: 4800 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 8 }],
      },
      {
        level: 4,
        requires: { hay: 19200 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 16 }],
      },
      {
        level: 5,
        requires: { hay: 76800 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 32 }],
      },
      {
        level: 6,
        requires: { hay: 307000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 64 }],
      },
      {
        level: 7,
        requires: { hay: 1230000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 128 }],
      },
      {
        level: 8,
        requires: { hay: 4920000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 256 }],
      },
      {
        level: 9,
        requires: { hay: 19700000 },
        ability: [{ name: "unlock.ability.yieldMultiplier", value: 512 }],
      },
    ],
  },

  /* -------------------------------------------------------
   * Utilities
   * -----------------------------------------------------*/
  {
    key: "utilities",
    name: "unlock.utilities.name",
    desc: "unlock.utilities.desc",
    tier: 6,
    deps: ["functions"],
    levels: [{ level: 0, requires: { pumpkin: 1000 } }],
  },

  /* -------------------------------------------------------
   * Variables
   * -----------------------------------------------------*/
  {
    key: "variables",
    name: "unlock.variables.name",
    desc: "unlock.variables.desc",
    tier: 4,
    deps: ["operators"],
    levels: [{ level: 0, requires: { carrot: 35 } }],
  },

  /* -------------------------------------------------------
   * Watering
   * -----------------------------------------------------*/
  {
    key: "watering",
    name: "unlock.watering.name",
    desc: "unlock.watering.desc",
    tier: 4,
    deps: ["carrots"],

    levels: [
      {
        level: 0,
        requires: { wood: 50 },
        ability: [
          { name: "unlock.ability.waterPerSec", value: 1 }, // 1/sec
        ],
      },
      {
        level: 1,
        requires: { wood: 200 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 2 }],
      },
      {
        level: 2,
        requires: { wood: 800 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 4 }],
      },
      {
        level: 3,
        requires: { wood: 3200 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 7 }],
      },
      {
        level: 4,
        requires: { wood: 12800 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 10 }],
      },
      {
        level: 5,
        requires: { wood: 51200 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 14 }],
      },
      {
        level: 6,
        requires: { wood: 205000 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 19 }],
      },
      {
        level: 7,
        requires: { wood: 819000 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 25 }],
      },
      {
        level: 8,
        requires: { wood: 3280000 },
        ability: [{ name: "unlock.ability.waterPerSec", value: 32 }],
      },
    ],
  },
];
