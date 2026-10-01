import { createFileRoute, Link } from "@tanstack/react-router";

import stageImg from "@/assets/stage.jpg";
import { EditableChecklist } from "@/components/perf/editable";
import { Button, Chip, Eyebrow, Meter, Panel, Progress, StatCard } from "@/components/perf/ui";
import { eventTypeMeta, formatCzk } from "@/lib/performer-data";
import {
  buildEventPrep,
  daysUntil,
  formatDateCz,
  liveRunsheet,
  nextEvent,
  prepScore,
  sortEvents,
  todayIso,
  travelMinutes,
} from "@/lib/performer-schedule";
import { useWorkspace } from "@/lib/workspace";
import { uid } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/")({
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
  const { ws, patch } = useWorkspace();
  const event = nextEvent(ws.events);
  const upcoming = sortEvents(ws.events).filter((e) => e.date >= todayIso() && e.status !== "hotovo");
  const unpaid = ws.finance.items
    .filter((i) => i.state !== "zaplaceno")
    .reduce((s, i) => s + (Number(i.fee) || 0), 0);
  const costumePct = ws.costume.length
    ? Math.round((ws.costume.filter((c) => c.done).length / ws.costume.length) * 100)
    : 0;
  const trainingMin = ws.training.reduce((s, t) => s + (Number(t.total) || 0), 0);
  const dateLabel = new Date().toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });

  const kpis = [
    { value: String(upcoming.length), label: "nadcházejících akcí" },
    { value: event ? `${prepScore(event)} %` : "—", label: "připravenost další akce" },
    { value: `${costumePct} %`, label: "kostým připraven" },
    { value: `${trainingMin} min`, label: "tréninku v deníku" },
    { value: formatCzk(unpaid), label: "čeká na výplatu" },
    { value: String(ws.contracts.filter((c) => !c.signed).length), label: "nepodepsané smlouvy" },
  ];

  const missing = event ? buildEventPrep(event).filter((p) => !p.done) : [];
  const runsheet = event ? liveRunsheet(event) : [];
  const soundcheck = runsheet.find((s) => s.label === "Soundcheck");
  const days = event ? daysUntil(event.date) : 0;
  const whenLabel = days === 0 ? "Dnes" : days === 1 ? "Zítra" : days > 1 ? `Za ${days} dny` : "Proběhlo";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="eyebrow">{dateLabel}</div>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Dnes</h1>
        </div>
        <Link to="/kalendar">
          <Button variant="ghost">📅 Kalendář</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} value={kpi.value} label={kpi.label} />
        ))}
      </div>

      {!event ? (
        <Panel>
          <p className="text-sm text-mist">Zatím nemáš žádnou akci. Přidej první v sekci Akce.</p>
          <Link to="/akce" className="mt-4 block">
            <Button>Přidat akci →</Button>
          </Link>
        </Panel>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-display text-[11px] tracking-[0.25em] text-warn uppercase">
                  ⚠️ Další krok
                </span>
                <span className="text-xs text-mist">podle kalendáře</span>
              </div>
              <Panel soft className="mb-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="size-2 animate-pulse rounded-full bg-warn" />
                  <p className="font-display text-sm font-medium">
                    {whenLabel} {eventTypeMeta[event.type]?.icon} {event.title} — {event.city}.
                  </p>
                </div>
                {missing.length ? (
                  <>
                    <div className="mb-3 text-xs text-mist">❗ Chybí k dokončení:</div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {missing.map((m) => (
                        <Chip key={m.label} tone="danger">
                          {m.label}
                        </Chip>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mb-4 text-sm text-ok">Vše připraveno ✓</p>
                )}
                <Link to="/akce" className="block">
                  <Button className="w-full">Vyřešit teď →</Button>
                </Link>
              </Panel>
              {upcoming.length > 1 ? (
                <Panel soft>
                  <Eyebrow>Potom</Eyebrow>
                  <ul className="space-y-1.5 text-sm">
                    {upcoming.slice(1, 4).map((e) => (
                      <li key={e.id} className="flex justify-between gap-3">
                        <span>
                          {eventTypeMeta[e.type]?.icon} {e.title}
                        </span>
                        <span className="font-display text-xs text-mist">
                          {formatDateCz(e.date)} · {e.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}
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
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold">{event.venue || "—"}</span>
                <Chip tone="ok">{event.status}</Chip>
              </div>
              <div className="text-xs text-mist">
                {event.title} · {event.role}
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ["📅 Datum", formatDateCz(event.date)],
                  ["🕐 Call time", event.callTime || "—"],
                  ["🎵 Soundcheck", soundcheck?.time ?? "—"],
                  ["🎭 Start", event.time],
                  ["🚗 Cesta", `${travelMinutes(event)} min`],
                  ["👥 Kontakt", event.contact],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <dt className="text-mist">{k}</dt>
                    <dd className="font-display text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-mist">👗 Kostým</span>
                  <span className="text-accent">{costumePct} %</span>
                </div>
                <Progress value={costumePct} />
              </div>
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <Eyebrow>🎬 Harmonogram · {formatDateCz(event.date)}</Eyebrow>
              <ol className="relative space-y-4 pl-5 before:absolute before:top-1 before:bottom-1 before:left-1.5 before:w-px before:bg-foreground/15">
                {runsheet.map((slot) => (
                  <li key={`${slot.time}-${slot.label}`} className="relative">
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
                      <span className="font-display text-xs">{slot.time}</span>
                    </div>
                    {slot.note ? <div className="text-[11px] text-mist">{slot.note}</div> : null}
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel>
              <Eyebrow>🧠 Příprava výkonu</Eyebrow>
              <div className="space-y-4">
                {ws.skills.slice(0, 4).map((skill) => (
                  <Meter key={skill.id} label={skill.label} value={skill.value} />
                ))}
              </div>
              <div className="mt-6">
                <EditableChecklist
                  items={ws.prepChecklist}
                  columns={2}
                  onChange={(next) => patch((w) => ({ ...w, prepChecklist: next }))}
                  makeNew={(label) => ({ id: uid(), label, done: false })}
                />
              </div>
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
