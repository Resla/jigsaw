import { generateEdgeGrids, edgesForPiece, buildPiecePath } from './pieceShape';
import type { GeneratedPuzzle, PieceDef } from './types';

export function generatePuzzle(
  imageWidth: number,
  imageHeight: number,
  rows: number,
  cols: number,
  seed: number,
): GeneratedPuzzle {
  const cellWidth = imageWidth / cols;
  const cellHeight = imageHeight / rows;
  const grids = generateEdgeGrids(rows, cols, seed);

  const pieces: PieceDef[] = [];
  let id = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const edges = edgesForPiece(row, col, rows, cols, grids);
      const { path, bbox } = buildPiecePath(cellWidth, cellHeight, edges, {
        top: row > 0 ? grids.vEdges[row - 1][col] : undefined,
        bottom: row < rows - 1 ? grids.vEdges[row][col] : undefined,
        left: col > 0 ? grids.hEdges[row][col - 1] : undefined,
        right: col < cols - 1 ? grids.hEdges[row][col] : undefined,
      });
      pieces.push({
        id: id++,
        row,
        col,
        correctX: col * cellWidth,
        correctY: row * cellHeight,
        cellWidth,
        cellHeight,
        edges,
        path,
        bbox,
      });
    }
  }

  return { pieces, rows, cols, cellWidth, cellHeight, imageWidth, imageHeight };
}
