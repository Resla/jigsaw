/**
 * Turns a user-chosen target piece count into a concrete rows x cols grid that
 * roughly matches the image's aspect ratio (so pieces stay close to square).
 */
export function computeGridSize(
  targetCount: number,
  aspectRatio: number,
): { rows: number; cols: number } {
  const clamped = Math.max(4, Math.min(1000, Math.round(targetCount)));
  let cols = Math.max(1, Math.round(Math.sqrt(clamped * aspectRatio)));
  let rows = Math.max(1, Math.round(clamped / cols));

  // Nudge away from degenerate 1xN / Nx1 grids for small counts.
  if (rows === 1 && cols > 4) {
    rows = 2;
    cols = Math.max(1, Math.round(clamped / rows));
  }
  if (cols === 1 && rows > 4) {
    cols = 2;
    rows = Math.max(1, Math.round(clamped / cols));
  }

  return { rows, cols };
}
