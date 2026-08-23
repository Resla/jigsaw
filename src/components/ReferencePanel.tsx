import { useState } from 'react';

interface ReferencePanelProps {
  src: string;
  title: string;
}

export function ReferencePanel({ src, title }: ReferencePanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`reference-panel ${open ? 'open' : 'collapsed'}`}>
      <button type="button" className="reference-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide preview' : '🖼️ Show preview'}
      </button>
      {open && (
        <div className="reference-body">
          <img src={src} alt={`${title} — full preview`} />
        </div>
      )}
    </div>
  );
}
