import { createFileRoute } from "@tanstack/react-router";

import { Chip, Eyebrow, Meter, PageHeader, Panel } from "@/components/perf/ui";
import { careerTracks } from "@/lib/performer-data";

export const Route = createFileRoute("/kariera")({
  head: () => ({
    meta: [
      { title: "Kariéra a rozvoj — Performer OS" },
      {
        name: "description",
        content: "Kariérní linky performera: tanec, herectví, moderování, choreografie a hlas.",
      },
      { property: "og:title", content: "Kariéra a rozvoj — Performer OS" },
      {
        property: "og:description",
        content: "Kde jsi silná, co roste a co posunout dál.",
      },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  const strongest = [...careerTracks].sort((a, b) => b.value - a.value)[0];
  const growth = [...careerTracks].sort((a, b) => a.value - b.value)[0];

  return (
    <>
      <PageHeader eyebrow="📈 Dlouhá hra" title="Kariéra" />

      <div className="grid gap-4 md:grid-cols-2">
        <Panel soft>
          <Eyebrow>Nejsilnější linka</Eyebrow>
          <div className="font-display text-xl font-semibold">{strongest.label}</div>
          <p className="mt-2 text-sm text-mist">
            Drž si ji zakázkami a jednou novou výzvou za sezónu.
          </p>
        </Panel>
        <Panel soft>
          <Eyebrow>Největší prostor k růstu</Eyebrow>
          <div className="font-display text-xl font-semibold">{growth.label}</div>
          <p className="mt-2 text-sm text-mist">
            Naplánuj si pravidelný trénink 2× týdně a jeden mentoring.
          </p>
        </Panel>
      </div>

      <div className="space-y-4">
        {careerTracks.map((track) => (
          <Panel key={track.label}>
            <Meter label={track.label} value={track.value} />
            <div className="mt-4 flex flex-wrap gap-2">
              {track.skills.map((s) => (
                <Chip key={s} tone="accent">
                  {s}
                </Chip>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
