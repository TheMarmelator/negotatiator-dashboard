import type { CallRecord } from "@/lib/types";

interface LatencyChartProps {
  calls: CallRecord[];
}

export function LatencyChart({ calls }: LatencyChartProps) {
  const maxLatency = Math.max(...calls.map((c) => c.p90_latency_ms), 1);

  return (
    <div className="card animate-fade-in stagger-6 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Response latency (P70 / P90)
      </h2>
      <p className="mt-1 text-xs text-[var(--text-muted)]">Last {calls.length} calls</p>

      <div className="mt-6 space-y-3 max-h-80 overflow-y-auto scrollbar-thin pr-2">
        {calls.map((call) => {
          const p70Pct = (call.p70_latency_ms / maxLatency) * 100;
          const p90Pct = (call.p90_latency_ms / maxLatency) * 100;
          const label =
            call.extraction.carrier_name ??
            call.caller_phone.slice(-4).padStart(call.caller_phone.length, "•");

          return (
            <div key={call.run_id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate text-[var(--text-secondary)] max-w-[60%]">
                  {label}
                </span>
                <span className="font-mono tabular-nums text-[var(--text-muted)]">
                  {call.p70_latency_ms} / {call.p90_latency_ms} ms
                </span>
              </div>
              <div className="relative h-3 bar-track">
                <div
                  className="bar-fill absolute top-0 left-0 h-full bg-[var(--accent)]/40"
                  style={{ width: `${p90Pct}%` }}
                />
                <div
                  className="bar-fill absolute top-0 left-0 h-full bg-[var(--accent)]"
                  style={{ width: `${p70Pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded-sm bg-[var(--accent)]" />
          P70
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded-sm bg-[var(--accent)]/40" />
          P90
        </span>
      </div>
    </div>
  );
}
