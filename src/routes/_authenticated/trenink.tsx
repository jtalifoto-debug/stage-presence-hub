import { createFileRoute } from "@tanstack/react-router";

import { Chip, Eyebrow, Meter, PageHeader, Panel, StatCard } from "@/components/perf/ui";
import { bodyFocus, performanceFocus, performanceSkills, trainingLog } from "@/lib/performer-data";

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

function TrainingPage() {
  const total = trainingLog.reduce((sum, t) => sum + t.total, 0);

  return (
    <>
      <PageHeader eyebrow="💃 Denní práce" title="Trénink" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={`${total} min`} label="celkem tento týden" />
        <StatCard value={String(trainingLog.length)} label="tréninků" />
        <StatCard value={`${Math.round(total / trainingLog.length)} min`} label="průměr" />
        <StatCard value="🔥" label="nejčastější pocit" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>Tělo</Eyebrow>
          <div className="mb-6 flex flex-wrap gap-2">
            {bodyFocus.map((f) => (
              <Chip key={f} tone="ok">
                {f}
              </Chip>
            ))}
          </div>
          <Eyebrow>Výkon</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {performanceFocus.map((f) => (
              <Chip key={f} tone="accent">
                {f}
              </Chip>
            ))}
          </div>
        </Panel>

        <Panel>
          <Eyebrow>Kde stojíš</Eyebrow>
          <div className="space-y-4">
            {performanceSkills.map((s) => (
              <Meter key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <Eyebrow>Deník tréninků</Eyebrow>
        <ul className="divide-y divide-border">
          {trainingLog.map((t) => (
            <li key={t.date} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <div className="font-display text-sm font-semibold">
                  {t.date} · {t.total} min
                </div>
                <div className="mt-0.5 text-xs text-mist">{t.parts}</div>
              </div>
              <span className="text-lg">{t.feeling}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
