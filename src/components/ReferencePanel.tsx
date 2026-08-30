import { useState } from 'react';

interface ReferencePanelProps {
  src: string;
  title: string;
}

export function ReferencePanel({ src, title }: ReferencePanelProps) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`reference-panel ${open ? 'open' : 'collapsed'} ${expanded ? 'expanded' : ''}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="reference-toggle"
        onClick={() => {
          setOpen((o) => !o);
          setExpanded(false);
        }}
        aria-expanded={open}
      >
        <span className="reference-toggle-full">{open ? 'Hide preview' : '🖼️ Show preview'}</span>
        <span className="reference-toggle-short">{open ? 'Hide' : '🖼️'}</span>
      </button>
      {open && (
        <div
          className="reference-body"
          onClick={() => setExpanded((e) => !e)}
          title={expanded ? 'Tap to shrink preview' : 'Tap to enlarge preview'}
        >
          <img src={src} alt={`${title} — full preview`} draggable={false} />
        </div>
      )}
    </div>
  );
}
