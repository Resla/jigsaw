import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePuzzleStore } from '../state/usePuzzleStore';
import { PieceCanvas } from './PieceCanvas';
import type { PieceDef } from '../engine/types';
import { findBestSnap, getJoinedSides, type Position } from '../engine/connect';

interface PuzzleBoardProps {
  pieces: PieceDef[];
  image: HTMLImageElement;
  tableWidth: number;
  tableHeight: number;
  guide: { x: number; y: number; width: number; height: number };
  rotationEnabled: boolean;
}

const HINT_DURATION_MS = 3200;

interface DragState {
  pieceId: number;
  memberIds: number[];
  startClientX: number;
  startClientY: number;
  scale: number;
  originalPositions: Map<number, Position>;
  smoothedDx: number;
  smoothedDy: number;
}

/** Below this on-screen movement, a press is treated as a tap (rotate) rather than a drag (move). */
const TAP_THRESHOLD_PX = 4;

interface View {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 0.12;
const MAX_SCALE = 3;
const FIT_PADDING = 32;
const PINCH_MIN_DISTANCE = 8;
const LARGE_RESIZE_RATIO = 0.2;
const COARSE_ZOOM_STEP = 1.4;
const FINE_ZOOM_STEP = 1.25;

function pointerDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function PuzzleBoard({
  pieces,
  image,
  tableWidth,
  tableHeight,
  guide,
  rotationEnabled,
}: PuzzleBoardProps) {
  const positions = usePuzzleStore((s) => s.positions);
  const moveGroup = usePuzzleStore((s) => s.moveGroup);
  const commitDrag = usePuzzleStore((s) => s.commitDrag);
  const rotatePiece = usePuzzleStore((s) => s.rotatePiece);
  const groupMembersOf = usePuzzleStore((s) => s.groupMembersOf);
  const hintPieceId = usePuzzleStore((s) => s.hintPieceId);
  const clearHint = usePuzzleStore((s) => s.clearHint);
  const unionFind = usePuzzleStore((s) => s.unionFind);
  const cellIndex = usePuzzleStore((s) => s.cellIndex);
  const cellWidth = usePuzzleStore((s) => s.cellWidth);
  const cellHeight = usePuzzleStore((s) => s.cellHeight);
  const groupVersion = usePuzzleStore((s) => s.groupVersion);
  const [liftedIds, setLiftedIds] = useState<Set<number>>(new Set());
  const [lockingIds, setLockingIds] = useState<Set<number>>(new Set());
  const [snappedIds, setSnappedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (hintPieceId === null) return;
    const timer = setTimeout(clearHint, HINT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [hintPieceId, clearHint]);

  const hintedPiece = hintPieceId !== null ? pieces.find((p) => p.id === hintPieceId) ?? null : null;

  const pieceById = useMemo(() => new Map(pieces.map((p) => [p.id, p])), [pieces]);
  const joinedById = useMemo(() => {
    const map = new Map<number, ReturnType<typeof getJoinedSides>>();
    for (const piece of pieces) map.set(piece.id, getJoinedSides(piece, cellIndex, unionFind));
    return map;
  }, [pieces, cellIndex, unionFind, groupVersion]);
  const elementRefs = useRef(new Map<number, HTMLDivElement>());
  const dragRef = useRef<DragState | null>(null);
  const panRef = useRef<{ startClientX: number; startClientY: number; startX: number; startY: number } | null>(
    null,
  );
  const frontCounter = useRef(1);
  const [zIndices, setZIndices] = useState<Map<number, number>>(new Map());

  const viewportRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  const [isPanning, setIsPanning] = useState(false);
  const userAdjustedViewRef = useRef(false);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    startDistance: number;
    startScale: number;
    startX: number;
    startY: number;
    startMidX: number;
    startMidY: number;
  } | null>(null);
  const pieceByIdRef = useRef(pieceById);
  pieceByIdRef.current = pieceById;
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const markUserAdjusted = useCallback(() => {
    userAdjustedViewRef.current = true;
  }, []);

  const zoomStep = useMemo(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
        ? COARSE_ZOOM_STEP
        : FINE_ZOOM_STEP,
    [],
  );

  const fitToScreen = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || tableWidth === 0 || tableHeight === 0) return;
    const { clientWidth, clientHeight } = viewport;
    if (clientWidth === 0 || clientHeight === 0) return;
    const scaleX = (clientWidth - FIT_PADDING * 2) / tableWidth;
    const scaleY = (clientHeight - FIT_PADDING * 2) / tableHeight;
    const scale = clamp(Math.min(scaleX, scaleY), MIN_SCALE, 1);
    const x = (clientWidth - tableWidth * scale) / 2;
    const y = (clientHeight - tableHeight * scale) / 2;
    setView({ scale, x, y });
  }, [tableWidth, tableHeight]);

  const handleFitToScreen = useCallback(() => {
    userAdjustedViewRef.current = false;
    fitToScreen();
  }, [fitToScreen]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let didInitialFit = false;
    let lastW = 0;
    let lastH = 0;

    const maybeFit = (force: boolean) => {
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      if (w === 0 || h === 0) return;

      const grewFromZero = lastW === 0 || lastH === 0;
      const largeChange =
        lastW > 0 &&
        lastH > 0 &&
        (Math.abs(w - lastW) / lastW > LARGE_RESIZE_RATIO || Math.abs(h - lastH) / lastH > LARGE_RESIZE_RATIO);
      lastW = w;
      lastH = h;

      if (!didInitialFit || grewFromZero) {
        didInitialFit = true;
        userAdjustedViewRef.current = false;
        fitToScreen();
        return;
      }

      if (force || largeChange) {
        userAdjustedViewRef.current = false;
        fitToScreen();
        return;
      }

      // URL-bar / visual-viewport jitter: keep a fitted board until the user zooms or pans.
      if (!userAdjustedViewRef.current) fitToScreen();
    };

    maybeFit(false);

    const observer = new ResizeObserver(() => maybeFit(false));
    observer.observe(viewport);

    const forceFit = () => maybeFit(true);
    window.addEventListener('orientationchange', forceFit);
    const orientation = window.screen?.orientation;
    orientation?.addEventListener?.('change', forceFit);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', forceFit);
      orientation?.removeEventListener?.('change', forceFit);
    };
  }, [fitToScreen]);

  // Non-passive wheel listener so we can preventDefault (React's onWheel is passive by default).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const prev = viewRef.current;
      const zoomFactor = Math.exp(-e.deltaY * 0.0012);
      const nextScale = clamp(prev.scale * zoomFactor, MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / prev.scale;
      const nextX = cursorX - (cursorX - prev.x) * ratio;
      const nextY = cursorY - (cursorY - prev.y) * ratio;
      userAdjustedViewRef.current = true;
      setView({ scale: nextScale, x: nextX, y: nextY });
    };
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const restoreDraggedPieces = () => {
      const drag = dragRef.current;
      if (!drag) return;
      const byId = pieceByIdRef.current;
      for (const id of drag.memberIds) {
        const orig = drag.originalPositions.get(id);
        const piece = byId.get(id);
        const el = elementRefs.current.get(id);
        if (orig && piece && el) {
          el.style.transform = `translate3d(${orig.x + piece.bbox.x}px, ${orig.y + piece.bbox.y}px, 0) rotate(${orig.rotation * 90}deg)`;
        }
      }
      dragRef.current = null;
      setLiftedIds(new Set());
      setLockingIds(new Set());
    };

    const beginPinch = () => {
      const pts = [...pointersRef.current.values()];
      if (pts.length < 2) return;
      const dist = pointerDistance(pts[0], pts[1]);
      if (dist < PINCH_MIN_DISTANCE) return;
      const rect = viewport.getBoundingClientRect();
      const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
      const midY = (pts[0].y + pts[1].y) / 2 - rect.top;
      const prev = viewRef.current;
      pinchRef.current = {
        startDistance: dist,
        startScale: prev.scale,
        startX: prev.x,
        startY: prev.y,
        startMidX: midX,
        startMidY: midY,
      };
      userAdjustedViewRef.current = true;
    };

    const cancelOneFingerGestures = () => {
      panRef.current = null;
      setIsPanning(false);
      restoreDraggedPieces();
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.board-toolbar')) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size >= 2) {
        cancelOneFingerGestures();
        beginPinch();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size < 2) return;
      if (!pinchRef.current) beginPinch();
      const pinch = pinchRef.current;
      if (!pinch) return;
      const pts = [...pointersRef.current.values()];
      const dist = pointerDistance(pts[0], pts[1]);
      if (dist < PINCH_MIN_DISTANCE) return;
      const rect = viewport.getBoundingClientRect();
      const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
      const midY = (pts[0].y + pts[1].y) / 2 - rect.top;
      const nextScale = clamp(pinch.startScale * (dist / pinch.startDistance), MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / pinch.startScale;
      setView({
        scale: nextScale,
        x: midX - (pinch.startMidX - pinch.startX) * ratio,
        y: midY - (pinch.startMidY - pinch.startY) * ratio,
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;
    };

    viewport.addEventListener('pointerdown', onPointerDown, { capture: true });
    // Move/up on window so a pinch continues if a finger slides off the board.
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const cursorX = viewport.clientWidth / 2;
    const cursorY = viewport.clientHeight / 2;
    markUserAdjusted();
    setView((prev) => {
      const nextScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / prev.scale;
      return {
        scale: nextScale,
        x: cursorX - (cursorX - prev.x) * ratio,
        y: cursorY - (cursorY - prev.y) * ratio,
      };
    });
  }, [markUserAdjusted]);

  const registerRef = useCallback((pieceId: number, el: HTMLDivElement | null) => {
    if (el) elementRefs.current.set(pieceId, el);
    else elementRefs.current.delete(pieceId);
  }, []);

  const handleViewportPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Pieces call stopPropagation on their own pointerdown, so reaching here means empty background.
    if (pointersRef.current.size >= 2 || pinchRef.current) return;
    if ((e.target as HTMLElement).closest('.board-toolbar')) return;
    const startX = viewRef.current.x;
    const startY = viewRef.current.y;
    panRef.current = { startClientX: e.clientX, startClientY: e.clientY, startX, startY };
    setIsPanning(true);
    markUserAdjusted();

    const handleMove = (ev: PointerEvent) => {
      const pan = panRef.current;
      if (!pan || pinchRef.current) return;
      setView((prev) => ({
        ...prev,
        x: pan.startX + (ev.clientX - pan.startClientX),
        y: pan.startY + (ev.clientY - pan.startClientY),
      }));
    };
    const handleUp = () => {
      panRef.current = null;
      setIsPanning(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [markUserAdjusted]);

  const handlePiecePointerDown = useCallback(
    (pieceId: number, e: React.PointerEvent<HTMLDivElement>) => {
      // Right-click is handled exclusively by onContextMenu (rotate the other way); if we let it
      // also fall through to the tap-to-rotate logic below, the two rotations would cancel out.
      if (e.button === 2) return;
      if (pointersRef.current.size >= 2 || pinchRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const memberIds = groupMembersOf(pieceId);
      const currentPositions = usePuzzleStore.getState().positions;
      const originalPositions = new Map<number, Position>();
      for (const id of memberIds) originalPositions.set(id, currentPositions[id]);

      dragRef.current = {
        pieceId,
        memberIds,
        startClientX: e.clientX,
        startClientY: e.clientY,
        scale: viewRef.current.scale,
        originalPositions,
        smoothedDx: 0,
        smoothedDy: 0,
      };

      setLiftedIds(new Set(memberIds));
      setZIndices((prev) => {
        const next = new Map(prev);
        for (const id of memberIds) next.set(id, 10000);
        return next;
      });

      const magnetRadius = Math.min(cellWidth, cellHeight) * 0.48;
      const lockRadius = Math.min(cellWidth, cellHeight) * 0.26;

      const pulledDelta = (pointerDx: number, pointerDy: number) => {
        const tentative: Record<number, Position> = { ...usePuzzleStore.getState().positions };
        for (const id of memberIds) {
          const orig = originalPositions.get(id);
          if (orig) tentative[id] = { ...orig, x: orig.x + pointerDx, y: orig.y + pointerDy };
        }
        const snap = findBestSnap(
          memberIds,
          pieceById,
          cellIndex,
          tentative,
          usePuzzleStore.getState().unionFind,
          magnetRadius,
        );
        if (!snap) return { dx: pointerDx, dy: pointerDy, locking: false, neighborId: null as number | null };
        const range = Math.max(1, magnetRadius - lockRadius);
        const falloff = Math.max(0, 1 - (snap.distance - lockRadius) / range);
        const t = snap.distance <= lockRadius ? 1 : Math.pow(falloff, 1.35) * 0.78;
        return {
          dx: pointerDx + snap.errorX * t,
          dy: pointerDy + snap.errorY * t,
          locking: snap.distance <= lockRadius,
          neighborId: snap.neighborId,
        };
      };

      const applyDragTransform = (dx: number, dy: number) => {
        for (const id of memberIds) {
          const orig = originalPositions.get(id);
          const piece = pieceById.get(id);
          const el = elementRefs.current.get(id);
          if (orig && piece && el) {
            el.style.transform = `translate3d(${orig.x + dx + piece.bbox.x}px, ${orig.y + dy + piece.bbox.y}px, 0) rotate(${orig.rotation * 90}deg)`;
          }
        }
      };

      const handleMove = (ev: PointerEvent) => {
        const drag = dragRef.current;
        if (!drag || pinchRef.current || pointersRef.current.size >= 2) return;
        const rawDx = (ev.clientX - drag.startClientX) / drag.scale;
        const rawDy = (ev.clientY - drag.startClientY) / drag.scale;
        const pulled = pulledDelta(rawDx, rawDy);
        const blend = pulled.locking ? 0.55 : 0.28;
        drag.smoothedDx += (pulled.dx - drag.smoothedDx) * blend;
        drag.smoothedDy += (pulled.dy - drag.smoothedDy) * blend;
        applyDragTransform(drag.smoothedDx, drag.smoothedDy);

        const nextLock = new Set<number>();
        if (pulled.locking) {
          for (const id of memberIds) nextLock.add(id);
          if (pulled.neighborId !== null) {
            for (const id of usePuzzleStore.getState().groupMembersOf(pulled.neighborId)) nextLock.add(id);
          }
        }
        setLockingIds((prev) => {
          if (prev.size === nextLock.size && [...nextLock].every((id) => prev.has(id))) return prev;
          return nextLock;
        });
      };

      const handleUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        const drag = dragRef.current;
        dragRef.current = null;
        if (!drag) return;

        const screenDx = ev.clientX - drag.startClientX;
        const screenDy = ev.clientY - drag.startClientY;
        const rawDx = screenDx / drag.scale;
        const rawDy = screenDy / drag.scale;
        const pulled = pulledDelta(rawDx, rawDy);
        const commitDx = drag.smoothedDx || pulled.dx;
        const commitDy = drag.smoothedDy || pulled.dy;
        const front = frontCounter.current++;
        const versionBefore = usePuzzleStore.getState().groupVersion;

        if (Math.abs(screenDx) > TAP_THRESHOLD_PX || Math.abs(screenDy) > TAP_THRESHOLD_PX) {
          moveGroup(drag.pieceId, commitDx, commitDy);
          commitDrag(drag.pieceId);
          if (usePuzzleStore.getState().groupVersion !== versionBefore) {
            const seated = new Set(usePuzzleStore.getState().groupMembersOf(drag.pieceId));
            setSnappedIds(seated);
            window.setTimeout(() => setSnappedIds(new Set()), 340);
            try {
              navigator.vibrate?.(14);
            } catch {
              // ignore
            }
          }
        } else if (rotationEnabled) {
          rotatePiece(drag.pieceId, 1);
        }

        setLockingIds(new Set());
        setLiftedIds(new Set());
        setZIndices((prev) => {
          const next = new Map(prev);
          for (const id of drag.memberIds) next.set(id, front);
          return next;
        });
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [groupMembersOf, moveGroup, commitDrag, rotatePiece, rotationEnabled, pieceById, cellIndex, cellWidth, cellHeight],
  );

  const handlePieceContextMenu = useCallback(
    (pieceId: number, e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (rotationEnabled) rotatePiece(pieceId, -1);
    },
    [rotatePiece, rotationEnabled],
  );

  return (
    <div
      className={`puzzle-viewport ${isPanning ? 'panning' : ''}`}
      ref={viewportRef}
      onPointerDown={handleViewportPointerDown}
    >
      <div
        className="puzzle-table"
        style={{
          width: tableWidth,
          height: tableHeight,
          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
        }}
      >
        <div
          className="puzzle-guide"
          style={{ left: guide.x, top: guide.y, width: guide.width, height: guide.height }}
        />
        {hintedPiece && (
          <div
            className="hint-target"
            style={{
              left: guide.x + hintedPiece.correctX,
              top: guide.y + hintedPiece.correctY,
              width: hintedPiece.cellWidth,
              height: hintedPiece.cellHeight,
            }}
          />
        )}
        {pieces.map((piece) => {
          const pos = positions[piece.id];
          if (!pos) return null;
          return (
            <PieceCanvas
              key={piece.id}
              piece={piece}
              image={image}
              x={pos.x}
              y={pos.y}
              rotation={pos.rotation}
              zIndex={zIndices.get(piece.id) ?? 1}
              isHinted={piece.id === hintPieceId}
              isLifted={liftedIds.has(piece.id)}
              isLocking={lockingIds.has(piece.id)}
              justSnapped={snappedIds.has(piece.id)}
              joined={joinedById.get(piece.id) ?? { top: false, right: false, bottom: false, left: false }}
              onPointerDown={handlePiecePointerDown}
              onContextMenu={handlePieceContextMenu}
              registerRef={registerRef}
            />
          );
        })}
      </div>

      <div
        className="board-toolbar"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={() => zoomBy(1 / zoomStep)} aria-label="Zoom out">
          −
        </button>
        <span className="board-toolbar-divider" />
        <button type="button" onClick={handleFitToScreen} aria-label="Fit to screen" className="zoom-fit">
          <span className="zoom-fit-full">⤢ Fit</span>
          <span className="zoom-fit-short">⤢</span>
        </button>
        <span className="board-toolbar-divider" />
        <button type="button" onClick={() => zoomBy(zoomStep)} aria-label="Zoom in">
          +
        </button>
      </div>

      {rotationEnabled && (
        <div className="rotate-hint">Click a piece to rotate it &middot; right-click to rotate the other way</div>
      )}
    </div>
  );
}
