import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor } from "@/components/perf/editable";
import { Chip, Eyebrow, PageHeader, Panel, Progress } from "@/components/perf/ui";
import { eventFields, newEvent } from "@/lib/event-fields";
import { eventTypeMeta, formatCzk } from "@/lib/performer-data";
import {
  buildEventPrep,
  formatDateCz,
  liveRunsheet,
  prepScore,
  sortEvents,
  travelMinutes,
} from "@/lib/performer-schedule";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/akce")({
  head: () => ({
    meta: [
      { title: "Akce a detaily — Performer OS" },
      {
        name: "description",
        content:
          "Detail každé akce: klient, místo, call time, honorář, kontakt, podklady a co ještě chybí dopřipravit.",
      },
      { property: "og:title", content: "Akce a detaily — Performer OS" },
      {
        property: "og:description",
        content: "Vše o jedné akci na jedné kartě — od call timu po fakturaci.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { ws, patch } = useWorkspace();
  const list = sortEvents(ws.events);

  return (
    <>
      <PageHeader eyebrow="🎬 Detail závazků" title="Akce" />

      <Panel>
        <RecordEditor
          title="Upravit akce"
          items={ws.events}
          fields={eventFields}
          titleKey="title"
          addLabel="Přidat akci"
          makeNew={newEvent}
          onChange={(next) => patch((w) => ({ ...w, events: next }))}
        />
      </Panel>

      <div className="space-y-6">
        {list.map((event) => {
          const prep = buildEventPrep(event);
          const missing = prep.filter((p) => !p.done);
          const runsheet = liveRunsheet(event);
          const score = prepScore(event);

          return (
            <Panel key={event.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="eyebrow">
                    {eventTypeMeta[event.type]?.icon} {event.type} · {formatDateCz(event.date)}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">{event.title}</h2>
                </div>
                <Chip tone={event.status === "připravit" ? "warn" : "ok"}>{event.status}</Chip>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-3">
                <dl className="space-y-2 text-sm">
                  {[
                    ["Klient", event.client || "—"],
                    ["Místo", `${event.venue}, ${event.city}`],
                    ["Začátek", event.time],
                    ["Call time", event.callTime || "—"],
                    ["Délka", event.length],
                    ["Role", event.role],
                    ["Cesta", `${travelMinutes(event)} min`],
                    ["Honorář", Number(event.fee) ? formatCzk(Number(event.fee)) : "—"],
                    ["Kontakt", event.contact],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4">
                      <dt className="text-mist">{k}</dt>
                      <dd className="font-display text-right">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <Eyebrow>Harmonogram</Eyebrow>
                  <ol className="space-y-2 text-sm">
                    {runsheet.map((slot) => (
                      <li
                        key={`${slot.time}-${slot.label}`}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span className={slot.state === "next" ? "text-mist" : ""}>
                          {slot.label}
                        </span>
                        <span className="font-display text-xs">{slot.time}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <Eyebrow>Příprava</Eyebrow>
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-mist">{missing.length} položek chybí</span>
                    <span className="font-display text-accent">{score} %</span>
                  </div>
                  <Progress value={score} />
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {prep.map((item) => (
                      <li key={item.label} className={item.done ? "text-mist" : ""}>
                        {item.done ? "✓" : "○"} {item.label}
                      </li>
                    ))}
                  </ul>
                  {event.notes ? <p className="mt-4 text-xs text-mist">📌 {event.notes}</p> : null}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
