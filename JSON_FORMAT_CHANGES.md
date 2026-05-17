# JSON 格式改进说明

## v2.0 格式特点

### 结构清晰
```json
{
  "version": "2.0",
  "swimlanes": [
    {
      "name": "Frontend",
      "color": "#3b82f6",
      "blocks": [
        {"name": "Task", "offset": 0, "size": 100}
      ]
    }
  ]
}
```

### 主要改进

**1. 泳道包含块**
- ✅ 每个 swimlane 对象包含自己的 blocks 数组
- ✅ 不再需要 swimlaneId 来关联
- ✅ 结构更直观，便于阅读和编辑

**2. 统一时间单位**
- ✅ `offset` 替代 `startTime` - 表示时间偏移
- ✅ `size` 替代 `duration` - 表示持续时间
- ✅ 语义更清晰，符合常见的区间表示法

**3. 简化字段**
- ✅ 移除内部 ID（id, swimlaneId）
- ✅ 导入时自动生成新 ID
- ✅ 减少文件大小，更易编辑

**4. 泳道颜色独立**
- ✅ 每个泳道有自己的 color 属性
- ✅ 块可以覆盖泳道的默认颜色
- ✅ 更灵活的颜色控制

## 迁移说明

**自动兼容**
- v1.0 文件仍可正常导入
- 导入时自动转换为 v2.0 结构
- 导出始终使用 v2.0 格式

**手动编辑建议**
```json
{
  "name": "My Service",
  "color": "#custom_color",
  "blocks": [
    {
      "name": "Task Name",
      "offset": 0,        // 开始时间 (毫秒)
      "size": 1000,       // 持续时间 (毫秒)
      "category": "api",  // 可选
      "description": ""   // 可选
    }
  ]
}
```

## 示例对比

**v1.0 (旧格式)**
```json
{
  "version": "1.0",
  "swimlanes": [
    {"id": "swimlane-abc", "name": "Frontend", "color": "#3b82f6"}
  ],
  "blocks": [
    {
      "id": "block-xyz",
      "swimlaneId": "swimlane-abc",
      "name": "API Call",
      "startTime": 1000,
      "duration": 500
    }
  ]
}
```

**v2.0 (新格式)**
```json
{
  "version": "2.0",
  "swimlanes": [
    {
      "name": "Frontend",
      "color": "#3b82f6",
      "blocks": [
        {
          "name": "API Call",
          "offset": 1000,
          "size": 500
        }
      ]
    }
  ]
}
```

新格式更简洁、更易读、更易编辑！
