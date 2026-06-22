export const CALL_OUTCOMES = [
  "load_accepted",
  "negotiation_failed",
  "carrier_not_eligible",
  "no_matching_loads",
  "carrier_hangup",
] as const;

export const CARRIER_SENTIMENTS = [
  "positive",
  "neutral",
  "negative",
  "frustrated",
] as const;

export const CALL_QUALITY_RATINGS = [
  "1_poor",
  "2_below_average",
  "3_average",
  "4_good",
  "5_excellent",
] as const;

export type CallOutcome = (typeof CALL_OUTCOMES)[number];
export type CarrierSentiment = (typeof CARRIER_SENTIMENTS)[number];
export type CallQualityRating = (typeof CALL_QUALITY_RATINGS)[number];

export interface CallExtraction {
  mc_number: string | null;
  carrier_name: string | null;
  carrier_phone: string | null;
  load_id: string | null;
  origin: string | null;
  destination: string | null;
  equipment_type: string | null;
  loadboard_rate: number | null;
  initial_offer: number | null;
  counter_offers: string | null;
  final_agreed_rate: number | null;
  negotiation_rounds: number | null;
  deal_reached: "yes" | "no" | null;
  carrier_verified: "yes" | "no" | "error" | null;
}

export interface CallRecord {
  id: string;
  received_at: string;
  timestamp: string;
  run_id: string;
  run_url: string;
  caller_phone: string;
  call_duration: number;
  call_status: string;
  call_end_event: string;
  call_end_initiator: string;
  num_tool_calls: number;
  num_user_turns: number;
  num_assistant_turns: number;
  num_total_turns: number;
  p70_latency_ms: number;
  p90_latency_ms: number;
  extraction: CallExtraction;
  call_outcome: CallOutcome;
  call_outcome_reasoning: string;
  carrier_sentiment: CarrierSentiment;
  carrier_sentiment_reasoning: string;
  call_quality_rating: CallQualityRating;
  call_quality_reasoning: string;
}

export interface DashboardStats {
  totalCalls: number;
  dealRate: number;
  avgDurationSeconds: number;
  avgP90LatencyMs: number;
  outcomeCounts: Record<CallOutcome, number>;
  sentimentCounts: Record<CarrierSentiment, number>;
  qualityCounts: Record<CallQualityRating, number>;
  avgNegotiationRounds: number;
  verifiedCarrierRate: number;
}
