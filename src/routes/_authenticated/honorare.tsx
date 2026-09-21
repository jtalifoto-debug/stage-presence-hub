import { createFileRoute } from "@tanstack/react-router";

import { RecordEditor, TextInput, type Field } from "@/components/perf/editable";
import { Chip, Eyebrow, PageHeader, Panel, StatCard } from "@/components/perf/ui";
import { formatCzk } from "@/lib/performer-data";
import { useWorkspace } from "@/lib/workspace";
import {
  uid,
  type ClientRow,
  type ContractRow,
  type FinanceRow,
  type ValueRow,
} from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/honorare")({
  head: () => ({
    meta: [
      { title: "Honoráře a smlouvy — Performer OS" },
      {
        name: "description",
        content:
          "Honoráře, náklady, smlouvy a kontakty klientů — vlož vlastní čísla a měj přehled o penězích.",
      },
      { property: "og:title", content: "Honoráře a smlouvy — Performer OS" },
      {
        property: "og:description",
        content: "Kolik ti kdo dluží, co je podepsané a na koho se obrátit.",
      },
    ],
  }),
  component: MoneyPage,
});

const financeFields: Field<FinanceRow>[] = [
  { key: "event", label: "Akce", width: "lg" },
  { key: "fee", label: "Honorář (Kč)", type: "number" },
  { key: "costs", label: "Náklady (Kč)", type: "number" },
  {
    key: "state",
    label: "Stav",
    type: "select",
    options: ["zaplaceno", "fakturováno", "čeká", "nabídka"],
  },
];

const contractFields: Field<ContractRow>[] = [
  { key: "title", label: "Smlouva", width: "lg" },
  { key: "client", label: "Klient" },
  { key: "event", label: "Akce" },
  { key: "fee", label: "Honorář (Kč)", type: "number" },
  { key: "signed", label: "Podepsáno", type: "check" },
  { key: "state", label: "Stav", type: "select", options: ["podepsáno", "čeká na podpis", "návrh", "zrušeno"] },
  { key: "notes", label: "Poznámky", type: "textarea" },
];

const clientFields: Field<ClientRow>[] = [
  { key: "name", label: "Klient", width: "lg" },
  { key: "contact", label: "Kontaktní osoba" },
  { key: "phone", label: "Telefon" },
  { key: "email", label: "E-mail" },
  { key: "note", label: "Poznámka", type: "textarea" },
];

const costFields: Field<ValueRow>[] = [
  { key: "label", label: "Náklad", width: "lg" },
  { key: "value", label: "Kč", type: "number" },
];

function MoneyPage() {
  const { ws, patch } = useWorkspace();
  const items = ws.finance.items;
  const gross = items.reduce((s, i) => s + (Number(i.fee) || 0), 0);
  const costs = items.reduce((s, i) => s + (Number(i.costs) || 0), 0);
  const waiting = items
    .filter((i) => i.state !== "zaplaceno")
    .reduce((s, i) => s + (Number(i.fee) || 0), 0);
  const unsigned = ws.contracts.filter((c) => !c.signed).length;

  return (
    <>
      <PageHeader
        eyebrow="💰 Peníze"
        title="Honoráře"
        action={<Chip tone={unsigned ? "warn" : "ok"}>{unsigned} smluv bez podpisu</Chip>}
      />

      <Panel soft>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs tracking-wider text-mist uppercase">Období</span>
          <div className="w-48">
            <TextInput
              value={ws.finance.month}
              placeholder="např. Září 2026"
              onChange={(v) =>
                patch((w) => ({ ...w, finance: { ...w.finance, month: v } }))
              }
            />
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard value={formatCzk(gross)} label="Honoráře celkem" />
        <StatCard value={formatCzk(costs)} label="Náklady" />
        <StatCard value={formatCzk(gross - costs)} label="Čistý zůstatek" />
        <StatCard value={formatCzk(waiting)} label="Čeká na zaplacení" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <RecordEditor
            title="Honoráře podle akcí"
            items={items}
            fields={financeFields}
            titleKey="event"
            addLabel="Přidat honorář"
            makeNew={() => ({ id: uid(), event: "Nová akce", fee: 0, costs: 0, state: "čeká" })}
            onChange={(next) => patch((w) => ({ ...w, finance: { ...w.finance, items: next } }))}
          />
        </Panel>

        <Panel>
          <RecordEditor
            title="Náklady"
            items={ws.finance.costs}
            fields={costFields}
            titleKey="label"
            addLabel="Přidat náklad"
            makeNew={() => ({ id: uid(), label: "Nový náklad", value: 0 })}
            onChange={(next) => patch((w) => ({ ...w, finance: { ...w.finance, costs: next } }))}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <RecordEditor
            title="Smlouvy"
            items={ws.contracts}
            fields={contractFields}
            titleKey="title"
            addLabel="Přidat smlouvu"
            makeNew={() => ({
              id: uid(),
              title: "Nová smlouva",
              client: "",
              event: "",
              fee: 0,
              signed: false,
              state: "návrh",
              notes: "",
            })}
            onChange={(next) => patch((w) => ({ ...w, contracts: next }))}
          />
        </Panel>

        <Panel>
          <RecordEditor
            title="Kontakty klientů"
            items={ws.clients}
            fields={clientFields}
            titleKey="name"
            addLabel="Přidat klienta"
            makeNew={() => ({ id: uid(), name: "Nový klient", contact: "", phone: "", email: "", note: "" })}
            onChange={(next) => patch((w) => ({ ...w, clients: next }))}
          />
        </Panel>
      </div>

      <Panel soft>
        <Eyebrow>Tip</Eyebrow>
        <p className="text-sm text-mist">
          U každé akce si drž honorář i náklady (doprava, kostým, make-up) — čistý zůstatek ti pak
          řekne, kolik ti vystoupení skutečně vyneslo.
        </p>
      </Panel>
    </>
  );
}
