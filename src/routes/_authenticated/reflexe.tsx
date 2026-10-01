import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, type Field } from "@/components/perf/editable";
import { Eyebrow, PageHeader, Panel, Scale } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type ReflectionRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/reflexe")({
  head: () => ({
    meta: [
      { title: "Reflexe po akci — Performer OS" },
      {
        name: "description",
        content: "Co fungovalo, co ne, co jsem se naučila a co udělám příště jinak.",
      },
      { property: "og:title", content: "Reflexe po akci — Performer OS" },
      {
        property: "og:description",
        content: "Krátké zhodnocení po každé akci, ze kterého roste další výkon.",
      },
    ],
  }),
  component: ReflectionsPage,
});

const fields: Field<ReflectionRow>[] = [
  { key: "event", label: "Akce", width: "lg" },
  { key: "rating", label: "Hodnocení (1–5)", type: "number" },
  { key: "worked", label: "Fungovalo", type: "textarea" },
  { key: "didnt", label: "Nefungovalo", type: "textarea" },
  { key: "learned", label: "Naučila jsem se", type: "textarea" },
  { key: "next", label: "Příště", type: "textarea" },
];

function ReflectionsPage() {
  const { ws, patch } = useWorkspace();
  const finished = ws.events.filter((e) => e.status === "hotovo").map((e) => e.title);

  return (
    <>
      <PageHeader eyebrow="📝 Po akci" title="Reflexe" />

      <Panel>
        <RecordEditor
          title="Napsat reflexi"
          items={ws.reflections}
          fields={fields}
          titleKey="event"
          addLabel="Přidat reflexi"
          makeNew={() => ({
            id: uid(),
            event: finished[finished.length - 1] ?? "Nová akce",
            rating: 4,
            worked: "",
            didnt: "",
            learned: "",
            next: "",
          })}
          onChange={(next) => patch((w) => ({ ...w, reflections: next }))}
        />
      </Panel>

      <div className="space-y-6">
        {ws.reflections.map((r) => (
          <Panel key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">{r.event}</h2>
              <div className="w-40">
                <Scale label="Hodnocení" value={Number(r.rating) || 0} max={5} />
              </div>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                ["✅ Fungovalo", r.worked],
                ["⚠️ Nefungovalo", r.didnt],
                ["💡 Naučila jsem se", r.learned],
                ["➡️ Příště", r.next],
              ].map(([label, text]) => (
                <div key={label}>
                  <Eyebrow>{label}</Eyebrow>
                  <p className="text-sm">{text || "—"}</p>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
