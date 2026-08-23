import { memo, useEffect, useRef } from 'react';
import type { PieceDef } from '../engine/types';
import type { JoinedSides } from '../engine/connect';

interface PieceCanvasProps {
  piece: PieceDef;
  image: HTMLImageElement;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  isHinted: boolean;
  isLifted: boolean;
  isLocking: boolean;
  justSnapped: boolean;
  joined: JoinedSides;
  onPointerDown: (pieceId: number, e: React.PointerEvent<HTMLDivElement>) => void;
  onContextMenu: (pieceId: number, e: React.MouseEvent<HTMLDivElement>) => void;
  registerRef: (pieceId: number, el: HTMLDivElement | null) => void;
}

function PieceCanvasImpl({
  piece,
  image,
  x,
  y,
  rotation,
  zIndex,
  isHinted,
  isLifted,
  isLocking,
  justSnapped,
  joined,
  onPointerDown,
  onContextMenu,
  registerRef,
}: PieceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pad = 6;
    const drawW = piece.bbox.width + pad;
    const drawH = piece.bbox.height + pad;
    canvas.width = Math.max(1, Math.ceil(drawW * dpr));
    canvas.height = Math.max(1, Math.ceil(drawH * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, drawW, drawH);

    const path = new Path2D(piece.path);
    const grouped = joined.top || joined.right || joined.bottom || joined.left;
    const thickness = grouped ? 1.6 : 3.2;

    if (!isLifted) {
      ctx.save();
      ctx.shadowColor = grouped ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.58)';
      ctx.shadowBlur = grouped ? 5 : 12;
      ctx.shadowOffsetX = grouped ? 1 : 2;
      ctx.shadowOffsetY = grouped ? 2 : 5;
      ctx.fillStyle = '#1a120c';
      ctx.fill(path);
      ctx.restore();
    }

    // Cardboard side — a dark offset copy that reads as real thickness.
    ctx.save();
    ctx.translate(thickness * 0.45, thickness);
    ctx.fillStyle = grouped ? '#3a2a1c' : '#2a1c12';
    ctx.fill(path);
    ctx.restore();

    ctx.save();
    ctx.clip(path);
    const srcX = piece.correctX + piece.bbox.x;
    const srcY = piece.correctY + piece.bbox.y;
    ctx.drawImage(
      image,
      srcX,
      srcY,
      piece.bbox.width,
      piece.bbox.height,
      0,
      0,
      piece.bbox.width,
      piece.bbox.height,
    );

    const vignette = ctx.createRadialGradient(
      piece.bbox.width * 0.4,
      piece.bbox.height * 0.35,
      Math.min(piece.bbox.width, piece.bbox.height) * 0.15,
      piece.bbox.width * 0.5,
      piece.bbox.height * 0.5,
      Math.max(piece.bbox.width, piece.bbox.height) * 0.75,
    );
    vignette.addColorStop(0, 'rgba(255, 248, 236, 0.07)');
    vignette.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(20, 10, 4, 0.18)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, piece.bbox.width, piece.bbox.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 248, 236, 0.5)';
    ctx.lineWidth = 2.6;
    ctx.translate(-1.2, -1.2);
    ctx.stroke(path);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(20, 10, 4, 0.42)';
    ctx.lineWidth = 2.6;
    ctx.translate(1.3, 1.4);
    ctx.stroke(path);
    ctx.restore();

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = grouped ? 'rgba(32, 20, 10, 0.18)' : 'rgba(32, 20, 10, 0.5)';
    ctx.lineWidth = grouped ? 0.65 : 1.15;
    ctx.stroke(path);
    ctx.restore();
  }, [piece, image, isLifted, joined.top, joined.right, joined.bottom, joined.left]);

  const className = [
    'piece',
    isHinted ? 'piece-hinted' : '',
    isLifted ? 'piece-lifted' : '',
    isLocking ? 'piece-locking' : '',
    justSnapped ? 'piece-snapped' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={(el) => registerRef(piece.id, el)}
      className={className}
      data-piece-id={piece.id}
      style={{
        width: piece.bbox.width,
        height: piece.bbox.height,
        transform: `translate3d(${x + piece.bbox.x}px, ${y + piece.bbox.y}px, 0) rotate(${rotation * 90}deg)`,
        zIndex,
      }}
      onPointerDown={(e) => onPointerDown(piece.id, e)}
      onContextMenu={(e) => onContextMenu(piece.id, e)}
    >
      <div className="piece-body">
        <canvas
          ref={canvasRef}
          className="piece-canvas"
          style={{ width: piece.bbox.width + 6, height: piece.bbox.height + 6 }}
        />
      </div>
    </div>
  );
}

export const PieceCanvas = memo(PieceCanvasImpl, (prev, next) => {
  return (
    prev.piece === next.piece &&
    prev.image === next.image &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.rotation === next.rotation &&
    prev.zIndex === next.zIndex &&
    prev.isHinted === next.isHinted &&
    prev.isLifted === next.isLifted &&
    prev.isLocking === next.isLocking &&
    prev.justSnapped === next.justSnapped &&
    prev.joined.top === next.joined.top &&
    prev.joined.right === next.joined.right &&
    prev.joined.bottom === next.joined.bottom &&
    prev.joined.left === next.joined.left
  );
});
