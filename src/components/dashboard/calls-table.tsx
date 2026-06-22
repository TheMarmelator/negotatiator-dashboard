"use client";

import { Fragment, useState } from "react";
import type { CallRecord } from "@/lib/types";
import {
  formatCurrency,
  formatDuration,
  formatOutcome,
  formatQuality,
} from "@/lib/stats";
import {
  DealBadge,
  OutcomeBadge,
  QualityBadge,
  SentimentBadge,
  VerifiedBadge,
} from "./badges";

interface CallsTableProps {
  calls: CallRecord[];
}

function CallDetailPanel({ call }: { call: CallRecord }) {
  const { extraction: e } = call;

  return (
    <div className="grid gap-6 border-t border-[var(--border)] bg-[var(--surface-elevated)]/50 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Call details
        </h4>
        <dl className="space-y-2 text-sm">
          <Row label="Status" value={call.call_status} />
          <Row label="End event" value={call.call_end_event} />
          <Row label="End initiator" value={call.call_end_initiator} />
          <Row label="Duration" value={formatDuration(call.call_duration)} />
          <Row label="Tool calls" value={String(call.num_tool_calls)} />
          <Row
            label="Turns"
            value={`${call.num_user_turns} user / ${call.num_assistant_turns} agent / ${call.num_total_turns} total`}
          />
          <Row label="P70 latency" value={`${call.p70_latency_ms} ms`} />
          <Row label="P90 latency" value={`${call.p90_latency_ms} ms`} />
          <Row
            label="Run"
            value={
              <a
                href={call.run_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                View in HappyRobot ↗
              </a>
            }
          />
        </dl>
      </section>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Extraction
        </h4>
        <dl className="space-y-2 text-sm">
          <Row label="MC / DOT" value={e.mc_number ?? "—"} />
          <Row label="Carrier" value={e.carrier_name ?? "—"} />
          <Row label="Carrier phone" value={e.carrier_phone ?? "—"} />
          <Row label="Load ID" value={e.load_id ?? "—"} />
          <Row
            label="Lane"
            value={
              e.origin || e.destination
                ? `${e.origin ?? "?"} → ${e.destination ?? "?"}`
                : "—"
            }
          />
          <Row label="Equipment" value={e.equipment_type ?? "—"} />
          <Row label="Loadboard rate" value={formatCurrency(e.loadboard_rate)} />
          <Row label="Initial offer" value={formatCurrency(e.initial_offer)} />
          <Row label="Counter offers" value={e.counter_offers ?? "—"} />
          <Row label="Final rate" value={formatCurrency(e.final_agreed_rate)} />
          <Row
            label="Rounds"
            value={e.negotiation_rounds !== null ? String(e.negotiation_rounds) : "—"}
          />
          <Row
            label="Deal / Verified"
            value={
              <span className="flex gap-2">
                <DealBadge reached={e.deal_reached} />
                <VerifiedBadge verified={e.carrier_verified} />
              </span>
            }
          />
        </dl>
      </section>

      <section className="sm:col-span-2 lg:col-span-1">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          AI classifications
        </h4>
        <dl className="space-y-4 text-sm">
          <ReasoningBlock
            label={`Outcome — ${formatOutcome(call.call_outcome)}`}
            reasoning={call.call_outcome_reasoning}
          />
          <ReasoningBlock
            label={`Sentiment — ${call.carrier_sentiment}`}
            reasoning={call.carrier_sentiment_reasoning}
          />
          <ReasoningBlock
            label={`Quality — ${formatQuality(call.call_quality_rating)}`}
            reasoning={call.call_quality_reasoning}
          />
        </dl>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className="text-right text-[var(--text-secondary)]">{value}</dd>
    </div>
  );
}

function ReasoningBlock({
  label,
  reasoning,
}: {
  label: string;
  reasoning: string;
}) {
  return (
    <div>
      <dt className="mb-1 font-medium capitalize text-[var(--text-secondary)]">{label}</dt>
      <dd className="text-[var(--text-muted)] leading-relaxed">{reasoning}</dd>
    </div>
  );
}

export function CallsTable({ calls }: CallsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="card animate-fade-in overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Recent calls
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Click a row to expand full call details
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--text-muted)]">
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Carrier</th>
              <th className="px-4 py-3 font-medium">Lane</th>
              <th className="px-4 py-3 font-medium">Rates</th>
              <th className="px-4 py-3 font-medium">Outcome</th>
              <th className="px-4 py-3 font-medium">Sentiment</th>
              <th className="px-4 py-3 font-medium">Quality</th>
              <th className="px-4 py-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => {
              const isExpanded = expandedId === call.run_id;
              const e = call.extraction;

              return (
                <Fragment key={call.run_id}>
                  <tr
                    onClick={() =>
                      setExpandedId(isExpanded ? null : call.run_id)
                    }
                    className="table-row-hover cursor-pointer border-b border-[var(--border)]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <time
                        dateTime={call.timestamp}
                        className="block font-mono text-xs text-[var(--text-secondary)]"
                      >
                        {new Date(call.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                      <span className="mt-0.5 block font-mono text-[10px] text-[var(--text-muted)]">
                        {call.run_id.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-[var(--text-primary)]">
                        {e.carrier_name ?? "Unknown"}
                      </p>
                      <p className="font-mono text-xs text-[var(--text-muted)]">
                        {call.caller_phone}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-[var(--text-secondary)]">
                      {e.origin && e.destination ? (
                        <>
                          {e.origin}
                          <span className="mx-1 text-[var(--text-muted)]">→</span>
                          {e.destination}
                        </>
                      ) : (
                        "—"
                      )}
                      {e.equipment_type && (
                        <p className="mt-0.5 text-xs capitalize text-[var(--text-muted)]">
                          {e.equipment_type}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-mono text-xs text-[var(--text-secondary)]">
                        {formatCurrency(e.loadboard_rate)}
                        <span className="text-[var(--text-muted)]"> board</span>
                      </p>
                      <p className="font-mono text-xs text-[var(--success)]">
                        {formatCurrency(e.final_agreed_rate)}
                        <span className="text-[var(--text-muted)]"> final</span>
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <OutcomeBadge outcome={call.call_outcome} />
                    </td>
                    <td className="px-4 py-4">
                      <SentimentBadge sentiment={call.carrier_sentiment} />
                    </td>
                    <td className="px-4 py-4">
                      <QualityBadge rating={call.call_quality_rating} />
                    </td>
                    <td className="px-4 py-4 font-mono text-[var(--text-secondary)]">
                      {formatDuration(call.call_duration)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <CallDetailPanel call={call} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
