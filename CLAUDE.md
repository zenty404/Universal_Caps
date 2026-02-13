# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Universal Caps is a browser-based incremental (clicker) game inspired by Universal Paperclips. The player manufactures caps, manages supply/demand economics, automates production, and unlocks IT resources. It is a static web app (HTML/CSS/vanilla JS) with no build step, no framework, and no backend.

## Running the Project

ES6 modules require a local server (CORS blocks direct `file://` loading):

```bash
python -m http.server
# Then open http://localhost:8000
```

Or use VS Code's "Live Server" extension. There is no build, lint, or test command.

## Architecture

Four ES6 modules under `js/`, loaded via `<script type="module">` from `index.html`:

- **`state.js`** — Single exported `state` object (the sole source of truth). All game data lives here. The `reached` field is a `Set`; `milestones` is a static array.
- **`actions.js`** — All game logic: player actions (make caps, buy items, adjust price), automatic loops (production, selling, ops generation), demand calculation, milestone/trust checks, and project unlocks. Imports `state` and calls `ui.js` functions for display updates.
- **`ui.js`** — DOM manipulation only. Exports `updateAllDisplays()`, `updateButtons()`, `showTerminalMessage()`, section visibility toggles (`unlockITResources`/`hideITResources`), and individual display updaters.
- **`storage.js`** — `localStorage`-based save/load/reset. Saves each state field individually (not as a JSON blob). The `reached` Set is serialized via `JSON.stringify([...state.reached])`. Elapsed play time is accumulated across sessions.
- **`main.js`** — Entry point. Loads saved state, wires button click listeners, and starts four `setInterval` loops:
  - 1s: `autoGenerateCaps()` + `autoSell()`
  - 1s: `processOps()` + `checkProjects()`
  - 200ms: `calculatePublicDemand()` + `updateButtons()`
  - 5s: `saveGame()`

## Key Design Patterns

- **Price lives in the DOM**: The current price is read from `#margin` span's `textContent` (not from `state`). Same for `#demand`. Any price/demand logic must read/write through the DOM element.
- **No state for price/demand**: `lowerPrice`, `raisePrice`, `autoSell`, and `calculatePublicDemand` all parse the displayed value. This is intentional but means price is not persisted across sessions.
- **Integer display for caps/unsold**: `Math.floor()` is applied when displaying `caps` and `unsold` to avoid fractional counts from `autoCapserPerformance` multipliers.
- **Visibility gating**: IT Resources panel appears at 100 caps; "Improved AutoCapsers" project button appears at 10,000 caps and costs 500 ops.

## Language

Code comments and the README are in French. The game UI is in English.
