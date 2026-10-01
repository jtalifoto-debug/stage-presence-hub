import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, type Field } from "@/components/perf/editable";
import { Chip, Eyebrow, PageHeader, Panel, Scale } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type RecoveryRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/regenerace")({
  head: () => ({
    meta: [
      { title: "Regenerace — Performer OS" },
      {
        name: "description",
        content: "Energie, tělo, hlava a stres po akcích — a co ti nejvíc pomáhá se zvednout.",
      },
      { property: "og:title", content: "Regenerace — Performer OS" },
      { property: "og:description", content: "Sleduj, kolik odpočinku po akcích skutečně potřebuješ." },
    ],
  }),
  component: RecoveryPage,
});

const fields: Field<RecoveryRow>[] = [
  { key: "date", label: "Den" },
  { key: "energy", label: "Energie (1–10)", type: "number" },
  { key: "body", label: "Tělo — únava (1–10)", type: "number" },
  { key: "mind", label: "Hlava (1–10)", type: "number" },
  { key: "stress", label: "Stres (1–10)", type: "number" },
  { key: "helped", label: "Co pomohlo (oddělené čárkou)", width: "lg" },
];

function RecoveryPage() {
  const { ws, patch } = useWorkspace();
  const counts = ws.recovery
    .flatMap((r) => r.helped.split(",").map((h) => h.trim()).filter(Boolean))
    .reduce<Record<string, number>>((acc, h) => ({ ...acc, [h]: (acc[h] ?? 0) + 1 }), {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <>
      <PageHeader eyebrow="🧘 Aby tělo vydrželo" title="Regenerace" />

      {top ? (
        <Panel soft>
          <p className="text-sm">💡 Nejčastěji ti pomáhá: <strong>{top}</strong></p>
        </Panel>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {ws.recovery.map((entry) => (
          <Panel key={entry.id}>
            <Eyebrow>{entry.date}</Eyebrow>
            <div className="space-y-4">
              <Scale label="Energie" value={Number(entry.energy) || 0} />
              <Scale label="Tělo — únava" value={Number(entry.body) || 0} />
              <Scale label="Hlava" value={Number(entry.mind) || 0} />
              <Scale label="Stres" value={Number(entry.stress) || 0} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.helped
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
                .map((h) => (
                  <Chip key={h} tone="ok">
                    {h}
                  </Chip>
                ))}
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <RecordEditor
          title="Zapsat regeneraci"
          items={ws.recovery}
          fields={fields}
          titleKey="date"
          addLabel="Přidat záznam"
          makeNew={() => ({
            id: uid(),
            date: new Date().toLocaleDateString("cs-CZ"),
            energy: 5,
            body: 5,
            mind: 5,
            stress: 5,
            helped: "",
          })}
          onChange={(next) => patch((w) => ({ ...w, recovery: next }))}
        />
      </Panel>
    </>
  );
}
