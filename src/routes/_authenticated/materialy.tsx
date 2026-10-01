import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, type Field } from "@/components/perf/editable";
import { Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type MaterialRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/materialy")({
  head: () => ({
    meta: [
      { title: "Materiály — Performer OS" },
      {
        name: "description",
        content:
          "Hudba, videa, scénáře, choreografie a reference roztříděné podle typu i podle projektu.",
      },
      { property: "og:title", content: "Materiály — Performer OS" },
      { property: "og:description", content: "Všechny podklady k výkonu na jednom místě." },
    ],
  }),
  component: MaterialsPage,
});

const fields: Field<MaterialRow>[] = [
  { key: "label", label: "Název", width: "lg" },
  { key: "project", label: "Projekt" },
  { key: "icon", label: "Ikona (🎵 🎬 📄 💃 🔗)" },
  { key: "url", label: "Odkaz", width: "lg" },
];

function MaterialsPage() {
  const { ws, patch } = useWorkspace();
  const groups = Object.entries(
    ws.materials.reduce<Record<string, MaterialRow[]>>((acc, m) => {
      (acc[m.project || "Bez projektu"] ??= []).push(m);
      return acc;
    }, {}),
  );

  return (
    <>
      <PageHeader eyebrow="📚 Podklady" title="Materiály" />

      <div className="grid gap-6 lg:grid-cols-3">
        {groups.map(([project, items]) => (
          <Panel key={project}>
            <Eyebrow>{project}</Eyebrow>
            <ul className="space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="glass-soft flex items-center gap-3 rounded-xl px-3 py-2">
                  <span aria-hidden>{item.icon}</span>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="truncate text-accent">
                      {item.label}
                    </a>
                  ) : (
                    <span className="truncate">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel>
        <RecordEditor
          title="Upravit materiály"
          items={ws.materials}
          fields={fields}
          titleKey="label"
          addLabel="Přidat materiál"
          makeNew={() => ({ id: uid(), project: "", icon: "📄", label: "Nový materiál", url: "" })}
          onChange={(next) => patch((w) => ({ ...w, materials: next }))}
        />
      </Panel>
    </>
  );
}
