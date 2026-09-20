import { createFileRoute } from "@tanstack/react-router";

import { Checklist, Chip, Eyebrow, Meter, PageHeader, Panel } from "@/components/perf/ui";
import { events, performanceSkills } from "@/lib/performer-data";
import { buildEventPrep, buildRunsheet, formatDateCz, prepScore } from "@/lib/performer-schedule";

export const Route = createFileRoute("/priprava")({
  head: () => ({
    meta: [
      { title: "Příprava výkonu — Performer OS" },
      {
        name: "description",
        content:
          "Příprava podle konkrétní akce z kalendáře: co chybí, jaký je harmonogram a které schopnosti dotáhnout.",
      },
      { property: "og:title", content: "Příprava výkonu — Performer OS" },
      {
        property: "og:description",
        content: "Checklist a harmonogram vytažené přímo z nadcházejících akcí.",
      },
    ],
  }),
  component: PrepPage,
});

function PrepPage() {
  const upcoming = events.filter((e) => e.status !== "hotovo").slice(0, 3);

  return (
    <>
      <PageHeader eyebrow="🧠 Než vyjdeš na stage" title="Příprava" />

      <Panel>
        <Eyebrow>Schopnosti pro aktuální role</Eyebrow>
        <div className="grid gap-4 sm:grid-cols-2">
          {performanceSkills.map((skill) => (
            <Meter key={skill.label} label={skill.label} value={skill.value} />
          ))}
        </div>
      </Panel>

      {upcoming.map((event) => {
        const runsheet = buildRunsheet(event);
        return (
          <Panel key={event.id}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="eyebrow">{formatDateCz(event.date)} · {event.city}</div>
                <h2 className="mt-1 text-lg font-semibold">{event.title}</h2>
              </div>
              <Chip tone={prepScore(event) >= 70 ? "ok" : "warn"}>{prepScore(event)} % hotovo</Chip>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <Eyebrow>Harmonogram akce</Eyebrow>
                <ol className="space-y-2 text-sm">
                  {runsheet.map((slot) => (
                    <li
                      key={`${slot.time}-${slot.label}`}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span className={slot.state === "next" ? "text-mist" : ""}>{slot.label}</span>
                      <span className="font-display text-xs">{slot.time}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <Eyebrow>Checklist akce</Eyebrow>
                <Checklist items={buildEventPrep(event)} />
              </div>
            </div>
          </Panel>
        );
      })}
    </>
  );
}
