export async function register() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateRequiredEnv } = await import("@/lib/env");
    validateRequiredEnv();
  }
}
