# Testing Guide for Lane Moe

## Application Status
✅ **Build**: Successful
✅ **Dev Server**: Running on http://localhost:3000/

## Manual Testing Checklist

### 1. Initial State
- [ ] Open http://localhost:3000/
- [ ] See "No swimlanes yet" message
- [ ] Toolbar is visible with buttons
- [ ] Keyboard shortcuts hint is visible in bottom right

### 2. Add Swimlanes
1. [ ] Click "+ Add Swimlane" button
2. [ ] Enter name "Frontend" - should create first swimlane
3. [ ] Add second swimlane "Backend"
4. [ ] Add third swimlane "Database"
5. [ ] Verify swimlanes appear in order with different colors
6. [ ] Verify swimlane labels are visible on the left side

### 2.5. Clear All Data
1. [ ] Create some swimlanes and blocks
2. [ ] Click red "Clear All" button
3. [ ] Verify confirmation dialog appears
4. [ ] Confirm deletion
5. [ ] Verify all swimlanes and blocks are removed
6. [ ] Verify "No swimlanes yet" message appears
7. [ ] Verify localStorage is also cleared

### 2.6. Save & Persistence
1. [ ] Create some swimlanes and blocks
2. [ ] Click 💾 save button - verify "Data saved to browser!" message
3. [ ] Press Ctrl+S - verify "💾 Saved!" notification appears
4. [ ] Refresh browser page
5. [ ] Verify all data persists (not lost)
6. [ ] Close and reopen browser
7. [ ] Verify data still persists

### 2.7. Export & Import
1. [ ] Create some test data
2. [ ] Click 📤 export button
3. [ ] Verify JSON file downloads (name: lane-moe-YYYY-MM-DD.json)
4. [ ] Open downloaded JSON file - verify structure
5. [ ] Clear all data
6. [ ] Click 📥 import button
7. [ ] Select exported JSON file
8. [ ] Verify "Data imported successfully!" message
9. [ ] Verify all data restored correctly
10. [ ] Try importing invalid JSON - verify error message

### 3. Add Blocks
1. [ ] Click "+ Add Block" dropdown
2. [ ] Select "Frontend" swimlane
3. [ ] Block should appear at time 0 with 1000ms duration
4. [ ] Add blocks to other swimlanes
5. [ ] Verify blocks have correct colors based on category

### 4. WASD Keyboard Controls
1. [ ] Press 'W' - canvas should zoom in (time scale contracts)
2. [ ] Press 'S' - canvas should zoom out (time scale expands)
3. [ ] Press 'A' - canvas should pan right (later in time)
4. [ ] Press 'D' - canvas should pan left (earlier in time)
5. [ ] Hold keys for smooth continuous movement

### 5. Mouse Interactions - Pan/Zoom
1. [ ] Mouse wheel on canvas - should pan up/down (navigate swimlanes)
2. [ ] Click and drag on empty space - should pan the view
3. [ ] Verify smooth pan/zoom performance

### 6. Mouse Interactions - Blocks
1. [ ] Click on a block - should select it (dark border)
2. [ ] Double-click on empty space - should create new block
3. [ ] Drag a block horizontally - should change start time
4. [ ] Drag a block to different swimlane - should move it
5. [ ] Hover over block edges - cursor should change to resize
6. [ ] Drag left edge - should change start time
7. [ ] Drag right edge - should change duration
8. [ ] Verify minimum duration constraint (10ms)

### 7. Edit Block Modal
1. [ ] Click on a block to open edit modal
2. [ ] Change block name - should update
3. [ ] Change category - should update color
4. [ ] Change color using color picker
5. [ ] Change start time - block should move
6. [ ] Change duration - block should resize
7. [ ] Add description text
8. [ ] Click Save - changes should apply
9. [ ] Click Delete - block should be removed
10. [ ] Press Escape - modal should close

### 8. Toolbar Controls
1. [ ] Click "←" button - pan left
2. [ ] Click "→" button - pan right
3. [ ] Click "−" button - zoom out
4. [ ] Click "+" button - zoom in
5. [ ] Click "Reset View" - return to default view
6. [ ] Click "Clear All" - remove all data with confirmation
7. [ ] Click 💾 save button - save to localStorage
8. [ ] Click 📤 export button - download JSON file
9. [ ] Click 📥 import button - load JSON file

### 9. Visual Verification
1. [ ] Swimlane backgrounds alternate colors
2. [ ] Grid lines are visible and aligned
3. [ ] Time scale shows accurate time labels
4. [ ] Time labels update when zooming
5. [ ] Blocks show name and duration (when wide enough)
6. [ ] Selected block has dark border
7. [ ] Hovered block has lighter border
8. [ ] Swimlane labels have color indicators

### 10. Edge Cases
1. [ ] Try to add block when no swimlanes exist - should alert
2. [ ] Delete swimlane with blocks - blocks should be removed
3. [ ] Zoom in very close - grid should adapt
4. [ ] Zoom out very far - grid should adapt
5. [ ] Create many blocks (50+) - performance should stay smooth
6. [ ] Resize block to minimum duration - should enforce 10ms minimum

### 11. Performance
1. [ ] Zoom with W/S keys - should be smooth
2. [ ] Pan with A/D keys (A=right, D=left) - should be 60fps smooth
3. [ ] Pan with mouse wheel - should be responsive
4. [ ] Drag blocks - should follow cursor without lag
5. [ ] Resize blocks - should update in real-time
6. [ ] Hover over blocks - cursor should update immediately

## Sample Test Data

### Test Scenario 1: Simple Request Flow
```
Swimlane: Frontend
  - "UI Render" (0ms, 500ms)
  - "API Call" (600ms, 300ms)

Swimlane: Backend
  - "Process Request" (650ms, 200ms)
  - "Database Query" (900ms, 400ms)

Swimlane: Database
  - "Execute Query" (950ms, 300ms)
```

### Test Scenario 2: Microservices
```
Swimlane: API Gateway
  - "Route Request" (0ms, 100ms)
  - "Aggregate Response" (800ms, 200ms)

Swimlane: Auth Service
  - "Validate Token" (150ms, 200ms)

Swimlane: User Service
  - "Fetch User" (400ms, 300ms)

Swimlane: Data Service
  - "Query Database" (500ms, 250ms)
```

## Known Limitations (Future Enhancements)
- No undo/redo functionality
- No multi-select for blocks
- No nested spans (parent-child relationships)
- No dark mode
- No minimap overview
- No cloud sync/backup

## Bug Reporting
If you find any issues, note:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
