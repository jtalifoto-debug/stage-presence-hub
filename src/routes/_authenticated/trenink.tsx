import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, type Field } from "@/components/perf/editable";
import { Eyebrow, Meter, PageHeader, Panel, StatCard } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type TrainingRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/trenink")({
  head: () => ({
    meta: [
      { title: "Trénink — Performer OS" },
      {
        name: "description",
        content: "Deník tréninků: minuty, zaměření na tělo i výkon a pocit z každé jednotky.",
      },
      { property: "og:title", content: "Trénink — Performer OS" },
      {
        property: "og:description",
        content: "Kolik jsi natrénovala, na co se zaměřit a jak se cítíš.",
      },
    ],
  }),
  component: TrainingPage,
});

const fields: Field<TrainingRow>[] = [
  { key: "date", label: "Den / datum" },
  { key: "total", label: "Minuty", type: "number" },
  { key: "parts", label: "Co jsem trénovala", width: "lg" },
  { key: "feeling", label: "Pocit (emoji)" },
];

function TrainingPage() {
  const { ws, patch } = useWorkspace();
  const log = ws.training;
  const total = log.reduce((sum, t) => sum + (Number(t.total) || 0), 0);
  const feelings = log.reduce<Record<string, number>>((acc, t) => {
    if (t.feeling) acc[t.feeling] = (acc[t.feeling] ?? 0) + 1;
    return acc;
  }, {});
  const topFeeling = Object.entries(feelings).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <>
      <PageHeader eyebrow="💃 Denní práce" title="Trénink" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={`${total} min`} label="celkem v deníku" />
        <StatCard value={String(log.length)} label="tréninků" />
        <StatCard value={log.length ? `${Math.round(total / log.length)} min` : "—"} label="průměr" />
        <StatCard value={topFeeling} label="nejčastější pocit" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <RecordEditor
            title="Deník tréninků"
            items={log}
            fields={fields}
            titleKey="date"
            addLabel="Přidat trénink"
            makeNew={() => ({
              id: uid(),
              date: new Date().toLocaleDateString("cs-CZ"),
              total: 60,
              parts: "",
              feeling: "🙂",
            })}
            onChange={(next) => patch((w) => ({ ...w, training: next }))}
          />
        </Panel>
        <Panel>
          <Eyebrow>Kde stojíš</Eyebrow>
          <div className="space-y-4">
            {ws.skills.map((s) => (
              <Meter key={s.id} label={s.label} value={Number(s.value) || 0} />
            ))}
          </div>
          <p className="mt-4 text-xs text-mist">Schopnosti upravíš v sekci Příprava.</p>
        </Panel>
      </div>
    </>
  );
}
