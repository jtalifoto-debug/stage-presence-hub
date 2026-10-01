import { createFileRoute, Link } from "@tanstack/react-router";

import { Chip, Eyebrow, Panel, PageHeader, Progress } from "@/components/perf/ui";
import { eventTypeMeta, formatCzk } from "@/lib/performer-data";
import {
  formatDateCz,
  liveRunsheet,
  prepScore,
  sortEvents,
  weekdayCz,
} from "@/lib/performer-schedule";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/kalendar")({
  head: () => ({
    meta: [
      { title: "Kalendář závazků — Performer OS" },
      {
        name: "description",
        content:
          "Kalendář podle typu závazku: představení, zkoušky, natáčení, tréninky i regenerace s call timem a harmonogramem.",
      },
      { property: "og:title", content: "Kalendář závazků — Performer OS" },
      {
        property: "og:description",
        content: "Každá akce má svůj typ, call time a vlastní harmonogram dne.",
      },
    ],
  }),
  component: CalendarPage,
});

const statusTone = {
  potvrzeno: "ok",
  nabídka: "accent",
  připravit: "warn",
  hotovo: "mist",
} as const;

function CalendarPage() {
  const { ws } = useWorkspace();
  const list = sortEvents(ws.events);

  return (
    <>
      <PageHeader eyebrow="📅 Podle typu závazku" title="Kalendář" />

      <Panel soft>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(eventTypeMeta).map(([type, meta]) => {
              const count = ws.events.filter((e) => e.type === type).length;
              return (
                <Chip key={type} tone={(count ? meta.tone : "mist") as "brand"}>
                  {meta.icon} {type} {count ? `· ${count}` : ""}
                </Chip>
              );
            })}
          </div>
          <Link to="/akce" className="font-display text-xs text-accent">
            + přidat / upravit akce →
          </Link>
        </div>
      </Panel>

      {list.length === 0 ? (
        <Panel>
          <p className="text-sm text-mist">Kalendář je prázdný. Akce přidáš v sekci Akce.</p>
        </Panel>
      ) : null}

      <div className="space-y-4">
        {list.map((event) => {
          const runsheet = liveRunsheet(event);
          const meta = eventTypeMeta[event.type] ?? { icon: "•", tone: "mist" };
          const score = prepScore(event);
          return (
            <Panel key={event.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="glass-soft grid size-16 shrink-0 place-items-center rounded-2xl text-center">
                    <div>
                      <div className="text-[10px] tracking-widest text-mist uppercase">
                        {weekdayCz(event.date)}
                      </div>
                      <div className="font-display text-sm font-semibold">
                        {formatDateCz(event.date)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold">
                      {meta.icon} {event.title}
                    </div>
                    <div className="mt-1 text-xs text-mist">
                      {event.venue} · {event.city} · {event.length}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip tone={meta.tone as "brand"}>{event.type}</Chip>
                      <Chip tone={statusTone[event.status] ?? "mist"}>{event.status}</Chip>
                      {event.callTime ? <Chip>🕐 call {event.callTime}</Chip> : null}
                      {Number(event.fee) ? <Chip>{formatCzk(Number(event.fee))}</Chip> : null}
                    </div>
                  </div>
                </div>
                <div className="w-40">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-mist">připravenost</span>
                    <span className="font-display text-accent">{score} %</span>
                  </div>
                  <Progress value={score} />
                  <Link
                    to="/akce"
                    className="font-display mt-3 block text-right text-xs text-accent"
                  >
                    detail akce →
                  </Link>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <Eyebrow>Harmonogram akce</Eyebrow>
                <div className="flex flex-wrap gap-2">
                  {runsheet.map((slot) => (
                    <span
                      key={`${slot.time}-${slot.label}`}
                      className={`glass-soft rounded-xl px-2.5 py-1.5 text-[11px] ${
                        slot.state === "now" ? "text-accent" : "text-mist"
                      }`}
                    >
                      <span className="font-display">{slot.time}</span> {slot.label}
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
