import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { Button, Chip, Eyebrow, PageHeader, Panel } from "@/components/perf/ui";
import { TextInput } from "@/components/perf/editable";
import { supabase } from "@/integrations/supabase/client";
import { createManualBackup, useWorkspace } from "@/lib/workspace";
import { demoWorkspace, emptyWorkspace, normalizeWorkspace } from "@/lib/workspace-types";

export const Route = createFileRoute("/_authenticated/zalohy")({
  head: () => ({
    meta: [
      { title: "Zálohy — Performer OS" },
      {
        name: "description",
        content: "Zálohy tvých dat, obnovení dřívějšího stavu, export a import souboru.",
      },
      { property: "og:title", content: "Zálohy — Performer OS" },
      {
        property: "og:description",
        content: "Nic se neztratí: automatické i ruční zálohy, export a import.",
      },
    ],
  }),
  component: BackupsPage,
});

type BackupRow = {
  id: string;
  label: string;
  kind: string;
  created_at: string;
  data: unknown;
};

function BackupsPage() {
  const { performer, ws, replaceAll, saving } = useWorkspace();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const { data: backups = [] } = useQuery({
    queryKey: ["backups", performer?.id],
    enabled: Boolean(performer?.id),
    queryFn: async (): Promise<BackupRow[]> => {
      const { data, error } = await supabase
        .from("backups")
        .select("id,label,kind,created_at,data")
        .eq("performer_id", performer!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BackupRow[];
    },
  });

  if (!performer) {
    return (
      <>
        <PageHeader eyebrow="🗂 Nic se neztratí" title="Zálohy" />
        <Panel>
          <p className="text-sm text-mist">
            Nejdřív si v sekci Performeři vyber, koho chceš zálohovat.
          </p>
        </Panel>
      </>
    );
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(ws, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performer-os-${performer.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      replaceAll(normalizeWorkspace(parsed));
      setNote("Data ze souboru jsou nahraná.");
    } catch {
      setNote("Soubor se nepovedlo přečíst — čekám soubor vyexportovaný odsud.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="🗂 Nic se neztratí"
        title="Zálohy"
        action={<Chip tone={saving ? "warn" : "ok"}>{saving ? "ukládám…" : "uloženo"}</Chip>}
      />

      <Panel soft>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <TextInput value={label} onChange={setLabel} placeholder="Popis zálohy (nepovinné)" />
          </div>
          <Button
            onClick={() => {
              void createManualBackup(
                performer.id,
                ws,
                label.trim() || `Ruční záloha ${new Date().toLocaleString("cs-CZ")}`,
              ).then(() => {
                setLabel("");
                setNote("Záloha vytvořena.");
                queryClient.invalidateQueries({ queryKey: ["backups"] });
              });
            }}
          >
            Vytvořit zálohu
          </Button>
          <Button variant="ghost" onClick={exportJson}>
            Exportovat soubor
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            Importovat soubor
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importJson(file);
              e.target.value = "";
            }}
          />
        </div>
        {note ? <p className="mt-3 text-sm text-accent">{note}</p> : null}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <Eyebrow>Historie záloh</Eyebrow>
          {backups.length === 0 ? (
            <p className="text-sm text-mist">Zatím žádná záloha — automatická se udělá při ukládání.</p>
          ) : (
            <ul className="space-y-2">
              {backups.map((b) => (
                <li
                  key={b.id}
                  className="glass-soft flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="font-display truncate text-sm">{b.label}</div>
                    <div className="text-xs text-mist">
                      {new Date(b.created_at).toLocaleString("cs-CZ")} ·{" "}
                      {b.kind === "auto" ? "automatická" : "ruční"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      replaceAll(normalizeWorkspace(b.data));
                      setNote("Data obnovena ze zálohy.");
                    }}
                  >
                    Obnovit
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <Eyebrow>Ukázková data</Eyebrow>
          <p className="mb-4 text-sm text-mist">
            Ukázková data ti ukážou, jak aplikace funguje. Až budeš vkládat vlastní smlouvy,
            honoráře a kontakty, klidně je smaž.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                replaceAll({ ...emptyWorkspace(), profile: ws.profile });
                setNote("Ukázková data odstraněna — sekce jsou prázdné a připravené na tvoje data.");
              }}
            >
              Odstranit ukázková data
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                replaceAll(demoWorkspace());
                setNote("Ukázková data obnovena.");
              }}
            >
              Obnovit ukázková data
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}
