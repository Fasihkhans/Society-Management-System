import { formatCurrency } from "@/lib/format";

type SimpleBarProps = {
  label: string;
  value: number;
  max: number;
  tone?: "green" | "amber";
  aside?: string;
};

export function SimpleBar({ label, value, max, tone = "green", aside }: SimpleBarProps) {
  const width = max === 0 ? 0 : Math.max(12, (value / max) * 100);

  return (
    <div className="bar-row">
      <div className="bar-row__label">
        <strong>{label}</strong>
        <span>{aside ?? formatCurrency(value)}</span>
      </div>
      <div className="bar-row__track" aria-hidden="true">
        <span className={`bar-row__fill bar-row__fill--${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
