import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, type Field } from "@/components/perf/editable";
import { Chip, Eyebrow, Meter, PageHeader, Panel, Progress } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type CreditRow, type ProjectRow, type SceneRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/projekty")({
  head: () => ({
    meta: [
      { title: "Projekty & role — Performer OS" },
      {
        name: "description",
        content:
          "Přehled projektů a rolí: stav zkoušení, deadliny a postup po jednotlivých scénách a číslech.",
      },
      { property: "og:title", content: "Projekty & role — Performer OS" },
      {
        property: "og:description",
        content: "Kolik z role máš hotovo a co ještě potřebuje zkoušku.",
      },
    ],
  }),
  component: ProjectsPage,
});

const projectFields: Field<ProjectRow>[] = [
  { key: "name", label: "Projekt", width: "lg" },
  { key: "role", label: "Role" },
  { key: "state", label: "Stav", type: "select", options: ["zkouším", "připravit", "ready"] },
  { key: "deadline", label: "Deadline" },
  { key: "progress", label: "Hotovo (%)", type: "number" },
];
const sceneFields: Field<SceneRow>[] = [
  { key: "label", label: "Scéna / číslo", width: "lg" },
  { key: "value", label: "Hotovo (%)", type: "number" },
  { key: "state", label: "Poznámka ke stavu" },
];
const creditFields: Field<CreditRow>[] = [
  { key: "project", label: "Projekt", width: "lg" },
  { key: "role", label: "Role" },
  { key: "production", label: "Produkce" },
  { key: "year", label: "Rok" },
];

function ProjectsPage() {
  const { ws, patch } = useWorkspace();
  return (
    <>
      <PageHeader eyebrow="🎭 Co zkouším" title="Projekty & role" />

      <div className="grid gap-4 md:grid-cols-2">
        {ws.projects.map((p) => (
          <Panel key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-xs text-mist">role: {p.role}</div>
              </div>
              <Chip tone={p.state === "ready" ? "ok" : p.state === "připravit" ? "warn" : "brand"}>
                {p.state}
              </Chip>
            </div>
            <div className="mt-4">
              <Meter label={`deadline ${p.deadline}`} value={Number(p.progress) || 0} />
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <RecordEditor
            title="Upravit projekty"
            items={ws.projects}
            fields={projectFields}
            titleKey="name"
            addLabel="Přidat projekt"
            makeNew={() => ({ id: uid(), name: "Nový projekt", role: "", state: "zkouším", deadline: "", progress: 0 })}
            onChange={(next) => patch((w) => ({ ...w, projects: next }))}
          />
        </Panel>
        <Panel>
          <Eyebrow>Postup po scénách</Eyebrow>
          <div className="mb-6 space-y-5">
            {ws.scenes.map((scene) => (
              <div key={scene.id}>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span>{scene.label}</span>
                  <span className="text-xs text-mist">{scene.state}</span>
                </div>
                <Progress
                  value={Number(scene.value) || 0}
                  tone={scene.value >= 80 ? "brand" : scene.value >= 50 ? "warn" : "danger"}
                />
              </div>
            ))}
          </div>
          <RecordEditor
            items={ws.scenes}
            fields={sceneFields}
            titleKey="label"
            addLabel="Přidat scénu"
            makeNew={() => ({ id: uid(), label: "Nová scéna", value: 0, state: "" })}
            onChange={(next) => patch((w) => ({ ...w, scenes: next }))}
          />
        </Panel>
      </div>

      <Panel>
        <RecordEditor
          title="Odehrané role"
          items={ws.credits}
          fields={creditFields}
          titleKey="project"
          addLabel="Přidat roli"
          makeNew={() => ({ id: uid(), project: "Nový projekt", role: "", production: "", year: String(new Date().getFullYear()) })}
          onChange={(next) => patch((w) => ({ ...w, credits: next }))}
        />
      </Panel>
    </>
  );
}
