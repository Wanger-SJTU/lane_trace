# Lane Moe - Quick Start Guide

## 🚀 Getting Started

1. **Start the application:**
   ```bash
   npm run dev
   ```
   The app will open at http://localhost:3000/

2. **Load demo data:**
   - Click the purple "Load Demo" button in the toolbar
   - This creates sample swimlanes and blocks to explore

## 🎮 Controls

### Keyboard Shortcuts
- **W/S** - Zoom in/out
- **A/D** - Pan right/left
- **Ctrl+S** - Quick save (shows notification)
- **Delete** - Remove selected block
- **Escape** - Close modal

### Mouse Controls
- **Click block** - Select and edit
- **Double-click** - Create new block
- **Drag block** - Move to different time/swimlane
- **Drag edges** - Resize duration
- **Scroll wheel** - Pan up/down
- **Drag background** - Pan view

## 📊 Creating Content

### Add Swimlane
1. Click "+ Add Swimlane"
2. Enter a name (e.g., "Frontend", "Backend", "Database")
3. Swimlane appears with auto-assigned color

### Add Block
1. Click "+ Add Block" dropdown
2. Select target swimlane
3. Block appears - drag to position, resize as needed

### Clear All Data
1. Click red "Clear All" button
2. Confirm the deletion
3. All swimlanes and blocks will be removed
4. Local storage is also cleared

### Save & Export
1. **Auto-save**: Data automatically saves to browser as you work
2. **Manual save**: Click 💾 button or press Ctrl+S
3. **Export**: Click 📤 button to download JSON file
4. **Import**: Click 📥 button to load JSON file

### Data Persistence
- ✅ Data saves automatically to browser storage
- ✅ Refresh page - data persists
- ✅ Close browser - data persists
- ✅ Export to JSON for backup
- ✅ Import JSON to restore data

### Edit Block
1. Click any block to open edit modal
2. Modify properties:
   - Name and description
   - Category (changes color)
   - Custom color
   - Start time and duration
3. Save or delete block

## 🎨 Categories & Colors

Default categories with colors:
- **Default** (blue) - General blocks
- **Database** (green) - Database operations
- **API** (purple) - API calls
- **Frontend** (amber) - Frontend operations
- **Backend** (pink) - Backend operations
- **Cache** (cyan) - Cache operations

## 💡 Tips

1. **Start with demo data** - Click "Load Demo" to see the tool in action
2. **Data auto-saves** - Work freely, everything saves automatically
3. **Export regularly** - Save important work as JSON files
4. **Use W/S for zoom** - Smooth zooming with keyboard
5. **Use A/D for horizontal navigation** - A=right, D=left (opposite of traditional)
6. **Use mouse wheel for vertical panning** - Navigate between swimlanes
7. **Double-click empty space** - Quickly add blocks
8. **Resize with precision** - Drag block edges for exact duration
9. **Ctrl+S to save** - Shows save confirmation notification

## 🔧 Building for Production

```bash
npm run build
```

Built files are in the `dist/` directory.

## 📁 Project Structure

```
lane_moe/
├── src/
│   ├── components/       # React components
│   │   ├── Canvas/      # Canvas rendering
│   │   ├── Controls/    # Toolbar and controls
│   │   └── Modals/      # Edit dialogs
│   ├── store/           # Zustand state management
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── index.html
├── package.json
└── vite.config.ts
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**TypeScript errors?**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Performance issues?**
- Reduce number of blocks (try < 100 for smooth performance)
- Use WASD instead of mouse for faster navigation
- Zoom out to see overview, then zoom in to details

## 🎯 Common Use Cases

### 1. Distributed Tracing
Visualize service calls in microservices:
- Swimlanes = Services
- Blocks = Operations/requests
- Position = Timeline

### 2. Project Timeline
Plan project phases:
- Swimlanes = Teams/Features
- Blocks = Tasks/Sprints
- Position = Timeline

### 3. Resource Scheduling
Track resource usage:
- Swimlanes = Resources/People
- Blocks = Allocations/Tasks
- Position = Time slots

### 4. Process Flow
Document business processes:
- Swimlanes = Departments/Actors
- Blocks = Activities/Steps
- Position = Sequence

## 📚 Next Steps

- Read TESTING.md for comprehensive testing guide
- Check README.md for detailed feature list
- Modify src/utils/color.ts to add custom categories
- Adjust constants in src/hooks/useTimeTransform.ts for different time scales
