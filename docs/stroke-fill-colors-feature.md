# Separate Stroke and Fill Colors

## Overview
Added the ability to independently select stroke and fill colors for shapes, including support for truly transparent fills to create unfilled/outline-only shapes.

## Changes Made

### 1. Fixed Transparent Color Bug (`scripts/board.js`)
The `applyOpacity` function was overwriting transparent colors with semi-transparent versions. Fixed to preserve fully transparent colors:

```javascript
function applyOpacity(hexColor) {
    // If color is fully transparent (ends with 00 alpha), keep it transparent
    if (hexColor.length === 9 && hexColor.slice(7, 9).toLowerCase() === '00') {
        return hexColor;
    }
    const alpha = Math.round(boardState.opacity * 255).toString(16).padStart(2, '0');
    const baseColor = hexColor.length === 9 ? hexColor.slice(0, 7) : hexColor;
    return baseColor + alpha;
}
```

### 2. Dual Color Indicators (`controller.html`)
Added two color indicators in the toolbar:
- **Fill indicator**: Solid colored box showing current fill color
- **Stroke indicator**: Ring/outline showing current stroke color

```html
<div class="color-main-container">
    <div class="tool-item color main fill" colorData="b4deff" title="Fill color (left-click colors)"></div>
    <div class="tool-item color main stroke-indicator" colorData="b4deff" title="Stroke color (right-click colors)"></div>
</div>
```

### 3. Color Selection Events (`scripts/controller.js`)
- **Left-click** on a color: Sets fill color
- **Right-click** on a color: Sets stroke color
- **Left-click transparent**: Sets fill to transparent (for unfilled shapes)
- **Right-click transparent**: Sets stroke to transparent

```javascript
// Left-click: set fill color
$(".tool-item.secondary.color:not(.custom):not(.transparent)").on("click", (e) => {
    // ... sets fill color
    ipcRenderer.send("colSelectFill", e.target.getAttribute("colorData"));
});

// Right-click: set stroke color
$(".tool-item.secondary.color:not(.custom):not(.transparent)").on("contextmenu", (e) => {
    e.preventDefault();
    // ... sets stroke color
    ipcRenderer.send("colSelectStroke", e.target.getAttribute("colorData"));
});
```

### 4. IPC Routing (`index.js`)
Added handler for `colSelectStroke` to route stroke color changes to the board:

```javascript
ipcMain.on("colSelectStroke", (e, arg) => {
    board.webContents.send("colSelectStroke", arg);
});
```

### 5. CSS Styling (`style.css`)
Added styles for the dual color indicator layout:

```css
.color-main-container {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2vh;
}

.tool-item.color.main.fill {
    background-color: var(--colFill, #b4deff);
}

.tool-item.color.main.stroke-indicator {
    background-color: transparent;
    border: 4vh solid var(--colStroke, #b4deff);
    box-sizing: border-box;
}
```

## Files Modified
| File | Changes |
|------|---------|
| `scripts/board.js` | Fixed applyOpacity to preserve transparent colors |
| `controller.html` | Added dual fill/stroke color indicators |
| `scripts/controller.js` | Left-click for fill, right-click for stroke |
| `index.js` | Added colSelectStroke IPC handler |
| `style.css` | Styling for dual color indicators |

## Usage
1. **Set fill color**: Left-click any color swatch
2. **Set stroke color**: Right-click any color swatch
3. **Transparent fill** (unfilled shapes): Left-click the checkered transparent button
4. **Transparent stroke**: Right-click the checkered transparent button

## Result
Users can now create:
- Shapes with different fill and stroke colors
- Unfilled shapes (stroke only) by setting fill to transparent
- Invisible strokes by setting stroke to transparent
