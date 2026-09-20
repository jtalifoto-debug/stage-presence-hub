import { createFileRoute } from "@tanstack/react-router";

import { Chip, Eyebrow, PageHeader, Panel, Scale } from "@/components/perf/ui";
import { recoveryInsight, recoveryLog } from "@/lib/performer-data";

export const Route = createFileRoute("/_authenticated/regenerace")({
  head: () => ({
    meta: [
      { title: "Regenerace — Performer OS" },
      {
        name: "description",
        content: "Energie, tělo, hlava a stres po akcích — a co ti nejvíc pomáhá se zvednout.",
      },
      { property: "og:title", content: "Regenerace — Performer OS" },
      {
        property: "og:description",
        content: "Sleduj, kolik odpočinku po akcích skutečně potřebuješ.",
      },
    ],
  }),
  component: RecoveryPage,
});

function RecoveryPage() {
  return (
    <>
      <PageHeader eyebrow="🧘 Aby tělo vydrželo" title="Regenerace" />

      <Panel soft>
        <p className="text-sm">💡 {recoveryInsight}</p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        {recoveryLog.map((entry) => (
          <Panel key={entry.date}>
            <Eyebrow>{entry.date}</Eyebrow>
            <div className="space-y-4">
              <Scale label="Energie" value={entry.energy} />
              <Scale label="Tělo — únava" value={entry.body} />
              <Scale label="Hlava" value={entry.mind} />
              <Scale label="Stres" value={entry.stress} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.helped.map((h) => (
                <Chip key={h} tone="ok">
                  {h}
                </Chip>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
