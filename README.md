# ACME Inbound Negotiator Dashboard

A Next.js dashboard for visualizing inbound carrier negotiation call metrics. Data is ingested via a secured push API and persisted to a JSON file.

## Quick start

### Local development

```bash
cp .env.example .env
# Edit .env and set INGEST_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard.

### Docker

```bash
cp .env.example .env
# Set INGEST_API_KEY in .env

docker compose up --build
```

The dashboard runs at [http://localhost:3000](http://localhost:3000). Call data is persisted in a Docker volume (`calls-data`).

## Ingest API

**POST** `/api/calls`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <INGEST_API_KEY>` or `X-API-Key: <INGEST_API_KEY>`

**Example:**

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key-here" \
  -d @payload.json
```

See the project specification for the full payload schema. All numeric fields are transmitted as strings and parsed server-side.

**Responses:**
- `201` — Call stored successfully
- `401` — Missing or invalid API key
- `422` — Validation error (details in response body)
- `500` — Storage error

**GET** `/api/calls` returns all stored calls as JSON (unauthenticated, for debugging).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `INGEST_API_KEY` | Yes | Secret key for the ingest endpoint |
| `DATA_FILE_PATH` | No | Path to JSON storage file (default: `./data/calls.json`) |

## Project structure

```
src/
├── app/
│   ├── api/calls/route.ts   # Ingest + list endpoint
│   ├── page.tsx             # Dashboard
│   └── layout.tsx
├── components/dashboard/    # UI components
└── lib/
    ├── auth.ts              # API key validation
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
