import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, type Field } from "@/components/perf/editable";
import { Chip, Eyebrow, Meter, PageHeader, Panel } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type CareerRow } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/kariera")({
  head: () => ({
    meta: [
      { title: "Kariéra a rozvoj — Performer OS" },
      {
        name: "description",
        content: "Kariérní linky performera: tanec, herectví, moderování, choreografie a hlas.",
      },
      { property: "og:title", content: "Kariéra a rozvoj — Performer OS" },
      { property: "og:description", content: "Kde jsi silná, co roste a co posunout dál." },
    ],
  }),
  component: CareerPage,
});

const fields: Field<CareerRow>[] = [
  { key: "label", label: "Linka", width: "lg" },
  { key: "value", label: "Úroveň (%)", type: "number" },
  { key: "skills", label: "Dovednosti (oddělené čárkou)", width: "lg" },
];

function CareerPage() {
  const { ws, patch } = useWorkspace();
  const tracks = ws.career;
  const strongest = [...tracks].sort((a, b) => b.value - a.value)[0];
  const growth = [...tracks].sort((a, b) => a.value - b.value)[0];

  return (
    <>
      <PageHeader eyebrow="📈 Dlouhá hra" title="Kariéra" />

      {tracks.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel soft>
            <Eyebrow>Nejsilnější linka</Eyebrow>
            <div className="font-display text-xl font-semibold">{strongest?.label}</div>
          </Panel>
          <Panel soft>
            <Eyebrow>Největší prostor k růstu</Eyebrow>
            <div className="font-display text-xl font-semibold">{growth?.label}</div>
          </Panel>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {tracks.map((track) => (
          <Panel key={track.id}>
            <Meter label={track.label} value={Number(track.value) || 0} />
            <div className="mt-4 flex flex-wrap gap-2">
              {track.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => (
                  <Chip key={s} tone="accent">
                    {s}
                  </Chip>
                ))}
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <RecordEditor
          title="Upravit kariérní linky"
          items={tracks}
          fields={fields}
          titleKey="label"
          addLabel="Přidat linku"
          makeNew={() => ({ id: uid(), label: "Nová linka", value: 30, skills: "" })}
          onChange={(next) => patch((w) => ({ ...w, career: next }))}
        />
      </Panel>
    </>
  );
}
