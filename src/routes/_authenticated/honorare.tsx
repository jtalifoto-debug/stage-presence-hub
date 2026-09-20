import { createFileRoute } from "@tanstack/react-router";

import { Chip, Eyebrow, PageHeader, Panel, Progress, StatCard } from "@/components/perf/ui";
import { finance, formatCzk } from "@/lib/performer-data";

export const Route = createFileRoute("/_authenticated/honorare")({
  head: () => ({
    meta: [
      { title: "Honoráře a peníze — Performer OS" },
      {
        name: "description",
        content: "Vydělané honoráře, nezaplacené faktury, náklady a přehled po jednotlivých akcích.",
      },
      { property: "og:title", content: "Honoráře a peníze — Performer OS" },
      {
        property: "og:description",
        content: "Kolik jsi vydělala, co čeká na zaplacení a jaké máš náklady.",
      },
    ],
  }),
  component: MoneyPage,
});

function MoneyPage() {
  const costsTotal = finance.costBreakdown.reduce((s, c) => s + c.value, 0);

  return (
    <>
      <PageHeader eyebrow={`💰 ${finance.month}`} title="Honoráře" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={formatCzk(finance.earned)} label="vyděláno" />
        <StatCard value={formatCzk(finance.pending)} label="čeká na zaplacení" />
        <StatCard value={formatCzk(finance.toPay)} label="náklady k úhradě" />
        <StatCard value={String(finance.eventsCount)} label="akcí v měsíci" />
      </div>

      <Panel>
        <Eyebrow>Podle akcí</Eyebrow>
        <ul className="divide-y divide-border text-sm">
          {finance.items.map((item) => (
            <li key={item.event} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <div className="font-display font-semibold">{item.event}</div>
                <div className="mt-0.5 text-xs text-mist">náklady {formatCzk(item.costs)}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display">{formatCzk(item.fee)}</span>
                <Chip tone={item.state === "zaplaceno" ? "ok" : "warn"}>{item.state}</Chip>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <Eyebrow>Náklady</Eyebrow>
        <div className="space-y-4">
          {finance.costBreakdown.map((c) => (
            <div key={c.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span>{c.label}</span>
                <span className="font-display">{formatCzk(c.value)}</span>
              </div>
              <Progress value={(c.value / costsTotal) * 100} tone="warn" />
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-mist">
          Čistý výdělek po nákladech: {" "}
          <span className="font-display text-accent">{formatCzk(finance.earned - costsTotal)}</span>
        </p>
      </Panel>
    </>
  );
}
