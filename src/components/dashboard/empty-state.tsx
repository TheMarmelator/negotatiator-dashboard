export function EmptyState() {
  return (
    <div className="card animate-fade-in mx-auto max-w-2xl p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]/20">
        <svg
          className="h-8 w-8 text-[var(--accent)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
        Waiting for call data
      </h2>
      <p className="mt-2 text-[var(--text-muted)]">
        No calls have been ingested yet. Push metrics to the ingest endpoint to populate
        this dashboard.
      </p>

      <div className="card-elevated mx-auto mt-8 max-w-md p-4 text-left">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Ingest endpoint
        </p>
        <code className="mt-2 block font-mono text-sm text-[var(--accent)]">
          POST /api/calls
        </code>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Include your API key via{" "}
          <code className="text-[var(--text-secondary)]">Authorization: Bearer &lt;key&gt;</code>{" "}
          or{" "}
          <code className="text-[var(--text-secondary)]">X-API-Key: &lt;key&gt;</code>
        </p>
      </div>
    </div>
  );
}
