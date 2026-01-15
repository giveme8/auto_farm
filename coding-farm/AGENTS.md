# AGENTS.md - AI 助手协作指南

本文档为 AI 代码助手（如 GitHub Copilot、Claude、ChatGPT 等）提供项目上下文和开发指南。

---

## 📋 项目概述

**编程农场（Coding Farm）** 是一个开源的学习型编程游戏，玩家通过编写 JavaScript 代码控制角色在 2D 世界中进行种植、收获、解锁科技等操作。项目旨在通过实践学习编程基础。

### 核心特色
- **代码驱动游戏**：左侧 Ace 编辑器编写 JS 脚本，调用 `move()`、`plant()`、`harvest()` 等 API 控制角色
- **科技树系统**：收集资源解锁新 API、新模式和新资源
- **多种游戏模式**：经典种田、南瓜合并、贪吃蛇、迷宫寻宝、多线程协作等
- **本地存档**：基于 localStorage 的存档管理
- **内置文档**：Markdown 格式的 API 教程与说明

---

## 🛠 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js (App Router) | 16.0.3 |
| **UI 库** | React | 19.2.0 |
| **语言** | TypeScript | ^5 |
| **样式** | Tailwind CSS | ^4 |
| **渲染引擎** | PIXI.js | ^7.4.3 |
| **代码编辑器** | Ace Editor | ^1.43.4 |
| **Markdown 解析** | Marked | ^17.0.1 |
| **构建工具** | PostCSS + Tailwind | - |
| **代码质量** | ESLint | ^9 |

### 关键配置
- **Next.js**: 使用 `output: 'export'` 静态导出模式
- **TypeScript**: 严格模式，路径别名 `@/*` → `src/*`
- **目标环境**: ES2017+，现代浏览器

---

## 📁 目录结构

```
coding-farm/
├── public/                      # 静态资源
│   └── doc/                     # 文档内容（Markdown）
│       ├── docs.json            # 文档导航配置
│       ├── 作物/                # 作物说明文档
│       ├── 内置函数/            # API 函数文档
│       ├── 地块/                # 地块类型说明
│       ├── 物品/                # 物品说明
│       ├── 编程/                # 编程概念教程
│       ├── 解锁/                # 解锁系统说明
│       └── 通用信息/            # 入门指南等
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # 主页面（游戏主界面）
│   │   ├── layout.tsx           # 根布局（Provider 嵌套）
│   │   ├── globals.css          # 全局样式
│   │   ├── doc/                 # 文档页面路由
│   │   │   ├── page.tsx         # 文档首页
│   │   │   ├── Sidebar.tsx      # 文档侧边栏
│   │   │   └── [...slug]/       # 动态文档路由
│   │   ├── game/                # 🎮 游戏引擎核心
│   │   │   ├── initMain.ts      # 主入口
│   │   │   ├── initGame.ts      # 游戏初始化
│   │   │   ├── types.ts         # 类型定义（UiBridge）
│   │   │   ├── api/             # 游戏 API（move, plant, harvest 等）
│   │   │   ├── data/            # 数据配置（科技树、默认代码）
│   │   │   ├── editor/          # Ace 编辑器初始化
│   │   │   ├── engine/          # 游戏引擎核心逻辑
│   │   │   ├── loop/            # 游戏主循环
│   │   │   ├── pixi/            # PIXI.js 渲染设置
│   │   │   ├── reset/           # 重置逻辑
│   │   │   ├── runner/          # 用户代码运行器（Worker）
│   │   │   ├── save/            # 存档管理
│   │   │   ├── systems/         # 游戏子系统初始化
│   │   │   ├── utils/           # 工具函数
│   │   │   └── world/           # 世界/地图管理
│   │   │
│   │   └── mobile/              # 📱 移动端页面
│   │       ├── page.tsx         # 移动端主页面
│   │       └── MobilePage.module.css  # 移动端样式
│   │
│   ├── components/              # React 组件
│   │   ├── AlertProvider.tsx    # 弹窗 Alert Provider
│   │   ├── ConfirmProvider.tsx  # 确认对话框 Provider
│   │   ├── I18nProvider.tsx     # 国际化 Provider
│   │   ├── LanguageSwitcher.tsx # 语言切换器
│   │   ├── SaveCard.tsx         # 存档卡片
│   │   ├── Console/             # 控制台组件
│   │   ├── Header/              # 顶部导航栏
│   │   ├── SaveStartModal/      # 启动/存档弹窗
│   │   └── Unlock/              # 科技树组件
│   │
│   ├── i18n/                    # 国际化
│   │   ├── core.ts              # i18n 核心逻辑
│   │   └── language/            # 语言文件（en/zh-CN/zh-TW）
│   │
│   └── utils/                   # 工具函数
│       ├── device.ts            # 设备检测（UA 判断移动端）
│       ├── storage.ts           # localStorage 操作
│       └── time.ts              # 时间工具
```

