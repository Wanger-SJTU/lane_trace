# Lane Moe - 在线泳道可视化工具

基于Web的泳道可视化工具，类似于分布式追踪工具（如Jaeger/Trace）。支持在水平泳道中显示时间跨度，提供丰富的交互功能来管理和操作泳道与时间块。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 http://localhost:3000/

## 主要功能

- 📊 **交互式泳道** - 创建自定义泳道和颜色
- 🎯 **时间块管理** - 添加、拖拽、缩放、编辑时间块
- 💾 **数据持久化** - 自动保存、导出/导入JSON
- 🎨 **智能颜色** - 泳道颜色继承、随机颜色分配
- ⌨️ **键盘控制** - W/S缩放、A/D平移（A=右，D=左）
- 🖱️ **鼠标交互** - 拖拽、缩放、选择、双击创建

## 键盘快捷键

- `W/S` - 放大/缩小
- `A/D` - 向右/向左平移
- `滚轮` - 上下移动
- `Ctrl+S` - 快速保存
- `Delete` - 删除选中块
- `Escape` - 关闭弹窗

## 文档

- [快速开始指南](QUICK_START.md) - 详细的使用说明
- [测试指南](docs/TESTING.md) - 完整的功能测试清单
- [JSON格式说明](docs/SAVE_FORMAT.md) - 导入/导出格式
- [颜色继承](docs/COLOR_INHERITANCE.md) - 颜色系统详解
- [随机颜色](docs/RANDOM_COLORS.md) - 自动颜色分配

## 示例数据

`examples/` 目录包含示例JSON文件：
- `example-data.json` - 完整的示例数据
- `test-random-colors.json` - 测试随机颜色功能
- `test-color-inheritance.json` - 测试颜色继承

## 技术栈

- **React 18** + TypeScript
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **HTML5 Canvas** - 渲染
- **TailwindCSS** - 样式

## 开发

```bash
# 开发模式（支持热更新）
npm run dev

# 类型检查
npm run build
```

## 数据格式

项目使用优化的JSON格式（v2.0）：
- 泳道包含块数组（层次清晰）
- 使用 `offset`/`size` 代替 `startTime`/`duration`
- 智能颜色继承（块默认继承泳道颜色）
- 支持手动和自动颜色分配

详见 [JSON格式说明](docs/SAVE_FORMAT.md)

## License

MIT

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

1. Click "Add Swimlane" to create a new swimlane
2. Click "Add Block" to add a time block to a swimlane
3. Use W/S to zoom, A/D to pan horizontally (A=right, D=left), mouse wheel to pan vertically
4. Data auto-saves to browser - refresh page to test persistence
5. Export/import JSON files for backup and sharing
6. Click on blocks to edit them
5. Drag blocks to reposition them
6. Drag block edges to resize duration

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Zustand for state management
- TailwindCSS for styling
- HTML5 Canvas for rendering

## Building

```bash
npm run build
```

The built files will be in the `dist` directory.
