import type { BBox, EdgeSign, PieceEdges } from './types';
import { mulberry32 } from './random';

interface EdgeSpec {
  sign: EdgeSign;
  /** 0..1, how far along the edge the tab is centered (jittered around 0.5) */
  position: number;
  /** relative jitter on tab size, ~0.85..1.15 */
  sizeJitter: number;
}

/** horizontal boundaries: hEdges[row][col] = boundary between piece[row][col] and piece[row][col+1] */
export type HEdgeGrid = EdgeSpec[][];
/** vertical boundaries: vEdges[row][col] = boundary between piece[row][col] and piece[row+1][col] */
export type VEdgeGrid = EdgeSpec[][];

export interface EdgeGrids {
  hEdges: HEdgeGrid;
  vEdges: VEdgeGrid;
}

function randomEdgeSpec(rng: () => number): EdgeSpec {
  return {
    sign: rng() < 0.5 ? 1 : -1,
    position: 0.5 + (rng() - 0.5) * 0.16,
    sizeJitter: 0.85 + rng() * 0.3,
  };
}

/** Builds the shared tab/slot definitions for every interior edge of the grid, deterministically from a seed. */
export function generateEdgeGrids(rows: number, cols: number, seed: number): EdgeGrids {
  const rng = mulberry32(seed);
  const hEdges: HEdgeGrid = [];
  for (let r = 0; r < rows; r++) {
    const line: EdgeSpec[] = [];
    for (let c = 0; c < cols - 1; c++) line.push(randomEdgeSpec(rng));
    hEdges.push(line);
  }
  const vEdges: VEdgeGrid = [];
  for (let r = 0; r < rows - 1; r++) {
    const line: EdgeSpec[] = [];
    for (let c = 0; c < cols; c++) line.push(randomEdgeSpec(rng));
    vEdges.push(line);
  }
  return { hEdges, vEdges };
}

export function edgesForPiece(
  row: number,
  col: number,
  rows: number,
  cols: number,
  grids: EdgeGrids,
): PieceEdges {
  const top: EdgeSign = row > 0 ? (-grids.vEdges[row - 1][col].sign as EdgeSign) : 0;
  const bottom: EdgeSign = row < rows - 1 ? grids.vEdges[row][col].sign : 0;
  const left: EdgeSign = col > 0 ? (-grids.hEdges[row][col - 1].sign as EdgeSign) : 0;
  const right: EdgeSign = col < cols - 1 ? grids.hEdges[row][col].sign : 0;
  return { top, right, bottom, left };
}

const BORDER_LENGTH = 1 / 3; // fraction of the tab-axis length reserved for the straight edge segments
const INSERT_DEPTH = 0.8; // how far the tab bulges out, relative to its own diameter

/**
 * Builds a closed SVG path (clockwise, starting at top-left corner) for one piece, using
 * cubic-bezier tabs/slots. Coordinates are in canvas-local space (already shifted by -bbox.x/-bbox.y).
 */
export function buildPiecePath(
  cellWidth: number,
  cellHeight: number,
  edges: PieceEdges,
  neighborSpec: { top?: EdgeSpec; right?: EdgeSpec; bottom?: EdgeSpec; left?: EdgeSpec },
): { path: string; bbox: BBox } {
  const r = Math.min(cellWidth, cellHeight) * (1 - 2 * BORDER_LENGTH);
  const o = r * INSERT_DEPTH;

  // Allow the tab to be centered anywhere within the middle band of the edge (jittered).
  const topPos = neighborSpec.top?.position ?? 0.5;
  const bottomPos = neighborSpec.bottom?.position ?? 0.5;
  const leftPos = neighborSpec.left?.position ?? 0.5;
  const rightPos = neighborSpec.right?.position ?? 0.5;

  const topSize = r * (neighborSpec.top?.sizeJitter ?? 1);
  const bottomSize = r * (neighborSpec.bottom?.sizeJitter ?? 1);
  const leftSize = r * (neighborSpec.left?.sizeJitter ?? 1);
  const rightSize = r * (neighborSpec.right?.sizeJitter ?? 1);

  // Insert span start/end along each axis, using that edge's own jittered position/size.
  const topStart = cellWidth * topPos - topSize / 2;
  const topEnd = cellWidth * topPos + topSize / 2;
  const bottomStart = cellWidth * bottomPos - bottomSize / 2;
  const bottomEnd = cellWidth * bottomPos + bottomSize / 2;
  const leftStart = cellHeight * leftPos - leftSize / 2;
  const leftEnd = cellHeight * leftPos + leftSize / 2;
  const rightStart = cellHeight * rightPos - rightSize / 2;
  const rightEnd = cellHeight * rightPos + rightSize / 2;

  const oTop = edges.top * o * (neighborSpec.top?.sizeJitter ?? 1);
  const oBottom = edges.bottom * o * (neighborSpec.bottom?.sizeJitter ?? 1);
  const oLeft = edges.left * o * (neighborSpec.left?.sizeJitter ?? 1);
  const oRight = edges.right * o * (neighborSpec.right?.sizeJitter ?? 1);

  const p = (x: number, y: number) => `${round(x)},${round(y)}`;

  const path =
    `M ${p(0, 0)} ` +
    // top edge (left -> right), outward = -y
    `L ${p(topStart, 0)} ` +
    `C ${p(topStart, -oTop)} ${p(topEnd, -oTop)} ${p(topEnd, 0)} ` +
    `L ${p(cellWidth, 0)} ` +
    // right edge (top -> bottom), outward = +x
    `L ${p(cellWidth, rightStart)} ` +
    `C ${p(cellWidth + oRight, rightStart)} ${p(cellWidth + oRight, rightEnd)} ${p(cellWidth, rightEnd)} ` +
    `L ${p(cellWidth, cellHeight)} ` +
    // bottom edge (right -> left), outward = +y
    `L ${p(bottomEnd, cellHeight)} ` +
    `C ${p(bottomEnd, cellHeight + oBottom)} ${p(bottomStart, cellHeight + oBottom)} ${p(bottomStart, cellHeight)} ` +
    `L ${p(0, cellHeight)} ` +
    // left edge (bottom -> top), outward = -x
    `L ${p(0, leftEnd)} ` +
    `C ${p(oLeft * -1, leftEnd)} ${p(oLeft * -1, leftStart)} ${p(0, leftStart)} ` +
    `Z`;

  const margin = 1.1; // small safety margin beyond the curve's true max deviation
  const topOverflow = edges.top === 1 ? Math.abs(oTop) * margin : 0;
  const bottomOverflow = edges.bottom === 1 ? Math.abs(oBottom) * margin : 0;
  const leftOverflow = edges.left === 1 ? Math.abs(oLeft) * margin : 0;
  const rightOverflow = edges.right === 1 ? Math.abs(oRight) * margin : 0;

  const bbox: BBox = {
    x: -leftOverflow,
    y: -topOverflow,
    width: cellWidth + leftOverflow + rightOverflow,
    height: cellHeight + topOverflow + bottomOverflow,
  };

  // Shift the path so it's expressed relative to bbox.x/bbox.y (canvas-local coordinates).
  const shifted = shiftPath(path, -bbox.x, -bbox.y);
  return { path: shifted, bbox };
}

function shiftPath(path: string, dx: number, dy: number): string {
  if (dx === 0 && dy === 0) return path;
  return path.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_match, x, y) => {
    return `${round(Number(x) + dx)},${round(Number(y) + dy)}`;
  });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
