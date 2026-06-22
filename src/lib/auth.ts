import { NextRequest } from "next/server";

export function validateApiKey(request: NextRequest): boolean {
  const expectedKey = process.env.INGEST_API_KEY;

  if (!expectedKey) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === expectedKey;
  }

  const apiKeyHeader = request.headers.get("x-api-key");
  if (apiKeyHeader === expectedKey) {
    return true;
  }

  return false;
}
