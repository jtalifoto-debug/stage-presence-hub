import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import {
  demoWorkspace,
  emptyWorkspace,
  normalizeWorkspace,
  type Workspace,
} from "./workspace-types";

export type PerformerRow = {
  id: string;
  owner_id: string;
  name: string;
  roles: string[];
  home: string;
  is_demo: boolean;
  data: unknown;
  updated_at: string;
};

const SELECTED_KEY = "performer-os.selected";

async function fetchPerformers(): Promise<PerformerRow[]> {
  const { data, error } = await supabase
    .from("performers")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PerformerRow[];
}

export function usePerformers() {
  return useQuery({ queryKey: ["performers"], queryFn: fetchPerformers });
}

export async function createPerformer(name: string, demo = false) {
  const { data: auth } = await supabase.auth.getUser();
  const ws = demo ? demoWorkspace() : { ...emptyWorkspace(), profile: { name, roles: "", activeRole: "", home: "" } };
  const { data, error } = await supabase
    .from("performers")
    .insert({
      owner_id: auth.user!.id,
      name,
      roles: demo ? demoWorkspace().profile.roles.split(", ") : [],
      home: ws.profile.home,
      is_demo: demo,
      data: ws as unknown as Record<string, unknown>,
    })
    .select()
    .single();
  if (error) throw error;
  return data as PerformerRow;
}

export async function deletePerformer(id: string) {
  const { error } = await supabase.from("performers").delete().eq("id", id);
  if (error) throw error;
}

type Ctx = {
  performers: PerformerRow[];
  performer: PerformerRow | null;
  ws: Workspace;
  loading: boolean;
  saving: boolean;
  select: (id: string) => void;
  refresh: () => void;
  patch: (updater: (ws: Workspace) => Workspace) => void;
  replaceAll: (next: Workspace) => void;
};

const WorkspaceContext = createContext<Ctx | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: performers = [], isLoading, refetch } = usePerformers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [local, setLocal] = useState<Workspace | null>(null);
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSelectedId(window.localStorage.getItem(SELECTED_KEY));
  }, []);

  const performer = useMemo(() => {
    if (!performers.length) return null;
    return performers.find((p) => p.id === selectedId) ?? performers[0]!;
  }, [performers, selectedId]);

  useEffect(() => {
    if (!performer) {
      setLocal(null);
      return;
    }
    setLocal(normalizeWorkspace(performer.data));
  }, [performer?.id, performer?.updated_at]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(
    async (next: Workspace, id: string) => {
      setSaving(true);
      try {
        await supabase
          .from("performers")
          .update({
            data: next as unknown as Record<string, unknown>,
            name: next.profile.name || "Nový performer",
            roles: next.profile.roles ? next.profile.roles.split(",").map((r) => r.trim()).filter(Boolean) : [],
            home: next.profile.home,
          })
          .eq("id", id);
        await autoBackup(id, next);
        queryClient.invalidateQueries({ queryKey: ["performers"] });
        queryClient.invalidateQueries({ queryKey: ["backups"] });
      } finally {
        setSaving(false);
      }
    },
    [queryClient],
  );

  const schedule = useCallback(
    (next: Workspace) => {
      if (!performer) return;
      const id = performer.id;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void save(next, id), 700);
    },
    [performer, save],
  );

  const patch = useCallback(
    (updater: (ws: Workspace) => Workspace) => {
      setLocal((current) => {
        const next = updater(current ?? emptyWorkspace());
        schedule(next);
        return next;
      });
    },
    [schedule],
  );

  const replaceAll = useCallback(
    (next: Workspace) => {
      setLocal(next);
      schedule(next);
    },
    [schedule],
  );

  const value: Ctx = {
    performers,
    performer: performer ?? null,
    ws: local ?? emptyWorkspace(),
    loading: isLoading,
    saving,
    select: (id) => {
      setSelectedId(id);
      if (typeof window !== "undefined") window.localStorage.setItem(SELECTED_KEY, id);
    },
    refresh: () => void refetch(),
    patch,
    replaceAll,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace musí být uvnitř WorkspaceProvider");
  return ctx;
}

/** Keeps an automatic snapshot at most once every 6 hours. */
async function autoBackup(performerId: string, ws: Workspace) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  const { data: last } = await supabase
    .from("backups")
    .select("created_at")
    .eq("performer_id", performerId)
    .eq("kind", "auto")
    .order("created_at", { ascending: false })
    .limit(1);
  const lastAt = last?.[0]?.created_at ? new Date(last[0].created_at).getTime() : 0;
  if (Date.now() - lastAt < 6 * 60 * 60 * 1000) return;
  await supabase.from("backups").insert({
    owner_id: auth.user.id,
    performer_id: performerId,
    label: `Automatická záloha ${new Date().toLocaleString("cs-CZ")}`,
    kind: "auto",
    data: ws as unknown as Record<string, unknown>,
  });
}

export async function createManualBackup(performerId: string, ws: Workspace, label: string) {
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("backups").insert({
    owner_id: auth.user!.id,
    performer_id: performerId,
    label,
    kind: "manual",
    data: ws as unknown as Record<string, unknown>,
  });
  if (error) throw error;
}
