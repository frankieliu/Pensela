# Default Settings Feature

## Overview
Updated the application to start with sensible default settings: freehand tool selected, 5px brush size (with 2-10px range), and 50% opacity.

## Changes Made

### 1. Freehand Tool as Default (`index.js`)
Added event listener to set freehand drawing mode when the board window finishes loading:

```javascript
// Set default tool to freehand after windows load
board.webContents.on("did-finish-load", () => {
    board.webContents.send("setMode", "draw");
    board.webContents.send("drawFreehand");
});
```

### 2. Controller UI Default Selection (`controller.html`)
Updated the toolbar to visually show freehand pen as selected on startup:

**Before:**
```html
<div class="tool-item win-controls mouse main selected"></div>
...
<div class="tool-item sticker pen main" title="Draw Freehand"></div>
```

**After:**
```html
<div class="tool-item win-controls mouse main"></div>
...
<div class="tool-item sticker pen main selected" title="Draw Freehand"></div>
```

### 3. Brush Size Range 2-10px (`controller.html`)
Changed the size slider from 5-30px range to 2-10px for finer control:

**Before:**
```html
<input type="range" class="size-slider" min="5" max="30" value="5" title="Brush size">
```

**After:**
```html
<input type="range" class="size-slider" min="2" max="10" value="5" title="Brush size">
```

### 4. Updated Stroke Constraints (`scripts/state.js`)
Updated the stroke increase/decrease handlers to match the new 2-10px range with 1px steps:

**Before:**
```javascript
ipcRenderer.on("strokeIncrease", () => {
    if (boardState.strokeWidth < 30) boardState.strokeWidth += 5;
    ipcRenderer.send("strokeWidthChanged", boardState.strokeWidth);
});

ipcRenderer.on("strokeDecrease", () => {
    if (boardState.strokeWidth > 5) boardState.strokeWidth -= 5;
    ipcRenderer.send("strokeWidthChanged", boardState.strokeWidth);
});
```

**After:**
```javascript
ipcRenderer.on("strokeIncrease", () => {
    if (boardState.strokeWidth < 10) boardState.strokeWidth += 1;
    ipcRenderer.send("strokeWidthChanged", boardState.strokeWidth);
});

ipcRenderer.on("strokeDecrease", () => {
    if (boardState.strokeWidth > 2) boardState.strokeWidth -= 1;
    ipcRenderer.send("strokeWidthChanged", boardState.strokeWidth);
});
```

### 5. Default State Values (`scripts/state.js`)
The boardState defaults were set to:
- `strokeWidth: 5` - 5px brush size
- `opacity: 0.5` - 50% transparency

## Files Modified
| File | Changes |
|------|---------|
| `index.js` | Added freehand tool initialization on board load |
| `controller.html` | Pen selected by default, slider range 2-10px |
| `scripts/state.js` | Updated stroke bounds to 2-10px with 1px step |

## Result
When the application starts:
- Freehand drawing tool is active and visually selected
- Brush size is 5px (adjustable from 2-10px)
- Opacity is 50% (adjustable from 0-100%)
- User can immediately start drawing without selecting a tool
