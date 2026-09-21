import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EditableChecklist, TextInput } from "@/components/perf/editable";
import { Button, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { useWorkspace } from "@/lib/workspace";
import { uid } from "@/lib/workspace-types";

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

const STANDARD: Record<string, string[]> = {
  Zvuk: ["2× monitor na jevišti", "bezdrátový headset mikrofon", "playback z notebooku (jack 3,5)"],
  Stage: ["taneční povrch min. 6 × 6 m", "čisté a rovné jeviště", "šatna se zrcadlem a vodou"],
  Světla: ["základní bílé plné světlo", "následné sledování ze předu"],
  Ostatní: ["technická zkouška 60 min před akcí", "kontakt na techniky předem", "voda na jevišti"],
};

function RiderPage() {
  const { ws, patch } = useWorkspace();
  const [newSection, setNewSection] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const sections = useMemo(() => {
    const map = new Map<string, typeof ws.rider>();
    for (const row of ws.rider) {
      const key = row.section || "Ostatní";
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return [...map.entries()];
  }, [ws.rider]);

  const applyStandard = () => {
    const existing = new Set(ws.rider.map((r) => `${r.section}|${r.label}`.toLowerCase()));
    const added = Object.entries(STANDARD).flatMap(([section, labels]) =>
      labels
        .filter((label) => !existing.has(`${section}|${label}`.toLowerCase()))
        .map((label) => ({ id: uid(), section, label, done: false })),
    );
    patch((w) => ({ ...w, rider: [...w.rider, ...added] }));
    setNote(added.length ? `Doplnila jsem ${added.length} standardních položek.` : "Standard už máš celý.");
  };

  const copyRider = () => {
    const text = sections
      .map(([title, rows]) => `${title}:\n${rows.map((r) => `- ${r.label}`).join("\n")}`)
      .join("\n\n");
    void navigator.clipboard?.writeText(`Technický rider — ${ws.profile.name}\n\n${text}`);
    setNote("Rider je zkopírovaný — můžeš ho vložit do e-mailu produkci.");
  };

  return (
    <>
      <PageHeader
        eyebrow="🎤 Co potřebuji na place"
        title="Technický rider"
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={applyStandard}>
              Můj standardní rider
            </Button>
            <Button onClick={copyRider}>Zkopírovat pro produkci</Button>
          </div>
        }
      />

      {note ? (
        <Panel soft>
          <p className="text-sm text-accent">{note}</p>
        </Panel>
      ) : null}

      <Panel soft>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const title = newSection.trim();
            if (!title) return;
            patch((w) => ({
              ...w,
              rider: [...w.rider, { id: uid(), section: title, label: "nová položka", done: false }],
            }));
            setNewSection("");
          }}
        >
          <div className="min-w-[220px] flex-1">
            <TextInput value={newSection} onChange={setNewSection} placeholder="Nová sekce riderу (např. Video)" />
          </div>
          <Button variant="ghost">+ Přidat sekci</Button>
        </form>
      </Panel>

      {sections.length === 0 ? (
        <Panel>
          <p className="text-sm text-mist">
            Rider je prázdný. Klikni na „Můj standardní rider“ nebo si přidej vlastní sekci.
          </p>
        </Panel>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map(([title, rows]) => (
          <Panel key={title}>
            <Eyebrow>{title}</Eyebrow>
            <EditableChecklist
              items={rows.map((r) => ({ id: r.id, label: r.label, done: r.done }))}
              makeNew={(label) => ({ id: uid(), label, done: false })}
              addLabel="Přidat požadavek"
              onChange={(nextRows) => {
                patch((w) => {
                  const others = w.rider.filter((r) => (r.section || "Ostatní") !== title);
                  return {
                    ...w,
                    rider: [
                      ...others,
                      ...nextRows.map((r) => ({ id: r.id, section: title, label: r.label, done: r.done })),
                    ],
                  };
                });
              }}
            />
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
