type ScoreBarProps = {
  label: string;
  value: number;
};

export function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div className="score-bar">
      <div>
        <span>{label}</span>
        <strong>{Math.round(value * 100)}%</strong>
      </div>
      <div className="score-track" aria-label={`${label} ${Math.round(value * 100)} percent`}>
        <i style={{ width: `${Math.min(value, 1) * 100}%` }} />
      </div>
    </div>
  );
}
