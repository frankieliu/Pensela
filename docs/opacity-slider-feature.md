# Opacity Slider Feature

A global opacity slider that controls transparency for all drawing tools.

## Overview

The opacity slider allows users to draw with semi-transparent colors, useful for:
- Highlighting without obscuring underlying content
- Layering colors
- Creating subtle annotations

## Location

The slider is positioned to the left of the brush preview circle in the toolbar.

## Files Modified

| File | Changes |
|------|---------|
| `controller.html` | Added opacity slider element |
| `style.css` | Added CSS for slider with gradient background |
| `scripts/controller.js` | Added slider input handler |
| `scripts/state.js` | Added `opacity` property and IPC listener |
| `scripts/board.js` | Added `applyOpacity()` helper, updated all drawing tools |
| `index.js` | Added IPC routing for opacity changes |

## How It Works

### Data Flow

1. User drags the opacity slider (0-100%)
2. `controller.js` converts to 0-1 range and sends `opacityChanged` IPC message
3. Main process routes to board window
4. `state.js` updates `boardState.opacity`
5. When drawing, `applyOpacity()` appends alpha hex to colors

### applyOpacity Helper Function

```javascript
function applyOpacity(hexColor) {
    // Convert opacity (0-1) to hex (00-ff)
    const alpha = Math.round(boardState.opacity * 255).toString(16).padStart(2, '0');
    // Strip existing alpha if 8-char hex, then append new alpha
    const baseColor = hexColor.length === 9 ? hexColor.slice(0, 7) : hexColor;
    return baseColor + alpha;
}
```

### Color Format

- Input: 6-char hex (`#b4deff`) or 8-char hex (`#b4deffaa`)
- Output: 8-char hex with opacity applied (`#b4deff80` for 50% opacity)

## Visual Design

- Slider track shows gradient from transparent to selected color
- White circular thumb for easy dragging
- Width matches brush preview for visual consistency

## Affected Tools

All drawing tools now respect the global opacity:
- Shapes: Rectangle, Circle, Triangle, Polygon
- Lines: Straight line, Freehand pen
- Stickers: Tick, Cross, Star, Arrows
- Highlighter (previously hardcoded at 40%, now uses global setting)
- Text

## Usage

1. Adjust slider to desired opacity (default: 100%)
2. Select any drawing tool
3. Draw - colors will have the selected transparency
4. Slider position persists across tool changes
