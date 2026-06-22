import type { CallOutcome, CarrierSentiment, CallQualityRating } from "@/lib/types";

export function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  const styles: Record<CallOutcome, string> = {
    load_accepted: "badge-success",
    negotiation_failed: "badge-warning",
    carrier_not_eligible: "badge-danger",
    no_matching_loads: "badge-neutral",
    carrier_hangup: "badge-purple",
  };

  return (
    <span className={`badge ${styles[outcome]}`}>
      {outcome.replace(/_/g, " ")}
    </span>
  );
}

export function SentimentBadge({ sentiment }: { sentiment: CarrierSentiment }) {
  const styles: Record<CarrierSentiment, string> = {
    positive: "badge-success",
    neutral: "badge-neutral",
    negative: "badge-warning",
    frustrated: "badge-danger",
  };

  return (
    <span className={`badge ${styles[sentiment]}`}>
      {sentiment}
    </span>
  );
}

export function QualityBadge({ rating }: { rating: CallQualityRating }) {
  const score = rating.charAt(0);
  const styles: Record<string, string> = {
    "1": "badge-danger",
    "2": "badge-warning",
    "3": "badge-neutral",
    "4": "badge-info",
    "5": "badge-success",
  };

  return (
    <span className={`badge ${styles[score] ?? "badge-neutral"}`}>
      {score}/5
    </span>
  );
}

export function DealBadge({ reached }: { reached: "yes" | "no" | null }) {
  if (reached === "yes") return <span className="badge badge-success">Deal</span>;
  if (reached === "no") return <span className="badge badge-neutral">No deal</span>;
  return <span className="badge badge-neutral">—</span>;
}

export function VerifiedBadge({
  verified,
}: {
  verified: "yes" | "no" | "error" | null;
}) {
  if (verified === "yes") return <span className="badge badge-success">Verified</span>;
  if (verified === "no") return <span className="badge badge-danger">Failed</span>;
  if (verified === "error") return <span className="badge badge-warning">Error</span>;
  return <span className="badge badge-neutral">—</span>;
}
