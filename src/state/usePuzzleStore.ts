import { create } from 'zustand';
import type { PieceDef } from '../engine/types';
import { UnionFind } from '../engine/unionFind';
import { buildCellIndex, tryConnect, type Position } from '../engine/connect';
import {
  clearPersistedState,
  loadPersistedState,
  puzzleStorageKey,
  saveStateDebounced,
} from '../engine/persistence';
import { generatePuzzle } from '../engine/generatePuzzle';
import { hashSeed } from '../engine/random';
import { playRotateClick, playSnap, playSolveFanfare } from '../engine/sfx';

const DEFAULT_HINTS = 5;

interface LoadPuzzleArgs {
  imageId: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  rows: number;
  cols: number;
  tableWidth: number;
  tableHeight: number;
  rotationEnabled: boolean;
}

interface PuzzleStoreState {
  imageId: string | null;
  imageSrc: string | null;
  pieces: PieceDef[];
  pieceById: Map<number, PieceDef>;
  cellIndex: Map<string, number>;
  positions: Record<number, Position>;
  unionFind: UnionFind;
  groupVersion: number;
  moves: number;
  startedAt: number;
  solved: boolean;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  tableWidth: number;
  tableHeight: number;
  storageKey: string | null;
  rotationEnabled: boolean;
  hintsRemaining: number;
  hintPieceId: number | null;

  loadPuzzle: (args: LoadPuzzleArgs) => void;
  moveGroup: (pieceId: number, dx: number, dy: number) => void;
  commitDrag: (pieceId: number) => void;
  rotatePiece: (pieceId: number, direction: 1 | -1) => void;
  useHint: () => void;
  clearHint: () => void;
  reset: () => void;
  groupIdOf: (pieceId: number) => number;
  groupMembersOf: (pieceId: number) => number[];
}

function scatterPositions(
  pieces: PieceDef[],
  tableWidth: number,
  tableHeight: number,
  rotationEnabled: boolean,
): Record<number, Position> {
  const positions: Record<number, Position> = {};
  const rng = () => Math.random();
  for (const piece of pieces) {
    positions[piece.id] = {
      x: rng() * Math.max(1, tableWidth - piece.cellWidth),
      y: rng() * Math.max(1, tableHeight - piece.cellHeight),
      rotation: rotationEnabled ? Math.floor(rng() * 4) : 0,
    };
  }
  return positions;
}

/** Fills in a default rotation for legacy saves, and forces everything upright when rotation is off. */
function normalizeRotations(
  positions: Record<number, Position>,
  rotationEnabled: boolean,
): Record<number, Position> {
  const next: Record<number, Position> = {};
  for (const [id, pos] of Object.entries(positions)) {
    next[Number(id)] = { x: pos.x, y: pos.y, rotation: rotationEnabled ? pos.rotation ?? 0 : 0 };
  }
  return next;
}

