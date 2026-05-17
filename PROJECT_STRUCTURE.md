# 项目结构

```
lane_moe/
├── src/                    # 源代码
│   ├── components/         # React组件
│   │   ├── Canvas/        # Canvas渲染组件
│   │   ├── Controls/      # 控制栏组件
│   │   └── Modals/        # 弹窗组件
│   ├── hooks/             # 自定义React Hooks
│   ├── store/             # Zustand状态管理
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── docs/                  # 文档
│   ├── TESTING.md         # 测试指南
│   ├── SAVE_FORMAT.md     # JSON格式说明
│   ├── COLOR_INHERITANCE.md # 颜色继承
│   └── RANDOM_COLORS.md   # 随机颜色功能
├── examples/              # 示例数据
│   ├── example-data.json  # 完整示例
│   ├── test-random-colors.json # 随机颜色测试
│   └── test-color-inheritance.json # 颜色继承测试
├── tests/                 # 测试文件（预留）
├── .gitignore            # Git忽略文件
├── index.html            # HTML模板
├── package.json          # 项目配置
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
├── tailwind.config.js    # TailwindCSS配置
├── README.md             # 项目说明
└── QUICK_START.md        # 快速开始指南
```

## 核心文件说明

### 状态管理
- `src/store/swimlaneStore.ts` - 全局状态管理（泳道、块、视口等）

### React组件
- `src/components/App.tsx` - 主应用组件
- `src/components/Canvas/SwimlaneCanvas.tsx` - Canvas渲染器
- `src/components/Controls/Toolbar.tsx` - 工具栏
- `src/components/Modals/EditBlockModal.tsx` - 块编辑弹窗

### 自定义Hooks
- `src/hooks/useKeyboardControls.ts` - 键盘控制（WASD）
- `src/hooks/useCanvasInteraction.ts` - 鼠标交互（拖拽、缩放）
- `src/hooks/useTimeTransform.ts` - 时间↔像素转换

### 工具函数
- `src/utils/CanvasRenderer.ts` - Canvas绘制函数
- `src/utils/color.ts` - 颜色工具函数

### 类型定义
- `src/types/swimlane.ts` - 泳道和块的类型定义

## 开发流程

1. **添加新功能**
   - 在 `src/` 中添加/修改代码
   - 更新相关类型定义
   - 添加必要的文档

2. **测试**
   - 参考 `docs/TESTING.md` 进行功能测试
   - 使用 `examples/` 中的示例数据

3. **文档更新**
   - 更新 `README.md`（用户功能）
   - 更新 `docs/` 中的相关文档
   - 添加新的示例数据到 `examples/`

## 文件组织原则

- **src/** - 只包含源代码
- **docs/** - 详细文档，保持README简洁
- **examples/** - 示例和测试数据
- **tests/** - 预留给自动化测试
- **根目录** - 只保留必要的配置文件和主要文档
