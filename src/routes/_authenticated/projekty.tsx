import { createFileRoute } from "@tanstack/react-router";

import { Chip, Eyebrow, Meter, PageHeader, Panel, Progress } from "@/components/perf/ui";
import { projects, sceneProgress, credits } from "@/lib/performer-data";

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

function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="🎭 Co zkouším" title="Projekty & role" />

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Panel key={p.name}>
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
              <Meter label={`deadline ${p.deadline}`} value={p.progress} />
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <Eyebrow>Postup po scénách</Eyebrow>
        <div className="space-y-5">
          {sceneProgress.map((scene) => (
            <div key={scene.label}>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>{scene.label}</span>
                <span className="text-xs text-mist">{scene.state}</span>
              </div>
              <Progress
                value={scene.value}
                tone={scene.value >= 80 ? "brand" : scene.value >= 50 ? "warn" : "danger"}
              />
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <Eyebrow>Odehrané role</Eyebrow>
        <ul className="divide-y divide-border text-sm">
          {credits.map((c) => (
            <li key={`${c.project}-${c.year}`} className="flex flex-wrap justify-between gap-2 py-2.5">
              <span>
                {c.project} — <span className="text-mist">{c.role}</span>
              </span>
              <span className="font-display text-xs text-mist">
                {c.production} · {c.year}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
