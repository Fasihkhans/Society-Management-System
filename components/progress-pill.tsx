type ProgressPillProps = {
  value: number;
};

export function ProgressPill({ value }: ProgressPillProps) {
  const tone = value >= 80 ? "good" : value >= 60 ? "mid" : "low";

  return <span className={`progress-pill progress-pill--${tone}`}>{Math.round(value)}%</span>;
}
