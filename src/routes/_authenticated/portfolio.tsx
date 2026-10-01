import { createFileRoute } from "@tanstack/react-router";

import stageImg from "@/assets/stage.jpg";
import { LabeledField, RecordEditor, TextInput, type Field } from "@/components/perf/editable";
import { Chip, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid, type CreditRow, type Workspace } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Performer OS" },
      {
        name: "description",
        content: "Profil performera: role, žánry, reference, ukázky a odehrané projekty.",
      },
      { property: "og:title", content: "Portfolio — Performer OS" },
      {
        property: "og:description",
        content: "Vizitka pro produkce — role, ukázky a credits na jedné stránce.",
      },
    ],
  }),
  component: PortfolioPage,
});

const creditFields: Field<CreditRow>[] = [
  { key: "project", label: "Projekt", width: "lg" },
  { key: "role", label: "Role" },
  { key: "production", label: "Produkce" },
  { key: "year", label: "Rok" },
];

function PortfolioPage() {
  const { ws, patch } = useWorkspace();
  const roles = ws.profile.roles.split(",").map((r) => r.trim()).filter(Boolean);
  const setProfile = (key: keyof Workspace["profile"], v: string) =>
    patch((w) => ({ ...w, profile: { ...w.profile, [key]: v } }));

  return (
    <>
      <PageHeader eyebrow="📸 Vizitka pro produkce" title="Portfolio" />

      <Panel>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="glass-soft overflow-hidden rounded-2xl">
            <img
              src={stageImg}
              alt="Jeviště v modrém světle"
              width={960}
              height={720}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{ws.profile.name || "Bez jména"}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {roles.map((r) => (
                <Chip key={r} tone="brand">
                  {r}
                </Chip>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <LabeledField label="Jméno">
                <TextInput value={ws.profile.name} onChange={(v) => setProfile("name", v)} />
              </LabeledField>
              <LabeledField label="Působiště">
                <TextInput value={ws.profile.home} onChange={(v) => setProfile("home", v)} />
              </LabeledField>
              <LabeledField label="Role (oddělené čárkou)">
                <TextInput value={ws.profile.roles} onChange={(v) => setProfile("roles", v)} />
              </LabeledField>
              <LabeledField label="Hlavní role teď">
                <TextInput value={ws.profile.activeRole} onChange={(v) => setProfile("activeRole", v)} />
              </LabeledField>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              {[
                [ws.credits.length, "rolí"],
                [ws.events.length, "akcí"],
                [ws.materials.length, "materiálů"],
              ].map(([n, l]) => (
                <div key={l} className="glass-soft rounded-xl px-3 py-2">
                  <div className="font-display text-sm">{n}</div>
                  <div className="text-[11px] text-mist">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <Eyebrow>Credits</Eyebrow>
        <RecordEditor
          items={ws.credits}
          fields={creditFields}
          titleKey="project"
          addLabel="Přidat credit"
          makeNew={() => ({ id: uid(), project: "Nový projekt", role: "", production: "", year: String(new Date().getFullYear()) })}
          onChange={(next) => patch((w) => ({ ...w, credits: next }))}
        />
      </Panel>
    </>
  );
}
