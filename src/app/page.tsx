import { readCalls } from "@/lib/storage";
import { computeStats } from "@/lib/stats";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatCards } from "@/components/dashboard/stat-cards";
import { OutcomeChart } from "@/components/dashboard/outcome-chart";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { QualityChart } from "@/components/dashboard/quality-chart";
import { LatencyChart } from "@/components/dashboard/latency-chart";
import { CallsTable } from "@/components/dashboard/calls-table";
import { EmptyState } from "@/components/dashboard/empty-state";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const calls = await readCalls();
  const stats = computeStats(calls);

  return (
    <div className="gradient-mesh min-h-screen">
      <DashboardHeader totalCalls={stats.totalCalls} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {calls.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            <StatCards stats={stats} />

            <div className="grid gap-6 lg:grid-cols-2">
              <OutcomeChart counts={stats.outcomeCounts} total={stats.totalCalls} />
              <SentimentChart counts={stats.sentimentCounts} total={stats.totalCalls} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <QualityChart counts={stats.qualityCounts} total={stats.totalCalls} />
              <LatencyChart calls={calls.slice(0, 20)} />
            </div>

            <CallsTable calls={calls} />
          </div>
        )}
      </main>
    </div>
  );
}
