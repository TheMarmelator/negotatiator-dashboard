import { z } from "zod";
import {
  CALL_OUTCOMES,
  CALL_QUALITY_RATINGS,
  CARRIER_SENTIMENTS,
  type CallRecord,
} from "./types";

const nullableString = z.string().nullable();

const optionalNumericString = z
  .union([z.string(), z.null()])
  .transform((value) => {
    if (value === null || value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  });

const optionalIntegerString = z
  .union([z.string(), z.null()])
  .transform((value) => {
    if (value === null || value.trim() === "") return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  });

const yesNoString = z
  .union([z.enum(["yes", "no"]), z.null()])
  .transform((value) => value ?? null);

const carrierVerifiedString = z
  .union([z.enum(["yes", "no", "error"]), z.null()])
  .transform((value) => value ?? null);

const extractionSchema = z.object({
  mc_number: nullableString,
  carrier_name: nullableString,
  carrier_phone: nullableString,
  load_id: nullableString,
  origin: nullableString,
  destination: nullableString,
  equipment_type: nullableString,
  loadboard_rate: optionalNumericString,
  initial_offer: optionalNumericString,
  counter_offers: nullableString,
  final_agreed_rate: optionalNumericString,
  negotiation_rounds: optionalIntegerString,
  deal_reached: yesNoString,
  carrier_verified: carrierVerifiedString,
});

export const callPayloadSchema = z.object({
  timestamp: z.string().datetime({ offset: true }),
  run_id: z.string().uuid(),
  run_url: z.string().url(),
  caller_phone: z.string().min(1),
  call_duration: z.string().transform((value) => Number(value)),
  call_status: z.string().min(1),
  call_end_event: z.string().min(1),
  call_end_initiator: z.string().min(1),
  num_tool_calls: z.string().transform((value) => Number.parseInt(value, 10)),
  num_user_turns: z.string().transform((value) => Number.parseInt(value, 10)),
  num_assistant_turns: z.string().transform((value) => Number.parseInt(value, 10)),
  num_total_turns: z.string().transform((value) => Number.parseInt(value, 10)),
  p70_latency_ms: z.string().transform((value) => Number(value)),
  p90_latency_ms: z.string().transform((value) => Number(value)),
  extraction: extractionSchema,
  call_outcome: z.enum(CALL_OUTCOMES),
  call_outcome_reasoning: z.string(),
  carrier_sentiment: z.enum(CARRIER_SENTIMENTS),
  carrier_sentiment_reasoning: z.string(),
  call_quality_rating: z.enum(CALL_QUALITY_RATINGS),
  call_quality_reasoning: z.string(),
});

export type CallPayload = z.infer<typeof callPayloadSchema>;

export function toCallRecord(payload: CallPayload): CallRecord {
  return {
    id: payload.run_id,
    received_at: new Date().toISOString(),
    ...payload,
  };
}
