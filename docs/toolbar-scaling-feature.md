# Toolbar Scaling Feature

## Overview
Added the ability to resize the toolbar using up/down arrow buttons, and a draggable handle at the top of the toolbar for repositioning.

## Changes Made

### 1. Toolbar Scaling (`scripts/controller.js`)
Repurposed the up/down buttons (previously used for brush size) to control toolbar scale:

```javascript
let toolbarScale = 0.8;

// Apply initial scale on load
$(document).ready(() => {
    ipcRenderer.send("toolbarScale", toolbarScale);
});

$(".tool-item.stroke.increase").on("click", () => {
    if (toolbarScale < 1.5) {
        toolbarScale += 0.1;
        ipcRenderer.send("toolbarScale", toolbarScale);
    }
});
$(".tool-item.stroke.decrease").on("click", () => {
    if (toolbarScale > 0.5) {
        toolbarScale -= 0.1;
        ipcRenderer.send("toolbarScale", toolbarScale);
    }
});
```

### 2. Window Resize Handler (`index.js`)
Added IPC handler to resize the controller window based on scale factor:

```javascript
const baseControllerWidth = Math.floor(
    screen.getPrimaryDisplay().size.width * (1350 / 1920)
);
const baseControllerHeight = Math.floor(
    (((screen.getPrimaryDisplay().size.width * 1350) / 1920) * 1) / 11
);
ipcMain.on("toolbarScale", (e, scale) => {
    controller.setResizable(true);
    controller.setSize(
        Math.floor(baseControllerWidth * scale),
        Math.floor(baseControllerHeight * scale)
    );
    controller.setResizable(false);
});
```

### 3. Drag Handle (`controller.html`, `style.css`)
Added a draggable strip at the top of the toolbar for easy repositioning:

**HTML:**
```html
<body>
    <div class="drag-handle"></div>
    <div class="panel">
        ...
    </div>
</body>
```

**CSS:**
```css
.drag-handle {
    -webkit-app-region: drag;
    width: 100%;
    height: 5vh;
    background: linear-gradient(to bottom, rgba(80, 130, 160, 0.6), transparent);
    cursor: move;
    flex-shrink: 0;
}
```

### 4. Updated Button Titles (`controller.html`)
Changed tooltips from "increase/decrease stroke" to "Increase/Decrease toolbar size".

## Files Modified
| File | Changes |
|------|---------|
| `scripts/controller.js` | Toolbar scale logic, initial scale 0.8 |
| `index.js` | Window resize IPC handler |
| `controller.html` | Added drag handle, updated button titles |
| `style.css` | Drag handle styling, panel layout adjustments |

## Behavior
- **Scale range:** 0.5x to 1.5x (in 0.1 increments)
- **Default scale:** 0.8x (starts two steps smaller than full size)
- **Scaling method:** Window resize only (CSS vh/vw units scale proportionally)
- **Drag handle:** Click and drag the top strip to reposition the toolbar

## Why Window Resize Instead of CSS Transform?
Initially tried CSS `transform: scale()` but it caused clipping issues because the window bounds didn't match the scaled content. By resizing the window directly, the CSS viewport units (vh/vw) naturally scale all elements proportionally without clipping.
