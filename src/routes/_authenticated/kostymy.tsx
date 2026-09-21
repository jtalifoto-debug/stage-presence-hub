import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EditableChecklist } from "@/components/perf/editable";
import { Button, Chip, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { formatDateCz } from "@/lib/performer-schedule";
import { useWorkspace } from "@/lib/workspace";
import { uid } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/kostymy")({
  head: () => ({
    meta: [
      { title: "Kostýmy a taška — Performer OS" },
      {
        name: "description",
        content: "Stav kostýmu pro nejbližší akci a seznam věcí, které si vzít do tašky.",
      },
      { property: "og:title", content: "Kostýmy a taška — Performer OS" },
      {
        property: "og:description",
        content: "Kostým, boty, doplňky a co nesmí chybět v tašce.",
      },
    ],
  }),
  component: CostumesPage,
});

const BAG_BY_TYPE: Record<string, string[]> = {
  "představení": ["kostým", "baletní boty", "náhradní punčochy", "make-up", "voda", "svačina"],
  "vystoupení": ["kostým", "boty", "hudba na USB", "náhradní tričko", "voda"],
  "moderování": ["scénář", "šaty / oblek", "náhradní baterie do mikroportu", "poznámky k hostům"],
  "natáčení": ["civilní oblečení", "scénář", "termoska", "powerbanka"],
  "focení": ["outfity", "žehlička na vlasy", "make-up", "moodboard"],
  "zkouška": ["tréninkové oblečení", "boty", "voda", "poznámky"],
};

function CostumesPage() {
  const { ws, patch } = useWorkspace();
  const [note, setNote] = useState<string | null>(null);

  const next =
    [...ws.events].sort((a, b) => a.date.localeCompare(b.date)).find((e) => e.status !== "hotovo") ??
    ws.events[0];

  const packBag = () => {
    if (!next) return;
    const suggested = BAG_BY_TYPE[next.type] ?? ["kostým", "boty", "voda", "svačina"];
    const existing = new Set(ws.bag.map((b) => b.label.toLowerCase()));
    const added = suggested.filter((label) => !existing.has(label.toLowerCase()));
    patch((w) => ({
      ...w,
      bag: [...w.bag, ...added.map((label) => ({ id: uid(), label, done: false }))],
    }));
    setNote(
      added.length
        ? `Do tašky jsem přidala ${added.length} věcí podle typu akce (${next.type}).`
        : "V tašce už máš všechno, co k této akci patří.",
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="👗 Co si vezmu"
        title="Kostýmy"
        action={<Button onClick={packBag}>🎒 Připravit tašku</Button>}
      />

      <Panel soft>
        {next ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display text-sm font-semibold">Nejbližší akce: {next.title}</div>
              <div className="mt-1 text-xs text-mist">
                {formatDateCz(next.date)} · {next.venue} · role {next.role || "—"}
              </div>
            </div>
            <Chip tone="warn">call {next.callTime || next.time}</Chip>
          </div>
        ) : (
          <p className="text-sm text-mist">
            Zatím tu není žádná akce — přidej ji v Kalendáři a taška se přizpůsobí jejímu typu.
          </p>
        )}
        {note ? <p className="mt-3 text-sm text-accent">{note}</p> : null}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <Eyebrow>Kostým</Eyebrow>
          <EditableChecklist
            items={ws.costume}
            makeNew={(label) => ({ id: uid(), label, done: false })}
            onChange={(next2) => patch((w) => ({ ...w, costume: next2 }))}
            addLabel="Přidat část kostýmu"
          />
        </Panel>

        <Panel>
          <Eyebrow>🎒 Taška</Eyebrow>
          <EditableChecklist
            items={ws.bag}
            columns={2}
            makeNew={(label) => ({ id: uid(), label, done: false })}
            onChange={(next2) => patch((w) => ({ ...w, bag: next2 }))}
            addLabel="Přidat do tašky"
          />
        </Panel>
      </div>
    </>
  );
}
