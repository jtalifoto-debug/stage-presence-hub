import { createFileRoute } from "@tanstack/react-router";

import { EditableChecklist, RecordEditor, type Field } from "@/components/perf/editable";
import { Checklist, Chip, Eyebrow, Meter, PageHeader, Panel } from "@/components/perf/ui";
import {
  buildEventPrep,
  formatDateCz,
  liveRunsheet,
  prepScore,
  sortEvents,
  todayIso,
} from "@/lib/performer-schedule";
import { useWorkspace } from "@/lib/workspace";
import { uid, type ValueRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/priprava")({
  head: () => ({
    meta: [
      { title: "Příprava výkonu — Performer OS" },
      {
        name: "description",
        content:
          "Příprava podle konkrétní akce z kalendáře: co chybí, jaký je harmonogram a které schopnosti dotáhnout.",
      },
      { property: "og:title", content: "Příprava výkonu — Performer OS" },
      {
        property: "og:description",
        content: "Checklist a harmonogram vytažené přímo z nadcházejících akcí.",
      },
    ],
  }),
  component: PrepPage,
});

const skillFields: Field<ValueRow>[] = [
  { key: "label", label: "Schopnost", width: "lg" },
  { key: "value", label: "Úroveň (%)", type: "number" },
];

function PrepPage() {
  const { ws, patch } = useWorkspace();
  const today = todayIso();
  const sorted = sortEvents(ws.events).filter((e) => e.status !== "hotovo");
  const upcoming = (sorted.filter((e) => e.date >= today).length ? sorted.filter((e) => e.date >= today) : sorted).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow="🧠 Než vyjdeš na stage" title="Příprava" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>Schopnosti pro aktuální role</Eyebrow>
          <div className="mb-6 grid gap-4">
            {ws.skills.map((skill) => (
              <Meter key={skill.id} label={skill.label} value={Number(skill.value) || 0} />
            ))}
          </div>
          <RecordEditor
            items={ws.skills}
            fields={skillFields}
            titleKey="label"
            addLabel="Přidat schopnost"
            makeNew={() => ({ id: uid(), label: "Nová schopnost", value: 50 })}
            onChange={(next) => patch((w) => ({ ...w, skills: next }))}
          />
        </Panel>
        <Panel>
          <Eyebrow>Můj obecný checklist</Eyebrow>
          <EditableChecklist
            items={ws.prepChecklist}
            onChange={(next) => patch((w) => ({ ...w, prepChecklist: next }))}
            makeNew={(label) => ({ id: uid(), label, done: false })}
          />
        </Panel>
      </div>

      {upcoming.map((event) => {
        const runsheet = liveRunsheet(event);
        const score = prepScore(event);
        return (
          <Panel key={event.id}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="eyebrow">
                  {formatDateCz(event.date)} · {event.city}
                </div>
                <h2 className="mt-1 text-lg font-semibold">{event.title}</h2>
              </div>
              <Chip tone={score >= 70 ? "ok" : "warn"}>{score} % hotovo</Chip>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <Eyebrow>Harmonogram akce</Eyebrow>
                <ol className="space-y-2 text-sm">
                  {runsheet.map((slot) => (
                    <li key={`${slot.time}-${slot.label}`} className="flex items-baseline justify-between gap-3">
                      <span className={slot.state === "next" ? "text-mist" : ""}>{slot.label}</span>
                      <span className="font-display text-xs">{slot.time}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <Eyebrow>Checklist akce</Eyebrow>
                <Checklist items={buildEventPrep(event)} />
              </div>
            </div>
          </Panel>
        );
      })}
    </>
  );
}
