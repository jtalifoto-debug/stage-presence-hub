import { createFileRoute } from "@tanstack/react-router";

import { Chip, Eyebrow, PageHeader, Panel, StatCard } from "@/components/perf/ui";
import { events, logistics } from "@/lib/performer-data";
import { buildRunsheet, formatDateCz, travelMinutes } from "@/lib/performer-schedule";

export const Route = createFileRoute("/logistika")({
  head: () => ({
    meta: [
      { title: "Logistika a cesta — Performer OS" },
      {
        name: "description",
        content: "Odjezd, cesta, parkování, check-in a backstage — krok za krokem k nejbližší akci.",
      },
      { property: "og:title", content: "Logistika a cesta — Performer OS" },
      {
        property: "og:description",
        content: "Kdy vyjet, kde parkovat a kudy na backstage.",
      },
    ],
  }),
  component: LogisticsPage,
});

function LogisticsPage() {
  const next = events.find((e) => e.status !== "hotovo") ?? events[0];
  const runsheet = buildRunsheet(next);
  const departure = runsheet[0];

  return (
    <>
      <PageHeader eyebrow="🚗 Cesta na akci" title="Logistika" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={departure.time} label="odjezd" />
        <StatCard value={`${travelMinutes(next)} min`} label="cesta" />
        <StatCard value={next.callTime ?? next.time} label="call time" />
        <StatCard value={next.city} label="destinace" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>Trasa</Eyebrow>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <Chip>{logistics.from}</Chip>
            <span className="text-mist">→</span>
            <Chip tone="brand">
              {next.venue} · {next.city}
            </Chip>
          </div>
          <ol className="space-y-3 text-sm">
            {logistics.steps.map((step) => (
              <li key={step.label} className="flex items-baseline justify-between gap-3">
                <span className={step.done ? "text-mist line-through" : ""}>{step.label}</span>
                <span className="font-display text-xs">{step.value}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel>
          <Eyebrow>Návaznost na harmonogram · {formatDateCz(next.date)}</Eyebrow>
          <ol className="space-y-3 text-sm">
            {runsheet.map((slot) => (
              <li key={`${slot.time}-${slot.label}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className={slot.state === "next" ? "text-mist" : ""}>{slot.label}</span>
                  <span className="font-display text-xs">{slot.time}</span>
                </div>
                {slot.note ? <div className="text-[11px] text-mist">{slot.note}</div> : null}
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
