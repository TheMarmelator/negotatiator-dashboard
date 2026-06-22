interface DashboardHeaderProps {
  totalCalls: number;
}

export function DashboardHeader({ totalCalls }: DashboardHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/20 ring-1 ring-[var(--accent)]/30">
              <svg
                className="h-5 w-5 text-[var(--accent)]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                ACME Inbound Negotiator
              </h1>
              <p className="text-sm text-[var(--text-muted)]">Call metrics dashboard</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in stagger-1 flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Total calls
            </p>
            <p className="font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {totalCalls.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[var(--success)]/10 px-3 py-1.5 ring-1 ring-[var(--success)]/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
            </span>
            <span className="text-xs font-medium text-[var(--success)]">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
