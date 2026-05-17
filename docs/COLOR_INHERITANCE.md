# 颜色继承逻辑说明

## JSON格式 v2.0 - 颜色继承

### 核心概念
块（block）默认继承其所在泳道（swimlane）的颜色，只有在需要不同颜色时才明确指定。

### 规则

**导出时：**
```javascript
if (block.color !== swimlane.color) {
  blockData.color = block.color;  // 只有不同时才导出
}
```

**导入时：**
```javascript
// 使用块的color（如果指定），否则继承泳道颜色
color: blockData.color || swimlaneColor
```

### 示例

**大部分块继承泳道颜色：**
```json
{
  "name": "Frontend",
  "color": "#3b82f6",
  "blocks": [
    {
      "name": "Normal Task",
      "offset": 0,
      "size": 500
      // 不需要color字段，自动继承 #3b82f6
    },
    {
      "name": "Another Normal Task",
      "offset": 600,
      "size": 300
      // 也不需要color字段
    }
  ]
}
```

**只有特殊块指定颜色：**
```json
{
  "name": "Frontend",
  "color": "#3b82f6",
  "blocks": [
    {
      "name": "Normal Task",
      "offset": 0,
      "size": 500
    },
    {
      "name": "Error Task",
      "offset": 600,
      "size": 300,
      "color": "#ef4444"  // 红色表示错误
    },
    {
      "name": "Warning Task",
      "offset": 1000,
      "size": 200,
      "color": "#f59e0b"  // 橙色表示警告
    }
  ]
}
```

### 优势

**1. 更简洁**
```json
// ❌ 旧格式 - 每个块都有color
{
  "blocks": [
    {"name": "A", "color": "#3b82f6"},
    {"name": "B", "color": "#3b82f6"},
    {"name": "C", "color": "#3b82f6"}
  ]
}

// ✅ 新格式 - 只在需要时指定
{
  "color": "#3b82f6",
  "blocks": [
    {"name": "A"},
    {"name": "B"},
    {"name": "C", "color": "#ef4444"}
  ]
}
```

**2. 更易编辑**
- 修改泳道颜色会自动应用到所有继承的块
- 只需要为特殊的块单独指定颜色
- 减少重复和不一致

**3. 语义清晰**
```json
{
  "name": "Database",
  "color": "#10b981",
  "blocks": [
    {
      "name": "Query",
      "offset": 0,
      "size": 500
      // 显然这个query继承Database的绿色
    },
    {
      "name": "Slow Query",
      "offset": 600,
      "size": 1000,
      "color": "#ef4444"
      // 这个慢查询用红色突出显示
    }
  ]
}
```

### 实现细节

**存储层级：**
1. 泳道定义默认颜色
2. 块可以覆盖（可选）
3. 导出时智能判断是否需要导出color
4. 导入时正确解析继承关系

**向后兼容：**
- v1.0 格式仍然支持
- 每个块都有明确color的v2.0文件也正常工作
- 只是新导出的文件会使用优化的格式

### 使用建议

**何时省略color：**
- 块的颜色与泳道相同时
- 块属于同一类别/类型时
- 想要统一外观时

**何时指定color：**
- 错误状态（红色）
- 警告状态（橙色）
- 成功状态（绿色）
- 特殊操作（不同颜色）
- 需要视觉强调时
