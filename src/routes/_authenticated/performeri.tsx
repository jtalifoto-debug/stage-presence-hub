import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button, Chip, Eyebrow, PageHeader, Panel, Progress } from "@/components/perf/ui";
import { TextInput } from "@/components/perf/editable";
import { createPerformer, deletePerformer, useWorkspace } from "@/lib/workspace";
import { normalizeWorkspace } from "@/lib/workspace-types";
import { formatCzk } from "@/lib/performer-data";

export const Route = createFileRoute("/_authenticated/performeri")({
  head: () => ({
    meta: [
      { title: "Performeři — Performer OS" },
      {
        name: "description",
        content:
          "Nástěnka agenta: všichni performeři, jejich nejbližší akce, stav přípravy a honoráře.",
      },
      { property: "og:title", content: "Performeři — Performer OS" },
      {
        property: "og:description",
        content: "Kdo co má: akce, příprava a honoráře všech performerů.",
      },
    ],
  }),
  component: PerformersPage,
});

function PerformersPage() {
  const { performers, performer, select, refresh, loading } = useWorkspace();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async (demo: boolean) => {
    setBusy(true);
    try {
      const created = await createPerformer(
        demo ? "Eliška Nová (demo)" : name.trim() || "Nový performer",
        demo,
      );
      setName("");
      refresh();
      select(created.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="👥 Kdo co má" title="Performeři" />

      <Panel soft>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <TextInput value={name} onChange={setName} placeholder="Jméno performera" />
          </div>
          <Button onClick={() => void add(false)}>{busy ? "Zakládám…" : "+ Přidat performera"}</Button>
          <Button variant="ghost" onClick={() => void add(true)}>
            Vložit ukázková data
          </Button>
        </div>
      </Panel>

      {loading ? <p className="text-sm text-mist">Načítám…</p> : null}
      {!loading && performers.length === 0 ? (
        <Panel>
          <p className="text-sm text-mist">
            Zatím tu nikdo není. Přidej sebe nebo svého prvního performera — pak můžeš vyplnit akce,
            smlouvy, honoráře i kontakty klientů.
          </p>
        </Panel>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {performers.map((row) => {
          const ws = normalizeWorkspace(row.data);
          const upcoming = [...ws.events]
            .sort((a, b) => a.date.localeCompare(b.date))
            .filter((e) => e.status !== "hotovo");
          const next = upcoming[0];
          const prep = ws.prepChecklist;
          const prepPct = prep.length
            ? Math.round((prep.filter((p) => p.done).length / prep.length) * 100)
            : 0;
          const fees = ws.events.reduce((sum, e) => sum + (Number(e.fee) || 0), 0);
          const unsigned = ws.contracts.filter((c) => !c.signed).length;
          const active = performer?.id === row.id;

          return (
            <Panel key={row.id} className={active ? "ring-1 ring-brand/40" : ""}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-base font-semibold">{row.name}</div>
                  <div className="mt-1 text-xs text-mist">
                    {row.roles.length ? row.roles.join(" · ") : "role nevyplněny"}
                  </div>
                </div>
                {row.is_demo ? <Chip tone="warn">demo</Chip> : null}
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-mist">Nejbližší akce</dt>
                  <dd className="font-display truncate text-right">
                    {next ? `${next.date} · ${next.title}` : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-mist">Akcí v plánu</dt>
                  <dd className="font-display">{upcoming.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-mist">Honoráře celkem</dt>
                  <dd className="font-display">{formatCzk(fees)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-mist">Nepodepsané smlouvy</dt>
                  <dd className={`font-display ${unsigned ? "text-warn" : "text-ok"}`}>{unsigned}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-mist">Příprava</span>
                  <span className="text-accent">{prepPct} %</span>
                </div>
                <Progress value={prepPct} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant={active ? "ghost" : "primary"} onClick={() => select(row.id)}>
                  {active ? "právě zobrazeno" : "Otevřít"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    void deletePerformer(row.id).then(refresh);
                  }}
                >
                  Smazat
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel soft>
        <Eyebrow>Jak to funguje</Eyebrow>
        <p className="text-sm text-mist">
          Vybraný performer se používá ve všech ostatních sekcích — Dnes, Kalendář, Honoráře,
          Kostýmy a dalších. Data se ukládají automaticky a zálohují se v sekci Zálohy.
        </p>
      </Panel>
    </>
  );
}
