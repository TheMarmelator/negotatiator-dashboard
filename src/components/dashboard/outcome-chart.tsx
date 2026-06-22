import type { CallOutcome } from "@/lib/types";
import { formatOutcome } from "@/lib/stats";

interface OutcomeChartProps {
  counts: Record<CallOutcome, number>;
  total: number;
}

const OUTCOME_COLORS: Record<CallOutcome, string> = {
  load_accepted: "#22c55e",
  negotiation_failed: "#f59e0b",
  carrier_not_eligible: "#ef4444",
  no_matching_loads: "#64748b",
  carrier_hangup: "#a855f7",
};

const OUTCOME_ORDER: CallOutcome[] = [
  "load_accepted",
  "negotiation_failed",
  "carrier_not_eligible",
  "no_matching_loads",
  "carrier_hangup",
];

export function OutcomeChart({ counts, total }: OutcomeChartProps) {
  return (
    <div className="card animate-fade-in stagger-3 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Call outcomes
      </h2>
      <div className="mt-6 space-y-4">
        {OUTCOME_ORDER.map((outcome) => {
          const count = counts[outcome];
          const pct = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={outcome}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="capitalize text-[var(--text-secondary)]">
                  {formatOutcome(outcome)}
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
                    backgroundColor: OUTCOME_COLORS[outcome],
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
