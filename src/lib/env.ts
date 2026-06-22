const REQUIRED_ENV_VARS = [
  "INGEST_API_KEY",
  "DASHBOARD_USER",
  "DASHBOARD_PASSWORD",
] as const;

export function validateRequiredEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

export function getBasicAuthCredentials(): {
  user: string;
  password: string;
} {
  return {
    user: process.env.DASHBOARD_USER!,
    password: process.env.DASHBOARD_PASSWORD!,
  };
}
