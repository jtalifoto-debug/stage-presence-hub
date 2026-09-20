import { createFileRoute, Link } from "@tanstack/react-router";

import stageImg from "@/assets/stage.jpg";
import {
  Button,
  Checklist,
  Chip,
  Eyebrow,
  Meter,
  Panel,
  Progress,
  StatCard,
} from "@/components/perf/ui";
import {
  events,
  kpis,
  performanceSkills,
  preparationChecklist,
  todaySchedule,
} from "@/lib/performer-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dnes — Performer OS" },
      {
        name: "description",
        content:
          "Dnešní nástěnka performera: kde vystupuješ, call time, harmonogram, co chybí a co dělat teď.",
      },
      { property: "og:title", content: "Dnes — Performer OS" },
      {
        property: "og:description",
        content: "Call time, harmonogram, kostým a další krok — vše na jedné obrazovce.",
      },
    ],
  }),
  component: Today,
});

function Today() {
  const today = events[0];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Pátek · 18. 9.</div>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Dnes</h1>
        </div>
        <Button variant="ghost">🔔 2 změny</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} value={kpi.value} label={kpi.label} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-display text-[11px] tracking-[0.25em] text-warn uppercase">
              ⚠️ Další krok
            </span>
            <span className="text-xs text-mist">inteligentní doporučení</span>
          </div>

          <Panel soft className="mb-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="size-2 animate-pulse rounded-full bg-warn" />
              <p className="font-display text-sm font-medium">
                Za 3 dny vystupuješ v Brně — Festival XYZ.
              </p>
            </div>
            <div className="mb-3 text-xs text-mist">❗ Chybí k dokončení:</div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Chip tone="danger">👗 Kostým</Chip>
              <Chip tone="danger">🎤 Technický rider</Chip>
              <Chip tone="danger">🚗 Potvrzení dopravy</Chip>
            </div>
            <Link to="/akce" className="block">
              <Button className="w-full">Vyřešit teď →</Button>
            </Link>
          </Panel>

          <Panel soft>
            <p className="font-display mb-3 text-sm font-medium">
              🎭 Máš 90 minut do zkoušky. Doporučení:
            </p>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <span>• 20 min choreografie</span>
              <span>• 10 min mobilita</span>
              <span>• 15 min problematická scéna</span>
              <span>• připravit tašku</span>
            </div>
            <Link to="/trenink" className="block">
              <Button className="mt-4 w-full">Spustit přípravu</Button>
            </Link>
          </Panel>
        </Panel>

        <Panel className="flex flex-col">
          <Eyebrow>📍 Kde a co</Eyebrow>
          <div className="glass-soft mb-4 overflow-hidden rounded-2xl">
            <img
              src={stageImg}
              alt="Jeviště v modrém světle"
              width={960}
              height={720}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
          <div className="mb-1 flex items-center justify-between">
            <span className="font-display text-sm font-semibold">{today.venue}</span>
            <Chip tone="ok">{today.status}</Chip>
          </div>
          <div className="text-xs text-mist">
            {today.title} · {today.role}
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-mist">🕐 Call time</dt>
              <dd className="font-display">{today.callTime}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-mist">🎵 Soundcheck</dt>
              <dd className="font-display">17:00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-mist">🎭 Stage</dt>
              <dd className="font-display">{today.time}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-mist">🚗 Cesta</dt>
              <dd className="font-display">42 min</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-mist">👥 S kým</dt>
              <dd className="font-display">soubor A · 6 lidí</dd>
            </div>
          </dl>
          <div className="mt-auto pt-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-mist">👗 Kostým</span>
              <span className="text-accent">75 %</span>
            </div>
            <Progress value={75} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>🎬 Harmonogram · akce</Eyebrow>
          <ol className="relative space-y-4 pl-5 before:absolute before:top-1 before:bottom-1 before:left-1.5 before:w-px before:bg-foreground/15">
            {todaySchedule.map((slot) => (
              <li key={slot.time} className="relative">
                <span
                  className={`absolute -left-[18px] top-1 size-3 rounded-full ring-4 ${
                    slot.state === "done"
                      ? "bg-ok ring-ok/20"
                      : slot.state === "now"
                        ? "bg-accent ring-accent/20"
                        : "bg-brand ring-brand/20"
                  }`}
                />
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm font-medium">{slot.label}</span>
                  <span
                    className={`font-display text-xs ${slot.state === "next" ? "text-mist" : "text-foreground"}`}
                  >
                    {slot.time}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel>
          <Eyebrow>🧠 Příprava výkonu</Eyebrow>
          <div className="space-y-4">
            {performanceSkills.slice(0, 4).map((skill) => (
              <Meter key={skill.label} label={skill.label} value={skill.value} />
            ))}
          </div>
          <div className="mt-6">
            <Checklist items={preparationChecklist} columns={2} />
          </div>
        </Panel>
      </div>
    </>
  );
}