---

## 🎮 核心模块说明

### 1. 游戏引擎 (`src/app/game/engine/`)

| 子模块 | 功能 |
|--------|------|
| `core/` | 核心常量、游戏状态管理 |
| `crop.js` | 作物系统（种植、收获、合并） |
| `entity.js` | 实体管理（玩家、多角色） |
| `characters/` | 角色渲染管理 |
| `soil.js` | 土壤系统（湿度、肥力） |
| `inventory.js` | 背包/物品管理 |
| `unlock/` | 科技树/解锁系统（含 `mobile-unlock-pixi.js` 移动端渲染） |
| `maze.js` | 迷宫生成与管理 |
| `snake.js` | 贪吃蛇模式 |
| `layer.js` | PIXI 图层管理 |
| `render-map.js` | 地图渲染 |
| `bridge.js` | Worker 通信桥接 |

### 2. 游戏 API (`src/app/game/api/`)

提供给用户脚本调用的核心函数：

```javascript
// 移动控制
move(direction, id)     // 移动实体
canMove(direction, id)  // 检测是否可移动

// 土地操作
till(id)                // 耕地/翻土
getGroundType(id)       // 获取地块类型

// 作物操作
plant(type, id)         // 种植作物
harvest(id)             // 收获
canHarvest(id)          // 检测是否可收获
getCropType(id)         // 获取作物类型

// 资源操作
useWater(id)            // 浇水
getWater(id)            // 获取湿度
useFertilizer(id)       // 施肥
numItems(itemType)      // 查询背包物品数量

// 工具函数
getWorldSize()          // 获取世界大小
measure(id)             // 测量（迷宫宝藏位置等）
random(), max(), min(), abs()  // 数学函数
```

### 3. 代码运行器 (`src/app/game/runner/`)

- 使用 **Web Worker** 在独立线程执行用户代码
- 支持超时控制（默认 10 分钟）
- 通过 `src/app/game/engine/bridge.js` 实现主线程与 Worker 通信
- Worker 代码位于 `public/doc/workers/worker.js`

### 4. 游戏循环 (`src/app/game/loop/`)

主循环职责：
- 资源自动产出（水、肥料）
- 土壤系统更新（湿度变化）
- 作物系统更新（成熟、动画）
- 世界渲染（土地 + 作物 + 实体）
- Worker pending frame 回调处理

### 5. 科技树系统 (`src/app/game/engine/unlock/`)

科技树配置示例（位于 `src/app/game/data/`）：
```javascript
{
  key: "cactus",
  name: "unlock.cactus.name",       // i18n key
  tier: 6,                          // 层级
  deps: ["pumpkins"],               // 前置依赖
  desc: "unlock.cactus.desc",       // 描述
  levels: [
    { level: 0, requires: { pumpkin: 5000 }, ability: [...] },
  ]
}
```

---

## 🌐 国际化 (i18n)

### 支持语言
- `en` - 英语
- `zh-CN` - 简体中文
- `zh-TW` - 繁体中文

### 核心实现 (`src/i18n/core.ts`)

```typescript
// 翻译函数（支持参数插值）
translate(locale, key, params?)
// 例: translate("en", "status.error", { error: "SyntaxError" })

// 语言检测（自动识别浏览器语言）
normalizeLocale(input?) → Locale
```

### React 集成 (`src/components/I18nProvider.tsx`)

```tsx
// Hook 使用
const { locale, setLocale, t } = useI18n();
t("header.run")  // → "Run" 或 "运行"
```

### 约定
- 所有用户可见文本使用 `t()` 函数
- 翻译键使用点分命名: `category.subcategory.key`
- 参数插值使用 `{paramName}` 格式
- 存储键: `farm_locale`

---

## 📚 文档系统

### 结构
- **导航配置**: `public/doc/docs.json`
- **内容文件**: `public/doc/**/*.md`

### 分类
| 分类 | 内容 |
|------|------|
| 通用信息 | 入门指南 |
| 作物 | Apple, Bush, Cactus, Carrot, Grass, Pumpkin, Sunflower, Treasure, Tree |
| 内置函数 | move, plant, harvest 等 25+ 个 API |
| 地块 | Grassland, Soil |
| 物品 | Apple, Cactus, Carrot, Fertilizer, Gold, Hay, Power, Pumpkin, Water, Wood |
| 编程 | 变量、循环、函数、列表、字典、集合等 |
| 解锁 | 科技树各节点说明 |

