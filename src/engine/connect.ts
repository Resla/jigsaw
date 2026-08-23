import type { PieceDef } from './types';
import { UnionFind } from './unionFind';

export interface Position {
  x: number;
  y: number;
  /** 0..3, meaning 0/90/180/270 degrees clockwise. Pieces can only connect when both are at 0 (upright). */
  rotation: number;
}

/**
 * Looks at every piece adjacent (in the solved grid) to any of `movedPieceIds` that currently
 * belongs to a different group, and connects it if it's close enough to its correct relative
 * offset. Mutates `positions` (to snap perfectly) and `unionFind` (to merge groups) in place.
 *
 * Returns true if at least one new connection was made.
 */
export interface SnapPull {
  errorX: number;
  errorY: number;
  distance: number;
  neighborId: number;
}

/**
 * Finds the nearest valid neighbor lock for the moved group. Used both to snap on drop
 * and to magnetically pull pieces together while dragging — the last few millimetres
 * of a real jigsaw click.
 */
export function findBestSnap(
  movedPieceIds: number[],
  pieceById: Map<number, PieceDef>,
  cellIndex: Map<string, number>,
  positions: Record<number, Position>,
  unionFind: UnionFind,
  radius: number,
): SnapPull | null {
  let best: SnapPull | null = null;

  for (const pieceId of movedPieceIds) {
    const piece = pieceById.get(pieceId);
    if (!piece) continue;
    const pos = positions[pieceId];
    if (!pos || pos.rotation !== 0) continue;

    const neighborOffsets: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of neighborOffsets) {
      const neighborId = cellIndex.get(`${piece.row + dr}:${piece.col + dc}`);
      if (neighborId === undefined) continue;
      if (unionFind.connected(pieceId, neighborId)) continue;

      const neighborPos = positions[neighborId];
      if (!neighborPos || neighborPos.rotation !== 0) continue;

      const neighbor = pieceById.get(neighborId);
      if (!neighbor) continue;

      const expectedDx = neighbor.correctX - piece.correctX;
      const expectedDy = neighbor.correctY - piece.correctY;
      const errorX = neighborPos.x - pos.x - expectedDx;
      const errorY = neighborPos.y - pos.y - expectedDy;
      const distance = Math.hypot(errorX, errorY);

      if (distance <= radius && (!best || distance < best.distance)) {
        best = { errorX, errorY, distance, neighborId };
      }
    }
  }

  return best;
}

export function tryConnect(
  movedPieceIds: number[],
  pieceById: Map<number, PieceDef>,
  cellIndex: Map<string, number>,
  positions: Record<number, Position>,
  unionFind: UnionFind,
  tolerance: number,
): boolean {
  let didConnect = false;
  const queue = [...movedPieceIds];
  const seen = new Set<number>();

  while (queue.length > 0) {
    const pieceId = queue.shift()!;
    if (seen.has(pieceId)) continue;
    seen.add(pieceId);
    const piece = pieceById.get(pieceId);
    if (!piece) continue;

    const neighborOffsets: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of neighborOffsets) {
      const neighborId = cellIndex.get(`${piece.row + dr}:${piece.col + dc}`);
      if (neighborId === undefined) continue;
      if (unionFind.connected(pieceId, neighborId)) continue;

      const pos = positions[pieceId];
      const neighborPos = positions[neighborId];
      // Pieces must both be upright to interlock — rotation is otherwise untouched by connecting.
      if (pos.rotation !== 0 || neighborPos.rotation !== 0) continue;

      const neighbor = pieceById.get(neighborId)!;
      const expectedDx = neighbor.correctX - piece.correctX;
      const expectedDy = neighbor.correctY - piece.correctY;

      const actualDx = neighborPos.x - pos.x;
      const actualDy = neighborPos.y - pos.y;

      const errorX = actualDx - expectedDx;
      const errorY = actualDy - expectedDy;

      if (Math.abs(errorX) <= tolerance && Math.abs(errorY) <= tolerance) {
        // Snap the moved piece's whole group by (errorX, errorY) so it lines up exactly.
        const movingGroup = unionFind.groupMembers(pieceId);
        for (const memberId of movingGroup) {
          positions[memberId] = {
            ...positions[memberId],
            x: positions[memberId].x + errorX,
            y: positions[memberId].y + errorY,
          };
        }
        unionFind.union(pieceId, neighborId);
        didConnect = true;

        // Re-check this piece and the newly joined neighbor for further cascading connections.
        seen.delete(pieceId);
        queue.push(pieceId, neighborId);
      }
    }
  }

  return didConnect;
}

export interface JoinedSides {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export function getJoinedSides(
  piece: PieceDef,
  cellIndex: Map<string, number>,
  unionFind: UnionFind,
): JoinedSides {
  const neighbor = (dr: number, dc: number): boolean => {
    const id = cellIndex.get(`${piece.row + dr}:${piece.col + dc}`);
    return id !== undefined && unionFind.connected(piece.id, id);
  };
  return {
    top: neighbor(-1, 0),
    right: neighbor(0, 1),
    bottom: neighbor(1, 0),
    left: neighbor(0, -1),
  };
}

export function buildCellIndex(pieces: PieceDef[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const piece of pieces) map.set(`${piece.row}:${piece.col}`, piece.id);
  return map;
}