export const usePuzzleStore = create<PuzzleStoreState>((set, get) => ({
  imageId: null,
  imageSrc: null,
  pieces: [],
  pieceById: new Map(),
  cellIndex: new Map(),
  positions: {},
  unionFind: new UnionFind(),
  groupVersion: 0,
  moves: 0,
  startedAt: Date.now(),
  solved: false,
  rows: 0,
  cols: 0,
  cellWidth: 0,
  cellHeight: 0,
  tableWidth: 0,
  tableHeight: 0,
  storageKey: null,
  rotationEnabled: false,
  hintsRemaining: DEFAULT_HINTS,
  hintPieceId: null,

  loadPuzzle: ({ imageId, imageSrc, imageWidth, imageHeight, rows, cols, tableWidth, tableHeight, rotationEnabled }) => {
    const seed = hashSeed(`${imageId}:${rows}x${cols}`);
    const generated = generatePuzzle(imageWidth, imageHeight, rows, cols, seed);
    const pieceById = new Map(generated.pieces.map((p) => [p.id, p]));
    const cellIndex = buildCellIndex(generated.pieces);
    const storageKey = puzzleStorageKey(imageId, rows, cols, seed);

    const unionFind = new UnionFind();
    for (const piece of generated.pieces) unionFind.makeSet(piece.id);

    const saved = loadPersistedState(storageKey);
    let positions: Record<number, Position>;
    let moves = 0;
    let solved = false;
    let startedAt = Date.now();

    if (saved && Object.keys(saved.positions).length === generated.pieces.length) {
      positions = normalizeRotations(saved.positions, rotationEnabled);
      moves = saved.moves;
      solved = saved.solved;
      startedAt = Date.now() - saved.elapsedMs;
      const uf = UnionFind.fromGroupMap(saved.groupMap);
      for (const piece of generated.pieces) uf.makeSet(piece.id);
      set({
        imageId,
        imageSrc,
        pieces: generated.pieces,
        pieceById,
        cellIndex,
        positions,
        unionFind: uf,
        groupVersion: get().groupVersion + 1,
        moves,
        startedAt,
        solved,
        rows,
        cols,
        cellWidth: generated.cellWidth,
        cellHeight: generated.cellHeight,
        tableWidth,
        tableHeight,
        storageKey,
        rotationEnabled,
        hintsRemaining: DEFAULT_HINTS,
        hintPieceId: null,
      });
      return;
    }

    positions = scatterPositions(generated.pieces, tableWidth, tableHeight, rotationEnabled);

    set({
      imageId,
      imageSrc,
      pieces: generated.pieces,
      pieceById,
      cellIndex,
      positions,
      unionFind,
      groupVersion: get().groupVersion + 1,
      moves,
      startedAt,
      solved,
      rows,
      cols,
      cellWidth: generated.cellWidth,
      cellHeight: generated.cellHeight,
      tableWidth,
      tableHeight,
      storageKey,
      rotationEnabled,
      hintsRemaining: DEFAULT_HINTS,
      hintPieceId: null,
    });
  },

  moveGroup: (pieceId, dx, dy) => {
    const { unionFind, positions } = get();
    const members = unionFind.groupMembers(pieceId);
    const next = { ...positions };
    for (const id of members) {
      next[id] = { ...positions[id], x: positions[id].x + dx, y: positions[id].y + dy };
    }
    set({ positions: next });
  },

  rotatePiece: (pieceId, direction) => {
    const { unionFind, positions, storageKey, moves, startedAt, pieces, rotationEnabled } = get();
    if (!rotationEnabled) return;
    if (unionFind.groupSize(pieceId) > 1) return; // locked once connected to another piece
    const pos = positions[pieceId];
    if (!pos) return;
    const nextRotation = ((pos.rotation + direction) % 4 + 4) % 4;
    const nextPositions = { ...positions, [pieceId]: { ...pos, rotation: nextRotation } };
    playRotateClick();
    set({ positions: nextPositions });

    if (storageKey) {
      const solved = unionFind.groupSize(pieceId) === pieces.length;
      saveStateDebounced(storageKey, {
        positions: nextPositions,
        groupMap: unionFind.toGroupMap(),
        moves,
        elapsedMs: Date.now() - startedAt,
        solved,
      });
    }
  },

  commitDrag: (pieceId) => {
    const { unionFind, positions, pieceById, cellIndex, pieces, cellWidth, cellHeight, storageKey, startedAt } =
      get();
    const wasSolvedBefore = get().solved;
    const tolerance = Math.min(cellWidth, cellHeight) * 0.26;
    const nextPositions = { ...positions };
    const connected = tryConnect(
      [pieceId],
      pieceById,
      cellIndex,
      nextPositions,
      unionFind,
      tolerance,
    );

    const solved = unionFind.groupSize(pieceId) === pieces.length;
    if (solved && !wasSolvedBefore) playSolveFanfare();
    else if (connected) playSnap();
    set((state) => ({
      positions: nextPositions,
      moves: state.moves + 1,
      groupVersion: connected ? state.groupVersion + 1 : state.groupVersion,
      solved,
    }));

    if (storageKey) {
      const { moves } = get();
      saveStateDebounced(storageKey, {
        positions: nextPositions,
        groupMap: unionFind.toGroupMap(),
        moves,
        elapsedMs: Date.now() - startedAt,
        solved,
      });
    }
  },

  useHint: () => {
    const { pieces, unionFind, hintsRemaining } = get();
    if (hintsRemaining <= 0 || pieces.length === 0) return;
    const total = pieces.length;
    const candidates = pieces.filter((p) => unionFind.groupSize(p.id) < total);
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    set({ hintPieceId: pick.id, hintsRemaining: hintsRemaining - 1 });
  },

  clearHint: () => set({ hintPieceId: null }),

  reset: () => {
    const { pieces, tableWidth, tableHeight, storageKey, rotationEnabled } = get();
    const unionFind = new UnionFind();
    for (const piece of pieces) unionFind.makeSet(piece.id);
    const positions = scatterPositions(pieces, tableWidth, tableHeight, rotationEnabled);
    if (storageKey) clearPersistedState(storageKey);
    set({
      unionFind,
      positions,
      groupVersion: get().groupVersion + 1,
      moves: 0,
      startedAt: Date.now(),
      solved: false,
      hintsRemaining: DEFAULT_HINTS,
      hintPieceId: null,
    });
  },

  groupIdOf: (pieceId) => get().unionFind.find(pieceId),
  groupMembersOf: (pieceId) => get().unionFind.groupMembers(pieceId),
}));
