import { createFileRoute } from "@tanstack/react-router";

import stageImg from "@/assets/stage.jpg";
import { Chip, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { credits, materialGroups, performer } from "@/lib/performer-data";

export const Route = createFileRoute("/portfolio")({
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

function PortfolioPage() {
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
            <h2 className="text-2xl font-semibold">{performer.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {performer.roles.map((r) => (
                <Chip key={r} tone="brand">
                  {r}
                </Chip>
              ))}
            </div>
            <p className="mt-4 text-sm text-mist">
              Působiště {performer.home}. Představení, festivalová vystoupení, moderování galavečerů
              a práce před kamerou. Rider a ukázky zasílám na vyžádání do 24 hodin.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {materialGroups.slice(0, 4).map((g) => (
                <div key={g.label} className="glass-soft rounded-xl px-3 py-2">
                  <div className="font-display text-sm">{g.count}</div>
                  <div className="text-[11px] text-mist">{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <Eyebrow>Credits</Eyebrow>
        <ul className="divide-y divide-border text-sm">
          {credits.map((c) => (
            <li key={`${c.project}-${c.year}`} className="flex flex-wrap justify-between gap-2 py-3">
              <span className="font-display">{c.project}</span>
              <span className="text-mist">
                {c.role} · {c.production} · {c.year}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
