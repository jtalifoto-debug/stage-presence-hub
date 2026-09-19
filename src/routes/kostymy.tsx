import { createFileRoute } from "@tanstack/react-router";

import { Checklist, Chip, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { bagItems, costumeItems, events } from "@/lib/performer-data";
import { formatDateCz } from "@/lib/performer-schedule";

export const Route = createFileRoute("/kostymy")({
  head: () => ({
    meta: [
      { title: "Kostýmy a taška — Performer OS" },
      {
        name: "description",
        content: "Stav kostýmu pro nejbližší akci a seznam věcí, které si vzít do tašky.",
      },
      { property: "og:title", content: "Kostýmy a taška — Performer OS" },
      {
        property: "og:description",
        content: "Kostým, boty, doplňky a co nesmí chybět v tašce.",
      },
    ],
  }),
  component: CostumesPage,
});

function CostumesPage() {
  const next = events.find((e) => e.status !== "hotovo") ?? events[0];

  return (
    <>
      <PageHeader eyebrow="👗 Co si vezmu" title="Kostýmy" />

      <Panel soft>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-sm font-semibold">
              Nejbližší akce: {next.title}
            </div>
            <div className="mt-1 text-xs text-mist">
              {formatDateCz(next.date)} · {next.venue} · role {next.role}
            </div>
          </div>
          <Chip tone="warn">call {next.callTime ?? next.time}</Chip>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>Kostým</Eyebrow>
          <Checklist items={costumeItems} />
        </Panel>

        <Panel>
          <Eyebrow>🎒 Taška</Eyebrow>
          <Checklist items={bagItems.map((label) => ({ label }))} columns={2} />
        </Panel>
      </div>
    </>
  );
}
