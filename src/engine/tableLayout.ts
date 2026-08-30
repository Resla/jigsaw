import type { PieceDef } from './types';

/** Vertical breathing room around the centered board. */
export const TABLE_MARGIN_Y = 48;

/** Each side tray is this fraction of the image width (and at least this many px). */
const SIDE_TRAY_RATIO = 0.62;
const SIDE_TRAY_MIN = 300;

export function computeTableSize(imageWidth: number, imageHeight: number): {
  tableWidth: number;
  tableHeight: number;
} {
  const sideTray = Math.max(Math.round(imageWidth * SIDE_TRAY_RATIO), SIDE_TRAY_MIN);
  return {
    tableWidth: imageWidth + sideTray * 2,
    tableHeight: imageHeight + TABLE_MARGIN_Y * 2,
  };
}

export function computeGuide(
  imageWidth: number,
  imageHeight: number,
  tableWidth: number,
  tableHeight: number,
): { x: number; y: number; width: number; height: number } {
  return {
    x: (tableWidth - imageWidth) / 2,
    y: (tableHeight - imageHeight) / 2,
    width: imageWidth,
    height: imageHeight,
  };
}

function imageSizeFromPieces(pieces: PieceDef[]): { width: number; height: number } {
  let width = 0;
  let height = 0;
  for (const piece of pieces) {
    width = Math.max(width, piece.correctX + piece.cellWidth);
    height = Math.max(height, piece.correctY + piece.cellHeight);
  }
  return { width, height };
}

function randomInRange(min: number, max: number): number {
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}

/**
 * Deal loose pieces into the left and right trays so the center board stays clear.
 */
export function scatterBesideBoard(
  pieces: PieceDef[],
  tableWidth: number,
  tableHeight: number,
  rotationEnabled: boolean,
): Record<number, { x: number; y: number; rotation: number }> {
  const { width: imageWidth, height: imageHeight } = imageSizeFromPieces(pieces);
  const guide = computeGuide(imageWidth, imageHeight, tableWidth, tableHeight);
  const gap = 16;
  const pad = 10;

  const left: PieceDef[] = [];
  const right: PieceDef[] = [];
  const order = [...pieces];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  order.forEach((piece, i) => (i % 2 === 0 ? left : right).push(piece));

  const positions: Record<number, { x: number; y: number; rotation: number }> = {};

  const placeInTray = (piece: PieceDef, trayLeft: number, trayRight: number) => {
    const visualW = piece.bbox.width;
    const visualH = piece.bbox.height;
    const minVisualX = trayLeft + pad;
    const maxVisualX = trayRight - pad - visualW;
    const minVisualY = pad;
    const maxVisualY = tableHeight - pad - visualH;
    const visualX = randomInRange(minVisualX, maxVisualX);
    const visualY = randomInRange(minVisualY, maxVisualY);
    positions[piece.id] = {
      x: visualX - piece.bbox.x,
      y: visualY - piece.bbox.y,
      rotation: rotationEnabled ? Math.floor(Math.random() * 4) : 0,
    };
  };

  for (const piece of left) {
    placeInTray(piece, 0, guide.x - gap);
  }
  for (const piece of right) {
    placeInTray(piece, guide.x + guide.width + gap, tableWidth);
  }

  return positions;
}
