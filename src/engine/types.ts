export type EdgeSign = -1 | 0 | 1;

export interface PieceEdges {
  top: EdgeSign;
  right: EdgeSign;
  bottom: EdgeSign;
  left: EdgeSign;
}

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PieceDef {
  id: number;
  row: number;
  col: number;
  /** top-left position of this piece's plain cell (no tab overflow) when the puzzle is fully solved, in source-image pixels */
  correctX: number;
  correctY: number;
  cellWidth: number;
  cellHeight: number;
  edges: PieceEdges;
  /** SVG path string in canvas-local coordinates (already shifted so bbox.x/y = 0,0) */
  path: string;
  /** bounding box of the piece shape relative to the cell's top-left corner (can extend negative/beyond cell due to tabs) */
  bbox: BBox;
}

export interface GeneratedPuzzle {
  pieces: PieceDef[];
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  imageWidth: number;
  imageHeight: number;
}
