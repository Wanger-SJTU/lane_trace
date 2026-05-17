# JSON Save Format

The JSON files exported/imported by Lane Moe use the following format:

```json
{
  "version": "2.0",
  "timestamp": "2025-01-17T12:34:56.789Z",
  "swimlanes": [
    {
      "name": "Frontend",
      "color": "#3b82f6",
      "blocks": [
        {
          "name": "UI Render",
          "offset": 0,
          "size": 500,
          "description": "Initial page render"
        },
        {
          "name": "API Call",
          "offset": 600,
          "size": 300,
          "color": "#8b5cf6",
          "description": "Different color than swimlane"
        }
      ]
    },
    {
      "name": "Backend",
      "color": "#ec4899",
      "blocks": [
        {
          "name": "Process Request",
          "offset": 650,
          "size": 200
        }
      ]
    }
  ]
}
```

## Field Descriptions

### Root Level
- `version`: Format version (current: "2.0")
- `timestamp`: ISO 8601 timestamp of export
- `swimlanes`: Array of swimlane objects with embedded blocks

### Swimlane Object
- `name`: Display name of the swimlane
- `color`: Hex color code for swimlane header
- `blocks`: Array of block objects belonging to this swimlane

### Block Object
- `name`: Display name of the block
- `offset`: Start time in milliseconds (relative to timeline start)
- `size`: Duration in milliseconds
- `color`: Hex color code (optional, inherits from swimlane if not specified)
- `category`: Category for color coding (optional, only if different from "default")
- `description`: Optional description text

**Color Inheritance Rule:**
- If `color` is not specified, block inherits swimlane color
- If `color` is specified, block uses that color instead
- This makes the JSON cleaner - only specify colors when needed

## Key Changes from v1.0

**Structure:**
- ✅ Blocks are nested inside swimlanes (no separate blocks array)
- ✅ Each swimlane has its own color property
- ✅ `offset`/`size` instead of `startTime`/`duration`
- ✅ Removed internal IDs (auto-generated on import)
- ✅ More intuitive and compact format

**Benefits:**
- 🎯 Clearer hierarchy - swimlanes contain their blocks
- 📦 Easier to edit manually
- 🔄 Better version control (no auto-generated IDs)
- 💾 More compact file size
- 🎨 Smart color inheritance - only specify colors when needed

## Usage

### Exporting
1. Click the 📤 button in toolbar
2. JSON file downloads with naming: `lane-moe-YYYY-MM-DD.json`
3. File contains all swimlanes and their blocks

### Importing
1. Click the 📥 button in toolbar
2. Select JSON file (v2.0 or v1.0 format)
3. Data replaces current workspace
4. New IDs are auto-generated

### Browser Storage
- Data auto-saves to localStorage as `lane-moe-data`
- Uses same v2.0 format as exported files
- View/edit: DevTools → Application → Local Storage

## Version Compatibility

**v2.0 (Current)**
```json
{
  "version": "2.0",
  "swimlanes": [
    {
      "name": "Service A",
      "color": "#3b82f6",
      "blocks": [
        {
          "name": "Task",
          "offset": 0,
          "size": 100
        },
        {
          "name": "Special Task",
          "offset": 200,
          "size": 150,
          "color": "#ef4444"
        }
      ]
    }
  ]
}
```

**v1.0 (Legacy - still supported)**
```json
{
  "version": "1.0",
  "swimlanes": [
    {"id": "...", "name": "Service A", "color": "#3b82f6"}
  ],
  "blocks": [
    {"swimlaneId": "...", "name": "Task", "startTime": 0, "duration": 100}
  ]
}
```

The import function automatically detects and handles both formats.

## Manual Editing

The v2.0 format is designed to be human-readable and editable:

```json
{
  "version": "2.0",
  "timestamp": "2025-01-17T12:34:56.789Z",
  "swimlanes": [
    {
      "name": "My Service",
      "color": "#ff6b6b",
      "blocks": [
        {
          "name": "Normal Task",
          "offset": 1000,
          "size": 500
        },
        {
          "name": "Important Task",
          "offset": 1600,
          "size": 300,
          "color": "#ef4444",
          "description": "Critical path operation"
        }
      ]
    }
  ]
}
```

**Tips:**
- Use `offset` for position on timeline
- Use `size` for duration
- Most blocks don't need `color` (inherit from swimlane)
- Only specify `color` for blocks that need different colors
- Add `description` for documentation
- Remove optional fields you don't need
