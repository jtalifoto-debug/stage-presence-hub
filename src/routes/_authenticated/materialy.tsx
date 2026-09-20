import { createFileRoute } from "@tanstack/react-router";

import { Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { materialGroups, materialsByProject } from "@/lib/performer-data";

export const Route = createFileRoute("/materialy")({
  head: () => ({
    meta: [
      { title: "Materiály — Performer OS" },
      {
        name: "description",
        content:
          "Hudba, videa, scénáře, choreografie a reference roztříděné podle typu i podle projektu.",
      },
      { property: "og:title", content: "Materiály — Performer OS" },
      {
        property: "og:description",
        content: "Všechny podklady k výkonu na jednom místě.",
      },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  return (
    <>
      <PageHeader eyebrow="📚 Podklady" title="Materiály" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {materialGroups.map((g) => (
          <Panel key={g.label} soft className="text-center">
            <div className="text-2xl">{g.icon}</div>
            <div className="font-display mt-2 text-sm font-semibold">{g.label}</div>
            <div className="text-xs text-mist">{g.count} položek</div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {materialsByProject.map((group) => (
          <Panel key={group.project}>
            <Eyebrow>{group.project}</Eyebrow>
            <ul className="space-y-2 text-sm">
              {group.items.map((item) => (
                <li
                  key={item.label}
                  className="glass-soft flex items-center gap-3 rounded-xl px-3 py-2"
                >
                  <span aria-hidden>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </>
  );
}
