import { createFileRoute } from "@tanstack/react-router";

import { Eyebrow, PageHeader, Panel, Scale } from "@/components/perf/ui";
import { reflections } from "@/lib/performer-data";

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

function ReflectionsPage() {
  return (
    <>
      <PageHeader eyebrow="📝 Po akci" title="Reflexe" />

      <div className="space-y-6">
        {reflections.map((r) => (
          <Panel key={r.event}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">{r.event}</h2>
              <div className="w-40">
                <Scale label="Hodnocení" value={r.rating} max={5} />
              </div>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <Eyebrow>✅ Fungovalo</Eyebrow>
                <p className="text-sm">{r.worked}</p>
              </div>
              <div>
                <Eyebrow>⚠️ Nefungovalo</Eyebrow>
                <p className="text-sm">{r.didnt}</p>
              </div>
              <div>
                <Eyebrow>💡 Naučila jsem se</Eyebrow>
                <p className="text-sm">{r.learned}</p>
              </div>
              <div>
                <Eyebrow>➡️ Příště</Eyebrow>
                <p className="text-sm">{r.next}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
