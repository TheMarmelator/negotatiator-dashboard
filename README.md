# ACME Inbound Negotiator Dashboard

A Next.js dashboard for visualizing inbound carrier negotiation call metrics. Data is ingested via a secured push API and persisted to a JSON file.

## Quick start

### Local development

```bash
cp .env.example .env
# Edit .env and set INGEST_API_KEY, DASHBOARD_USER, and DASHBOARD_PASSWORD

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard. Your browser will prompt for the dashboard username and password configured in `.env`.

### Docker

```bash
cp .env.example .env
# Set INGEST_API_KEY, DASHBOARD_USER, and DASHBOARD_PASSWORD in .env

docker build .

docker compose up --build
```

The dashboard runs at [http://localhost:3000](http://localhost:3000). Call data is persisted in a Docker volume (`calls-data`).

## Ingest API

**Method:** `POST`
**Content-Type:** `application/json`
**Endpoint:** `/api/calls`
**Responses:**
- `201` — Call stored successfully
- `401` — Missing or invalid API key
- `422` — Validation error (details in response body)
- `500` — Storage error

---

### Top-Level Fields

| Field | Type | Description |
|---|---|---|
| `timestamp` | `string` (ISO 8601) | UTC timestamp when the metrics payload was sent |
| `run_id` | `string` (UUID) | Unique identifier for this workflow run |
| `run_url` | `string` (URL) | Direct link to the run's detail page in HappyRobot |

### Call Metadata

| Field | Type | Description |
|---|---|---|
| `caller_phone` | `string` | Inbound caller's phone number (E.164 format) |
| `call_duration` | `string` (numeric) | Total call duration in seconds |
| `call_status` | `string` | Final call status (e.g. `completed`, `failed`, `no-answer`) |
| `call_end_event` | `string` | Event that triggered call termination (e.g. `agent_hangup`, `caller_hangup`, `transfer`) |
| `call_end_initiator` | `string` | Who ended the call — `agent`, `caller`, or `system` |

### Conversation Stats

| Field | Type | Description |
|---|---|---|
| `num_tool_calls` | `string` (integer) | Total number of tool invocations during the call |
| `num_user_turns` | `string` (integer) | Number of carrier speaking turns |
| `num_assistant_turns` | `string` (integer) | Number of agent speaking turns |
| `num_total_turns` | `string` (integer) | Combined total of all speaking turns |
| `p70_latency_ms` | `string` (numeric) | 70th percentile agent response latency in milliseconds |
| `p90_latency_ms` | `string` (numeric) | 90th percentile agent response latency in milliseconds |

### Extraction (`extraction` object)

Structured data extracted from the call transcript via AI.

| Field | Type | Description |
|---|---|---|
| `extraction.mc_number` | `string \| null` | Carrier's MC or DOT number as stated on the call |
| `extraction.carrier_name` | `string \| null` | Carrier company or individual name |
| `extraction.carrier_phone` | `string \| null` | Carrier's phone number (may differ from `caller_phone` if stated separately) |
| `extraction.load_id` | `string \| null` | Identifier of the load discussed |
| `extraction.origin` | `string \| null` | Load origin city/region |
| `extraction.destination` | `string \| null` | Load destination city/region |
| `extraction.equipment_type` | `string \| null` | Equipment class discussed (e.g. `dry van`, `reefer`, `flatbed`) |
| `extraction.loadboard_rate` | `string \| null` (numeric) | Original loadboard rate in dollars — the negotiation baseline |
| `extraction.initial_offer` | `string \| null` (numeric) | Agent's first offer in dollars |
| `extraction.counter_offers` | `string \| null` | Comma-separated list of carrier counter-offer amounts in chronological order |
| `extraction.final_agreed_rate` | `string \| null` (numeric) | Final agreed-upon rate in dollars, if a deal was reached |
| `extraction.negotiation_rounds` | `string \| null` (integer) | Number of counter-offer rounds before resolution |
| `extraction.deal_reached` | `string \| null` | Whether a deal was closed — `"yes"` or `"no"` |
| `extraction.carrier_verified` | `string \| null` | FMCSA verification result — `"yes"`, `"no"`, or `"error"` |

### Classifications

| Field | Type | Description |
|---|---|---|
| `call_outcome` | `string` (enum) | How the call ended. One of: `load_accepted`, `negotiation_failed`, `carrier_not_eligible`, `no_matching_loads`, `carrier_hangup` |
| `call_outcome_reasoning` | `string` | LLM-generated explanation for the outcome classification |
| `carrier_sentiment` | `string` (enum) | Carrier's overall emotional tone. One of: `positive`, `neutral`, `negative`, `frustrated` |
| `carrier_sentiment_reasoning` | `string` | LLM-generated explanation for the sentiment classification |
| `call_quality_rating` | `string` (enum) | Overall call quality score. One of: `1_poor`, `2_below_average`, `3_average`, `4_good`, `5_excellent` |
| `call_quality_reasoning` | `string` | LLM-generated explanation for the quality rating |

### Enum Definitions

#### `call_outcome`

| Value | Meaning |
|---|---|
| `load_accepted` | Carrier agreed to a rate and accepted a load |
| `negotiation_failed` | Load was pitched but parties couldn't agree on rate |
| `carrier_not_eligible` | FMCSA verification failed (unauthorized, inactive, or not found) |
| `no_matching_loads` | Carrier was verified but no loads matched their lane/equipment |
| `carrier_hangup` | Carrier disconnected before the conversation reached a conclusion |

#### `carrier_sentiment`

| Value | Meaning |
|---|---|
| `positive` | Friendly, cooperative, engaged |
| `neutral` | Business-like, matter-of-fact, no strong emotion |
| `negative` | Dissatisfied, annoyed, or displeased |
| `frustrated` | Hostile, aggressive, or visibly agitated |

#### `call_quality_rating`

Evaluated against four dimensions: FMCSA compliance, pricing ceiling compliance, win-win negotiation, and tone/professionalism.

| Value | Meaning |
|---|---|
| `1_poor` | Major failures in multiple dimensions |
| `2_below_average` | Notable weakness in one or two dimensions |
| `3_average` | Acceptable across all dimensions, nothing stood out |
| `4_good` | Strong performance — smooth verification, well-paced negotiation, professional tone |
| `5_excellent` | Exceptional across all four dimensions |

---

#### Notes

- All values are transmitted as **strings** in the JSON payload (including numeric fields like `call_duration`, `p90_latency_ms`, and rate amounts). The receiving endpoint should parse these to the appropriate native types.
- Extraction fields may be `null` when the relevant data was not discussed or could not be determined from the transcript.
- The `*_reasoning` fields contain free-text LLM explanations and should be stored as unbounded text.

**Example:**

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key-here" \
  -d @payload.json
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `INGEST_API_KEY` | Yes | Secret key for the ingest endpoint |
| `DASHBOARD_USER` | Yes | Username for dashboard HTTP basic authentication |
| `DASHBOARD_PASSWORD` | Yes | Password for dashboard HTTP basic authentication |
| `DATA_FILE_PATH` | No | Path to JSON storage file (default: `./data/calls.json`) |

The server validates that `INGEST_API_KEY`, `DASHBOARD_USER`, and `DASHBOARD_PASSWORD` are set on startup. All routes except `/api/calls` require basic authentication.

## Project structure

```
src/
├── app/
│   ├── api/calls/route.ts   # Ingest + list endpoint
│   ├── page.tsx             # Dashboard
│   └── layout.tsx
├── components/dashboard/    # UI components
└── lib/
    ├── auth.ts              # API key + basic auth validation
    ├── env.ts               # Required env validation
    ├── storage.ts           # JSON file persistence
    ├── validation.ts        # Zod payload schema
    ├── stats.ts             # Aggregation helpers
    └── types.ts             # TypeScript types
data/
└── calls.json               # Call records (git-tracked empty array)
```

## Dashboard features

- KPI cards: deal rate, avg duration, P90 latency, negotiation rounds, carrier verification rate
- Distribution charts: call outcomes, carrier sentiment, quality ratings
- Latency comparison (P70/P90) for recent calls
- Expandable call table with extraction details and AI reasoning
