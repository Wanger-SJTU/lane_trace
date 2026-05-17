# Lane Moe - Online Swimlane Tool

A web-based swimlane visualization tool similar to distributed tracing tools like Jaeger/Trace. Display timeline spans across horizontal swimlanes with interactive features for managing and manipulating both swimlanes and time spans.

## Features

- **Horizontal Swimlanes**: Create custom swimlanes with colors
- **Interactive Blocks**: Add, move, resize, and edit time blocks
- **Data Management**:
  - Auto-save to browser storage (data persists after refresh)
  - Export to JSON file for backup
  - Import from JSON file to restore
  - Clear all data with confirmation
  - Load demo data
- **Keyboard Controls**:
  - W/S: Zoom in/out
  - A/D: Pan right/left
  - Ctrl+S: Quick save
  - Delete: Remove selected block
  - Escape: Close modal
- **Mouse Interactions**:
  - Drag blocks to move them
  - Drag block edges to resize duration
  - Click blocks to edit
  - Double-click to add new blocks
  - Mouse wheel to pan up/down
  - Drag background to pan
- **Customization**:
  - Color-coded blocks by category
  - Custom colors and names
  - Edit duration and start time
  - Add descriptions

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
