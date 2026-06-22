import { NextRequest } from "next/server";
import { getBasicAuthCredentials } from "@/lib/env";

export function validateBasicAuth(request: NextRequest): boolean {
  const { user, password } = getBasicAuthCredentials();
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = atob(authHeader.slice(6));
    const colonIndex = decoded.indexOf(":");

    if (colonIndex === -1) {
      return false;
    }

    const providedUser = decoded.slice(0, colonIndex);
    const providedPassword = decoded.slice(colonIndex + 1);

    return providedUser === user && providedPassword === password;
  } catch {
    return false;
  }
}

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
