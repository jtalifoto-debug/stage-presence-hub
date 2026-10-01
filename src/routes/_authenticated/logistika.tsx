import { createFileRoute } from "@tanstack/react-router";

import { LabeledField, RecordEditor, TextInput, type Field } from "@/components/perf/editable";
import { Chip, Eyebrow, PageHeader, Panel, StatCard } from "@/components/perf/ui";
import { formatDateCz, liveRunsheet, nextEvent, travelMinutes } from "@/lib/performer-schedule";
import { useWorkspace } from "@/lib/workspace";
import { uid, type StepRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/logistika")({
  head: () => ({
    meta: [
      { title: "Logistika a cesta — Performer OS" },
      {
        name: "description",
        content: "Odjezd, cesta, parkování, check-in a backstage — krok za krokem k nejbližší akci.",
      },
      { property: "og:title", content: "Logistika a cesta — Performer OS" },
      { property: "og:description", content: "Kdy vyjet, kde parkovat a kudy na backstage." },
    ],
  }),
  component: LogisticsPage,
});

const stepFields: Field<StepRow>[] = [
  { key: "label", label: "Krok", width: "lg" },
  { key: "value", label: "Detail / čas" },
  { key: "done", label: "Hotovo", type: "check" },
];

function LogisticsPage() {
  const { ws, patch } = useWorkspace();
  const next = nextEvent(ws.events);
  const runsheet = next ? liveRunsheet(next) : [];
  const setLog = (key: "from" | "to" | "duration", v: string) =>
    patch((w) => ({ ...w, logistics: { ...w.logistics, [key]: v } }));

  return (
    <>
      <PageHeader eyebrow="🚗 Cesta na akci" title="Logistika" />

      {next ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard value={runsheet[0]?.time ?? "—"} label="odjezd" />
          <StatCard value={ws.logistics.duration || `${travelMinutes(next)} min`} label="cesta" />
          <StatCard value={next.callTime || next.time} label="call time" />
          <StatCard value={next.city} label="destinace" />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>Trasa</Eyebrow>
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <LabeledField label="Odkud">
              <TextInput value={ws.logistics.from} onChange={(v) => setLog("from", v)} />
            </LabeledField>
            <LabeledField label="Kam">
              <TextInput value={ws.logistics.to} onChange={(v) => setLog("to", v)} />
            </LabeledField>
            <LabeledField label="Doba cesty">
              <TextInput value={ws.logistics.duration} onChange={(v) => setLog("duration", v)} />
            </LabeledField>
          </div>
          {next ? (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <Chip>{ws.logistics.from || "domov"}</Chip>
              <span className="text-mist">→</span>
              <Chip tone="brand">
                {next.venue} · {next.city}
              </Chip>
            </div>
          ) : null}
          <RecordEditor
            title="Kroky"
            items={ws.logistics.steps}
            fields={stepFields}
            titleKey="label"
            addLabel="Přidat krok"
            makeNew={() => ({ id: uid(), label: "Nový krok", value: "", done: false })}
            onChange={(steps) => patch((w) => ({ ...w, logistics: { ...w.logistics, steps } }))}
          />
        </Panel>

        <Panel>
          <Eyebrow>
            Návaznost na harmonogram{next ? ` · ${next.title} · ${formatDateCz(next.date)}` : ""}
          </Eyebrow>
          {!next ? <p className="text-sm text-mist">Žádná nadcházející akce.</p> : null}
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