### 渲染
- 使用 `marked` 库解析 Markdown
- 路由: `/doc/[category]/[filename]`

---

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev     # http://localhost:3000

# 生产构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

---

## 📝 代码风格约定

### 文件命名
- React 组件: `PascalCase.tsx`
- 工具函数: `camelCase.ts`
- 游戏引擎模块: `kebab-case.js`
- CSS 模块: `ComponentName.module.css`

### React 组件结构

```tsx
"use client";  // 客户端组件标记（Next.js App Router）

import { useI18n } from "@/components/I18nProvider";
import styles from "./Component.module.css";

interface ComponentProps {
  // 类型定义
}

export default function Component({ props }: ComponentProps) {
  const { t } = useI18n();
  // 组件逻辑
}
```

### 游戏引擎约定
- 使用 `app` 对象作为全局游戏状态容器
- 所有子系统通过 `setup*()` 函数初始化
- Worker 通信使用 `type` 字段区分消息类型
- 科技树/解锁使用 i18n key 而非硬编码文本

### 存档约定
- localStorage 键前缀: `farm_save_slot_*`
- 存档数据包含: `version`, `entities`, `inventory`, `unlocks`, `world`, `code` 等

---

## ⚠️ AI 助手注意事项

### 修改代码时
1. **保持 i18n 约定**：所有用户可见文本使用翻译 key
2. **保持类型安全**：TypeScript 文件需要正确的类型标注
3. **组件导入**：使用 `@/` 路径别名
4. **客户端组件**：需要 DOM/浏览器 API 的组件添加 `"use client"`
5. **PIXI.js 代码**：游戏渲染相关代码需考虑性能优化

### 添加新功能时
1. **新 API**：在 `src/app/game/api/` 添加，同时更新 `public/doc/内置函数/`
2. **新组件**：放入 `src/components/`，使用 CSS Modules
3. **新科技**：在 `src/app/game/data/` 配置，添加对应 i18n key
4. **新文档**：在 `public/doc/` 添加 Markdown 文件，更新 `docs.json`

### 常见问题
- **静态导出限制**：Next.js 使用 `output: 'export'`，不支持服务端 API 路由
- **Web Worker 限制**：Worker 在独立线程，无法直接访问 DOM
- **PIXI.js 渲染**：所有渲染操作需在主线程通过 `app` 对象调用

---

## 📱 移动端适配
- 路由：`/mobile` 独立 UI，PC 端仍在 `/`（PC 代码未改动）。
- 入口判断：`src/app/page.tsx` 在客户端基于 userAgent 检测，移动端自动跳转 `/mobile`。
- 布局与样式：`src/app/mobile/page.tsx` + `MobilePage.module.css`，共用 `#game`/`#map`/`#editor` 节点与 `initMain`，页面挂载时为 `body` 添加 `mobile-body`（重置 PC 栅格），`mobile-console-hidden` 用于隐藏移动端日志条。
- UI 结构：顶部资源条、右上快捷操作（日志开关/科技树/保存/编辑器抽屉）、底部圆形工具区（重置/科技/编辑器/运行），编辑器抽屉右侧滑出沿用 Ace。
- 横屏：使用 `mobile.landscape*` 文案的遮罩提示强制横屏。
- 工具函数：UA 判定方法 `isMobileUserAgent` 位于 `src/utils/device.ts`。
- 移动端科技树：使用 `MobileUnlockTree` 组件 + `mobile-unlock-pixi.js` 渲染，卡片尺寸更小，点击显示详情面板。
- Ace 编辑器：初始化时延迟调用 `resize()` 确保在移动端抽屉场景正确渲染。

---

## 🖥️ 控制台组件

控制台组件 (`src/components/Console/`) 提供日志输出功能：

### 特性
- **折叠/展开**：移动端支持点击按钮折叠/展开
- **欢迎消息**：客户端挂载后显示欢迎信息
- **日志类型**：区分用户日志 (`user`) 和系统日志 (`system`)
- **自动滚动**：新日志自动滚动到底部
- **SSR 兼容**：使用 `mounted` 状态避免 hydration 不匹配

### 使用方式

```tsx
const { log, system } = useConsole();
log(["hello", "world"]);     // 用户日志
system("Game started");       // 系统日志
```

---

## 📄 相关文件

- `package.json` - 项目依赖和脚本
- `tsconfig.json` - TypeScript 配置
- `next.config.ts` - Next.js 配置
- `eslint.config.mjs` - ESLint 配置
- `postcss.config.mjs` - PostCSS 配置

---

*最后更新: 2025-11-28*
