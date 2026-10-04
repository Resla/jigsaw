import { DIFFICULTY_PRESETS } from '../engine/playPrefs';

export function DifficultyChips({
  pieceCount,
  onChange,
}: {
  pieceCount: number;
  onChange: (pieces: number) => void;
}) {
  return (
    <div className="difficulty-presets jigsaw-difficulty" role="group" aria-label="Difficulty">
      {DIFFICULTY_PRESETS.map((preset) => (
        <button
          key={preset.label}
          type="button"
          className={`difficulty-chip ${pieceCount === preset.pieces ? 'active' : ''}`}
          onClick={() => onChange(preset.pieces)}
        >
          {preset.label}
          <span className="difficulty-chip-count">{preset.pieces}</span>
        </button>
      ))}
    </div>
  );
}
