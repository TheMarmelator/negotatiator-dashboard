import type { CarrierSentiment } from "@/lib/types";
import { formatSentiment } from "@/lib/stats";

interface SentimentChartProps {
  counts: Record<CarrierSentiment, number>;
  total: number;
}

const SENTIMENT_COLORS: Record<CarrierSentiment, string> = {
  positive: "#22c55e",
  neutral: "#64748b",
  negative: "#f59e0b",
  frustrated: "#ef4444",
};

const SENTIMENT_ORDER: CarrierSentiment[] = [
  "positive",
  "neutral",
  "negative",
  "frustrated",
];

export function SentimentChart({ counts, total }: SentimentChartProps) {
  return (
    <div className="card animate-fade-in stagger-4 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Carrier sentiment
      </h2>
      <div className="mt-6 space-y-4">
        {SENTIMENT_ORDER.map((sentiment) => {
          const count = counts[sentiment];
          const pct = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={sentiment}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">
                  {formatSentiment(sentiment)}
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
                    backgroundColor: SENTIMENT_COLORS[sentiment],
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
