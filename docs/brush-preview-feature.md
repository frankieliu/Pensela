# Brush Preview Feature

A visual circle indicator in the toolbar that shows the current brush/stroke size.

## Overview

The brush preview displays a colored circle that:
- Reflects the current stroke width (5px - 30px)
- Uses the currently selected color
- Animates smoothly when size changes

## Location

The brush preview circle is positioned to the left of the alt-controls (undo/redo, stroke +/-, exit, minimize) in the toolbar.

## Files Modified

| File | Changes |
|------|---------|
| `controller.html` | Added `.brush-preview` element before alt-controls |
| `style.css` | Added CSS for circle indicator with CSS variable `--brush-size` |
| `scripts/controller.js` | Added IPC listener to update circle size |
| `scripts/state.js` | Added IPC broadcast after stroke width changes |
| `index.js` | Added IPC routing from board → controller |

## How It Works

### Data Flow

1. User clicks ▲/▼ buttons in the toolbar
2. `controller.js` sends `strokeIncrease`/`strokeDecrease` to main process
3. Main process (`index.js`) forwards to board window
4. `state.js` updates `boardState.strokeWidth` and sends `strokeWidthChanged` back
5. Main process routes `strokeWidthChanged` to controller window
6. `controller.js` updates the `--brush-size` CSS variable
7. CSS transition animates the circle to the new size

### CSS Implementation

The circle uses a CSS custom property for dynamic sizing:

```css
.brush-preview {
    width: 50vh;
    height: 50vh;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.brush-preview::before {
    content: "";
    width: var(--brush-size, 10px);
    height: var(--brush-size, 10px);
    background-color: var(--colSelect, #b4deff);
    border-radius: 50%;
    transition: width 0.15s ease-out, height 0.15s ease-out;
}
```

### IPC Messages

| Message | Direction | Purpose |
|---------|-----------|---------|
| `strokeIncrease` | controller → main → board | Increase stroke width |
| `strokeDecrease` | controller → main → board | Decrease stroke width |
| `strokeWidthChanged` | board → main → controller | Sync new width to UI |

## Stroke Width Limits

- **Default**: 10px
- **Minimum**: 5px
- **Maximum**: 30px
- **Increment**: 5px per click
