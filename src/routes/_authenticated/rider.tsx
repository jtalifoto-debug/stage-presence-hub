import { createFileRoute } from "@tanstack/react-router";

import { Checklist, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { riderSections } from "@/lib/performer-data";

export const Route = createFileRoute("/_authenticated/rider")({
  head: () => ({
    meta: [
      { title: "Technický rider — Performer OS" },
      {
        name: "description",
        content:
          "Technické požadavky na zvuk, stage, video a speciální potřeby — připravené k odeslání produkci.",
      },
      { property: "og:title", content: "Technický rider — Performer OS" },
      {
        property: "og:description",
        content: "Zvuk, stage, video a speciální požadavky na jednom listu.",
      },
    ],
  }),
  component: RiderPage,
});

function RiderPage() {
  return (
    <>
      <PageHeader eyebrow="🎤 Co potřebuji na place" title="Technický rider" />

      <div className="grid gap-6 lg:grid-cols-2">
        {riderSections.map((section) => (
          <Panel key={section.title}>
            <Eyebrow>{section.title}</Eyebrow>
            <Checklist items={section.items.map((label) => ({ label }))} />
          </Panel>
        ))}
      </div>

      <Panel soft>
        <p className="text-sm text-mist">
          Rider posílej produkci nejpozději 7 dní před akcí a zvlášť upozorni na položky, které
          nelze na místě improvizovat (taneční povrch, playback operátor, šatna se zrcadlem).
        </p>
      </Panel>
    </>
  );
}
