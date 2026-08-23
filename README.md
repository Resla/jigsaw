# Jigsaw

A browser-based jigsaw puzzle game. Pick an image, choose how many pieces, and solve it by dragging
pieces around — they snap together with their correct neighbors anywhere on the table, just like a
real jigsaw.

## Features

- Classic interlocking bump/socket piece shapes, cut with cubic-bezier tabs
- Custom piece-count slider (6–500) — the grid adapts to each image's aspect ratio
- Neighbor-relative snapping: connect matching pieces anywhere on the table; connected pieces drag
  as one group
- Curated image gallery (landscapes, animals, more)
- Timer, move counter, and a completion celebration
- Auto-saves progress to `localStorage` as you play, so reloading the page resumes where you left off

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Project structure

- `src/engine/` — pure, framework-free puzzle logic: piece-shape generation (`pieceShape.ts`,
  `generatePuzzle.ts`), grid sizing from a target piece count (`gridSize.ts`), connected-piece-group
  tracking (`unionFind.ts`, `connect.ts`), and `localStorage` persistence (`persistence.ts`).
- `src/state/usePuzzleStore.ts` — Zustand store holding the live puzzle state (piece positions,
  groups, moves, timer).
- `src/components/` — `PieceCanvas` (renders one clipped/cut piece), `PuzzleBoard` (drag handling
  and layout), `Timer`.
- `src/pages/` — `Home` (gallery + difficulty picker) and `Puzzle` (the game itself).
- `src/data/gallery.ts` — curated image metadata; images live in `public/images/`.

## Deploying

This is a fully static app (no backend). Any static host works — e.g. connect the repo to Vercel or
Netlify and use the default Vite build settings (`npm run build`, output directory `dist`).

## Future: multiplayer

Puzzle state is already a small, plain, serializable structure (piece positions + which group each
piece belongs to), so real-time collaborative solving could be added later without reworking the
rendering or piece-generation code: a small Node + Socket.io backend would create a "room" per
puzzle and relay the same move/connect actions between connected clients.
