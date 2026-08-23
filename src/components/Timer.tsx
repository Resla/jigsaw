import { useEffect, useState } from 'react';

interface TimerProps {
  startedAt: number;
  running: boolean;
}

export function Timer({ startedAt, running }: TimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const elapsedSec = Math.max(0, Math.floor((now - startedAt) / 1000));
  const mm = Math.floor(elapsedSec / 60)
    .toString()
    .padStart(2, '0');
  const ss = (elapsedSec % 60).toString().padStart(2, '0');

  return (
    <span className="stat-value">
      {mm}:{ss}
    </span>
  );
}
