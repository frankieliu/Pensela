# Extra Click Bug Fix

This document describes a bug that required extra clicks when switching tools, and how it was fixed.

## The Problem

Users experienced two related issues:

1. **Tool Selection**: After drawing with one tool (e.g., rectangle), clicking on another tool (e.g., freehand pen) required clicking on the toolbar first, then clicking the actual tool button.

2. **Drawing After Switch**: After selecting a new tool, the first click/drag on the canvas didn't draw anything. A second attempt was required.

## Root Cause

### Issue 1: Window Focus (macOS behavior)

The app uses multiple Electron windows:
- `board` - The transparent drawing canvas
- `controller` - The toolbar with tool buttons
- `picker` - Color picker dialog
- `dialog` - Background color dialog

On macOS, when you click on an inactive window, the first click activates/focuses the window but doesn't trigger the click event on elements inside. This is standard macOS behavior.

### Issue 2: Event Timing

The coordinate tracking used `click` event while drawing tools used `mousedown`:

```javascript
// Coordinate tracking (fires AFTER mouseup)
stage.on("click touchstart", () => {
    x = stage.getPointerPosition().x;
    y = stage.getPointerPosition().y;
});

// Drawing handler (fires on press)
stage.on("mousedown touchstart", () => {
    c = new Konva.Rect({ x: x, y: y, ... });
});
```

Event order for mouse:
1. `mousedown` fires → drawing starts with STALE x,y
2. `mouseup` fires
3. `click` fires → x,y finally updated (too late!)

## The Fix

### Fix 1: acceptFirstMouse

Added `acceptFirstMouse: true` to all BrowserWindow configurations in `index.js`:

```javascript
const board = new BrowserWindow({
    // ... other options
    acceptFirstMouse: true,  // Accept clicks even when window is inactive
});
```

This was added to all 4 windows: board, controller, picker, and dialog.

### Fix 2: Event Order

Changed coordinate tracking from `click` to `mousedown` in `scripts/board.js`:

```javascript
// Before (broken)
stage.on("click touchstart", () => { ... });

// After (fixed)
stage.on("mousedown touchstart", () => { ... });
```

This ensures coordinates are updated BEFORE the drawing handler runs.

## Files Modified

| File | Changes |
|------|---------|
| `index.js` | Added `acceptFirstMouse: true` to all 4 BrowserWindow configs |
| `scripts/board.js` | Changed `click touchstart` to `mousedown touchstart` for coordinate tracking (2 locations: initial setup and resetBoard handler) |

## Technical Details

### Why touch worked correctly

For touch events, both coordinate tracking and drawing used `touchstart`. Since listeners fire in registration order, coordinates were updated before the drawing handler ran.

### Why mouse was broken

For mouse events:
- Coordinate tracking: `click` (fires after mouseup)
- Drawing: `mousedown` (fires on press)

The drawing handler ran before coordinates were updated.

## Testing

1. Launch the app: `npm start`
2. Draw something with the rectangle tool
3. Click directly on the freehand pen tool (should select immediately)
4. Click on canvas to draw (should work on first click)
5. Switch between various tools and verify no extra clicks needed
