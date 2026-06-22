import type { DashboardStats } from "@/lib/types";
import { formatDuration } from "@/lib/stats";

interface StatCardsProps {
  stats: DashboardStats;
}

const cards = [
  {
    key: "dealRate",
    label: "Deal rate",
    suffix: "%",
    color: "var(--success)",
  },
  {
    key: "avgDurationSeconds",
    label: "Avg duration",
    formatter: formatDuration,
    color: "var(--accent)",
  },
  {
    key: "avgP90LatencyMs",
    label: "Avg P90 latency",
    suffix: " ms",
    color: "var(--purple)",
  },
  {
    key: "avgNegotiationRounds",
    label: "Avg negotiation rounds",
    decimals: 1,
    color: "var(--warning)",
  },
  {
    key: "verifiedCarrierRate",
    label: "Carrier verified",
    suffix: "%",
    color: "var(--accent)",
  },
] as const;

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const rawValue = stats[card.key];
        let display: string;

        if ("formatter" in card && card.formatter) {
          display = card.formatter(rawValue as number);
        } else if ("decimals" in card && card.decimals !== undefined) {
          display = (rawValue as number).toFixed(card.decimals);
        } else {
          display = Math.round(rawValue as number).toLocaleString();
        }

        if ("suffix" in card && card.suffix) {
          display += card.suffix;
        }

        return (
          <div
            key={card.key}
            className={`card animate-fade-in stagger-${index + 1} p-5`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              {card.label}
            </p>
            <p
              className="mt-2 font-mono text-2xl font-semibold tabular-nums"
              style={{ color: card.color }}
            >
              {display}
            </p>
          </div>
        );
      })}
    </div>
  );
}
