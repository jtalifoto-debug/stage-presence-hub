import {
  bagItems,
  careerTracks,
  costumeItems,
  credits,
  events as demoEvents,
  finance,
  logistics,
  materialsByProject,
  performanceSkills,
  performer,
  preparationChecklist,
  projects,
  recoveryLog,
  reflections,
  riderSections,
  sceneProgress,
  trainingLog,
  type EventStatus,
  type EventType,
} from "./performer-data";

export type { EventStatus, EventType };

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export type PerfEventRow = {
  id: string;
  title: string;
  type: EventType;
  client: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  callTime?: string;
  length: string;
  role: string;
  contact: string;
  fee: number;
  status: EventStatus;
  notes?: string;
  attachments?: string[];
};

export type ContractRow = {
  id: string;
  title: string;
  client: string;
  event: string;
  fee: number;
  signed: boolean;
  state: string;
  notes: string;
};

export type ClientRow = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  note: string;
};

export type ProjectRow = {
  id: string;
  name: string;
  role: string;
  state: string;
  deadline: string;
  progress: number;
};

export type ValueRow = { id: string; label: string; value: number };
export type SceneRow = { id: string; label: string; value: number; state: string };
export type TrainingRow = { id: string; date: string; total: number; parts: string; feeling: string };
export type MaterialRow = { id: string; project: string; icon: string; label: string; url: string };
export type CheckRow = { id: string; label: string; done: boolean };
export type RiderRow = { id: string; section: string; label: string; done: boolean };
export type StepRow = { id: string; label: string; value: string; done: boolean };
export type FinanceRow = { id: string; event: string; fee: number; costs: number; state: string };
export type CreditRow = { id: string; project: string; role: string; year: string; production: string };
export type CareerRow = { id: string; label: string; value: number; skills: string };
export type RecoveryRow = {
  id: string;
  date: string;
  energy: number;
  body: number;
  mind: number;
  stress: number;
  helped: string;
};
export type ReflectionRow = {
  id: string;
  event: string;
  rating: number;
  worked: string;
  didnt: string;
  learned: string;
  next: string;
};

export type Workspace = {
  profile: { name: string; roles: string; activeRole: string; home: string };
  events: PerfEventRow[];
  contracts: ContractRow[];
  clients: ClientRow[];
  projects: ProjectRow[];
  skills: ValueRow[];
  scenes: SceneRow[];
  training: TrainingRow[];
  materials: MaterialRow[];
  prepChecklist: CheckRow[];
  costume: CheckRow[];
  bag: CheckRow[];
  rider: RiderRow[];
  logistics: { from: string; to: string; duration: string; steps: StepRow[] };
  finance: { month: string; items: FinanceRow[]; costs: ValueRow[] };
  credits: CreditRow[];
  career: CareerRow[];
  recovery: RecoveryRow[];
  reflections: ReflectionRow[];
};

export function emptyWorkspace(): Workspace {
  return {
    profile: { name: "", roles: "", activeRole: "", home: "" },
    events: [],
    contracts: [],
    clients: [],
    projects: [],
    skills: [],
    scenes: [],
    training: [],
    materials: [],
    prepChecklist: [],
    costume: [],
    bag: [],
    rider: [],
    logistics: { from: "", to: "", duration: "", steps: [] },
    finance: { month: "", items: [], costs: [] },
    credits: [],
    career: [],
    recovery: [],
    reflections: [],
  };
}

export function demoWorkspace(): Workspace {
  return {
    profile: {
      name: performer.name,
      roles: performer.roles.join(", "),
      activeRole: performer.activeRole,
      home: performer.home,
    },
    events: demoEvents.map((e) => ({ ...e, attachments: e.attachments ?? [] })),
    contracts: [
      {
        id: uid(),
        title: "Romeo & Julie — sezóna 2026",
        client: "XYZ Production",
        event: "Večerní představení — Romeo & Julie",
        fee: 6500,
        signed: true,
        state: "podepsáno",
        notes: "Honorář za jedno představení, výplata do 14 dnů.",
      },
      {
        id: uid(),
        title: "Gala večer — moderování",
        client: "Nova Events",
        event: "Gala večer — moderování",
        fee: 12000,
        signed: false,
        state: "čeká na podpis",
        notes: "Doplnit číslo účtu a fakturační údaje.",
      },
    ],
    clients: [
      {
        id: uid(),
        name: "XYZ Production",
        contact: "Marek Hruška",
        phone: "+420 777 123 456",
        email: "marek@xyzproduction.cz",
        note: "Produkce divadelní řady, platí spolehlivě.",
      },
      {
        id: uid(),
        name: "Nova Events",
        contact: "Klára Bílá",
        phone: "+420 601 998 221",
        email: "klara@novaevents.cz",
        note: "Moderování firemních a galavečerů.",
      },
    ],
    projects: projects.map((p) => ({ ...p, id: uid() })),
    skills: performanceSkills.map((s) => ({ ...s, id: uid() })),
    scenes: sceneProgress.map((s) => ({ ...s, id: uid() })),
    training: trainingLog.map((t) => ({ ...t, id: uid() })),
    materials: materialsByProject.flatMap((group) =>
      group.items.map((item) => ({
        id: uid(),
        project: group.project,
        icon: item.icon,
        label: item.label,
        url: "",
      })),
    ),
    prepChecklist: preparationChecklist.map((c) => ({ ...c, id: uid() })),
    costume: costumeItems.map((c) => ({ ...c, id: uid() })),
    bag: bagItems.map((label) => ({ id: uid(), label, done: false })),
    rider: riderSections.flatMap((section) =>
      section.items.map((label) => ({ id: uid(), section: section.title, label, done: false })),
    ),
    logistics: {
      from: logistics.from,
      to: logistics.to,
      duration: logistics.duration,
      steps: logistics.steps.map((s) => ({ ...s, id: uid() })),
    },
    finance: {
      month: finance.month,
      items: finance.items.map((i) => ({ ...i, id: uid() })),
      costs: finance.costBreakdown.map((c) => ({ ...c, id: uid() })),
    },
    credits: credits.map((c) => ({ ...c, id: uid() })),
    career: careerTracks.map((c) => ({ id: uid(), label: c.label, value: c.value, skills: c.skills.join(", ") })),
    recovery: recoveryLog.map((r) => ({ ...r, id: uid(), helped: r.helped.join(", ") })),
    reflections: reflections.map((r) => ({ ...r, id: uid() })),
  };
}

/** Fills in any section missing from a stored workspace. */
export function normalizeWorkspace(raw: unknown): Workspace {
  const base = emptyWorkspace();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<Workspace>;
  return {
    ...base,
    ...data,
    profile: { ...base.profile, ...(data.profile ?? {}) },
    logistics: { ...base.logistics, ...(data.logistics ?? {}) },
    finance: { ...base.finance, ...(data.finance ?? {}) },
  };
}
