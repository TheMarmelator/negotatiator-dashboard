import {
  CALL_OUTCOMES,
  CALL_QUALITY_RATINGS,
  CARRIER_SENTIMENTS,
  type CallRecord,
  type DashboardStats,
} from "./types";

function emptyCounts<T extends string>(keys: readonly T[]): Record<T, number> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = 0;
      return acc;
    },
    {} as Record<T, number>,
  );
}

export function computeStats(calls: CallRecord[]): DashboardStats {
  const outcomeCounts = emptyCounts(CALL_OUTCOMES);
  const sentimentCounts = emptyCounts(CARRIER_SENTIMENTS);
  const qualityCounts = emptyCounts(CALL_QUALITY_RATINGS);

  if (calls.length === 0) {
    return {
      totalCalls: 0,
      dealRate: 0,
      avgDurationSeconds: 0,
      avgP90LatencyMs: 0,
      outcomeCounts,
      sentimentCounts,
      qualityCounts,
      avgNegotiationRounds: 0,
      verifiedCarrierRate: 0,
    };
  }

  let deals = 0;
  let totalDuration = 0;
  let totalP90 = 0;
  let totalRounds = 0;
  let roundsCount = 0;
  let verifiedCount = 0;
  let verifiedTotal = 0;

  for (const call of calls) {
    outcomeCounts[call.call_outcome] += 1;
    sentimentCounts[call.carrier_sentiment] += 1;
    qualityCounts[call.call_quality_rating] += 1;

    if (call.extraction.deal_reached === "yes") {
      deals += 1;
    }

    totalDuration += call.call_duration;
    totalP90 += call.p90_latency_ms;

    if (call.extraction.negotiation_rounds !== null) {
      totalRounds += call.extraction.negotiation_rounds;
      roundsCount += 1;
    }

    if (call.extraction.carrier_verified !== null) {
      verifiedTotal += 1;
      if (call.extraction.carrier_verified === "yes") {
        verifiedCount += 1;
      }
    }
  }

  return {
    totalCalls: calls.length,
    dealRate: (deals / calls.length) * 100,
    avgDurationSeconds: totalDuration / calls.length,
    avgP90LatencyMs: totalP90 / calls.length,
    outcomeCounts,
    sentimentCounts,
    qualityCounts,
    avgNegotiationRounds: roundsCount > 0 ? totalRounds / roundsCount : 0,
    verifiedCarrierRate: verifiedTotal > 0 ? (verifiedCount / verifiedTotal) * 100 : 0,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatOutcome(outcome: string): string {
  return outcome.replace(/_/g, " ");
}

export function formatQuality(rating: string): string {
  return rating.replace(/^\d_/, "").replace(/_/g, " ");
}

export function formatSentiment(sentiment: string): string {
  return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
}

export function qualityScore(rating: string): number {
  return Number.parseInt(rating.charAt(0), 10);
}
