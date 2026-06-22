import type { CallQualityRating } from "@/lib/types";
import { formatQuality } from "@/lib/stats";

interface QualityChartProps {
  counts: Record<CallQualityRating, number>;
  total: number;
}

const QUALITY_COLORS: Record<CallQualityRating, string> = {
  "1_poor": "#ef4444",
  "2_below_average": "#f97316",
  "3_average": "#64748b",
  "4_good": "#3b82f6",
  "5_excellent": "#22c55e",
};

const QUALITY_ORDER: CallQualityRating[] = [
  "5_excellent",
  "4_good",
  "3_average",
  "2_below_average",
  "1_poor",
];

export function QualityChart({ counts, total }: QualityChartProps) {
  return (
    <div className="card animate-fade-in stagger-5 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Call quality ratings
      </h2>
      <div className="mt-6 space-y-4">
        {QUALITY_ORDER.map((rating) => {
          const count = counts[rating];
          const pct = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={rating}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="capitalize text-[var(--text-secondary)]">
                  {formatQuality(rating)}
                </span>
                <span className="font-mono tabular-nums text-[var(--text-muted)]">
                  {count}{" "}
                  <span className="text-[var(--text-muted)]/60">({pct.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="bar-track h-2">
                <div
                  className="bar-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: QUALITY_COLORS[rating],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
