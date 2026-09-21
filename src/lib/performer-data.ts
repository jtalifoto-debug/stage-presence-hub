export type EventType =
  | "představení"
  | "vystoupení"
  | "moderování"
  | "natáčení"
  | "focení"
  | "zkouška"
  | "trénink"
  | "regenerace"
  | "fitting"
  | "technická zkouška"
  | "cesta"
  | "schůzka"
  | "administrativa";

export type EventStatus = "potvrzeno" | "nabídka" | "připravit" | "hotovo";

export type PerfEvent = {
  id: string;
  title: string;
  type: EventType;
  client: string;
  venue: string;
  city: string;
  date: string; // ISO
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

export const performer = {
  name: "Eliška Nová",
  roles: ["Tanečnice", "Herečka", "Moderátorka"],
  activeRole: "Tanečnice",
  home: "Praha 7, Letná",
};

export const events: PerfEvent[] = [
  {
    id: "e1",
    title: "Večerní představení — Romeo & Julie",
    type: "představení",
    client: "XYZ Production",
    venue: "Divadlo ABC",
    city: "Praha",
    date: "2026-09-18",
    time: "18:30",
    callTime: "16:30",
    length: "2 h 10 min",
    role: "tanečnice",
    contact: "Marek Hruška · +420 777 123 456",
    fee: 6500,
    status: "potvrzeno",
    notes: "Vstup pro účinkující ze dvora, backstage vlevo za jevištěm.",
    attachments: ["scénář.pdf", "soundtrack.mp3", "choreo_03.mp4"],
  },
  {
    id: "e2",
    title: "Trénink — choreografie + mobilita",
    type: "trénink",
    client: "vlastní",
    venue: "Studio Dancehouse",
    city: "Praha",
    date: "2026-09-19",
    time: "08:00",
    length: "45 min",
    role: "—",
    contact: "—",
    fee: 0,
    status: "hotovo",
  },
  {
    id: "e3",
    title: "Gala večer — moderování",
    type: "moderování",
    client: "Nova Events",
    venue: "Forum Karlín",
    city: "Praha",
    date: "2026-09-20",
    time: "19:00",
    callTime: "17:00",
    length: "3 h",
    role: "moderátorka",
    contact: "Klára Bílá · +420 601 998 221",
    fee: 12000,
    status: "připravit",
    notes: "Scénář ve verzi 3, otázky pro hosty dodá produkce v pátek.",
    attachments: ["scenar_v3.pdf", "otazky_hoste.docx"],
  },
  {
    id: "e4",
    title: "Festival XYZ",
    type: "vystoupení",
    client: "Festival XYZ",
    venue: "Letní scéna",
    city: "Brno",
    date: "2026-09-21",
    time: "18:30",
    callTime: "16:00",
    length: "20 min",
    role: "tanečnice",
    contact: "Petr Doležal · +420 733 441 909",
    fee: 8000,
    status: "připravit",
    notes: "Cesta 2 h 15 min, parkování u areálu pouze s povolením.",
    attachments: ["rider.pdf"],
  },
  {
    id: "e5",
    title: "Natáčení reklamního spotu",
    type: "natáčení",
    client: "Studio R",
    venue: "Studio R — hala 2",
    city: "Praha",
    date: "2026-09-23",
    time: "09:00",
    callTime: "08:15",
    length: "celý den",
    role: "herečka",
    contact: "Anna Kvasničková · +420 606 112 334",
    fee: 15000,
    status: "potvrzeno",
  },
  {
    id: "e6",
    title: "Fitting kostýmů — Hamlet",
    type: "fitting",
    client: "Národní divadlo",
    venue: "Kostýmní dílna",
    city: "Praha",
    date: "2026-09-24",
    time: "11:00",
    length: "1 h",
    role: "Ofélie",
    contact: "Jitka Sedláčková",
    fee: 0,
    status: "potvrzeno",
  },
  {
    id: "e7",
    title: "Zkouška — Hamlet",
    type: "zkouška",
    client: "Národní divadlo",
    venue: "Zkušebna 3",
    city: "Praha",
    date: "2026-09-25",
    time: "10:00",
    length: "4 h",
    role: "Ofélie",
    contact: "režie: J. Král",
    fee: 0,
    status: "potvrzeno",
  },
  {
    id: "e8",
    title: "Focení press kit",
    type: "focení",
    client: "vlastní",
    venue: "Ateliér Světlo",
    city: "Praha",
    date: "2026-09-27",
    time: "14:00",
    length: "2 h",
    role: "—",
    contact: "foto: T. Vlk",
    fee: -3500,
    status: "potvrzeno",
  },
  {
    id: "e9",
    title: "Regenerace — masáž a volno",
    type: "regenerace",
    client: "vlastní",
    venue: "Domov",
    city: "Praha",
    date: "2026-09-28",
    time: "celý den",
    length: "—",
    role: "—",
    contact: "—",
    fee: 0,
    status: "potvrzeno",
  },
];

export const eventTypeMeta: Record<EventType, { icon: string; tone: string }> = {
  "představení": { icon: "🎭", tone: "brand" },
  "vystoupení": { icon: "💃", tone: "brand" },
  "moderování": { icon: "🎤", tone: "warn" },
  "natáčení": { icon: "🎬", tone: "accent" },
  "focení": { icon: "📸", tone: "accent" },
  "zkouška": { icon: "🎙️", tone: "mist" },
  "trénink": { icon: "🎵", tone: "ok" },
  "regenerace": { icon: "🧘", tone: "ok" },
  "fitting": { icon: "👗", tone: "mist" },
  "technická zkouška": { icon: "🎧", tone: "mist" },
  "cesta": { icon: "🚗", tone: "mist" },
  "schůzka": { icon: "📋", tone: "mist" },
  "administrativa": { icon: "💰", tone: "mist" },
};

export const todaySchedule = [
  { time: "14:00", label: "Příjezd", state: "done" as const },
  { time: "14:30", label: "Převlek", state: "done" as const },
  { time: "15:00", label: "Blocking", state: "done" as const },
  { time: "16:00", label: "Technická zkouška", state: "now" as const },
  { time: "16:30", label: "Call time", state: "next" as const },
  { time: "17:00", label: "Soundcheck", state: "next" as const },
  { time: "17:30", label: "Makeup", state: "next" as const },
  { time: "18:30", label: "SHOW", state: "next" as const },
  { time: "20:30", label: "Konec", state: "next" as const },
];

export const preparationChecklist = [
  { label: "smlouva", done: true },
  { label: "doprava", done: true },
  { label: "kostým", done: false },
  { label: "rekvizity", done: true },
  { label: "hudba", done: true },
  { label: "choreografie / text", done: true },
  { label: "technické požadavky", done: false },
  { label: "makeup", done: true },
  { label: "backstage", done: false },
  { label: "fakturace", done: false },
];

export const performanceSkills = [
  { label: "Choreografie", value: 80 },
  { label: "Text / scénář", value: 95 },
  { label: "Hlas / artikulace", value: 55 },
  { label: "Stage presence", value: 70 },
  { label: "Improvizace", value: 65 },
  { label: "Timing", value: 85 },
];

export const sceneProgress = [
  { label: "Scéna 1 — balkón", value: 100, state: "hotovo" },
  { label: "Scéna 3 — pas de deux", value: 80, state: "umím samostatně" },
  { label: "Scéna 5 — finále", value: 45, state: "potřebuji procvičit" },
  { label: "Nástup ze zákulisí vpravo", value: 30, state: "nejisté místo" },
];

export const projects = [
  { name: "Hamlet", role: "Ofélie", state: "zkoušky", deadline: "12. 10.", progress: 55 },
  { name: "Festival XYZ", role: "tanečnice", state: "ready", deadline: "21. 9.", progress: 90 },
  { name: "Gala moderování", role: "moderátorka", state: "připravit", deadline: "20. 9.", progress: 35 },
  { name: "Romeo & Julie", role: "tanečnice", state: "v běhu", deadline: "průběžně", progress: 78 },
];

export const trainingLog = [
  { date: "18. 9.", total: 45, parts: "Choreografie 20 · Mobilita 10 · Kondice 15", feeling: "🔥" },
  { date: "17. 9.", total: 60, parts: "Technika 30 · Síla 20 · Cardio 10", feeling: "🙂" },
  { date: "16. 9.", total: 30, parts: "Flexibilita 15 · Hlas 15", feeling: "😐" },
  { date: "14. 9.", total: 75, parts: "Choreografie 40 · Výraz 20 · Improvizace 15", feeling: "🔥" },
];

export const bodyFocus = ["mobilita", "síla", "flexibilita", "koordinace", "cardio", "technika"];
export const performanceFocus = [
  "choreografie",
  "výraz",
  "improvizace",
  "hlas",
  "artikulace",
  "timing",
  "stage presence",
];

export const materialGroups = [
  { icon: "🎵", label: "Hudba", count: 12 },
  { icon: "🎬", label: "Videa", count: 8 },
  { icon: "📄", label: "Scénáře", count: 5 },
  { icon: "💃", label: "Choreografie", count: 9 },
  { icon: "📸", label: "Reference", count: 24 },
  { icon: "👗", label: "Kostýmy", count: 6 },
  { icon: "🎤", label: "Technické podklady", count: 4 },
  { icon: "🗺️", label: "Mapy", count: 7 },
  { icon: "📋", label: "Režijní poznámky", count: 11 },
];

export const materialsByProject = [
  {
    project: "Romeo & Julie",
    items: [
      { icon: "🎬", label: "rehearsal_video.mp4" },
      { icon: "📄", label: "scénář.pdf" },
      { icon: "🎵", label: "soundtrack.mp3" },
      { icon: "💃", label: "choreo 03" },
      { icon: "📋", label: "poznámky režiséra" },
    ],
  },
  {
    project: "Gala moderování",
    items: [
      { icon: "📄", label: "scenar_v3.pdf" },
      { icon: "📋", label: "otázky pro hosty" },
      { icon: "🎤", label: "headset — nastavení" },
    ],
  },
  {
    project: "Hamlet",
    items: [
      { icon: "📄", label: "text_ofelie.pdf" },
      { icon: "🎬", label: "zkouska_12_9.mp4" },
      { icon: "👗", label: "fitting foto" },
    ],
  },
];

export const costumeItems = [
  { label: "základní kostým", done: true },
  { label: "boty", done: true },
  { label: "spodní vrstva", done: true },
  { label: "doplňky", done: false },
  { label: "náhradní varianta", done: false },
  { label: "opravy", done: false },
];

export const bagItems = [
  "voda",
  "ručník",
  "makeup",
  "kosmetika",
  "nabíječka",
  "powerbanka",
  "páska",
  "šití",
  "safety pins",
  "deodorant",
  "lékárnička",
  "náhradní oblečení",
];

export const riderSections = [
  {
    title: "Zvuk",
    items: ["mikrofon", "headset", "playback", "monitor", "playback operátor"],
  },
  {
    title: "Stage",
    items: ["rozměry min. 6×5 m", "taneční povrch", "světla", "vstup / výstup", "backstage"],
  },
  { title: "Video", items: ["projekce", "obrazovka", "kamera"] },
  { title: "Speciální požadavky", items: ["šatna se zrcadlem", "zákaz mlhy před číslem", "voda na jevišti"] },
];

export const logistics = {
  from: "Domov · Praha 7",
  to: "Divadlo ABC",
  duration: "42 min",
  steps: [
    { label: "Odjezd", value: "15:40", done: true },
    { label: "Příjezd", value: "16:22", done: false },
    { label: "Parkování", value: "dvůr, místo 4", done: false },
    { label: "Check-in", value: "vstup pro účinkující", done: false },
    { label: "Backstage", value: "vlevo za jevištěm", done: false },
    { label: "Návrat", value: "21:10", done: false },
  ],
};

export const finance = {
  month: "září 2026",
  earned: 38500,
  pending: 12000,
  toPay: 2500,
  eventsCount: 9,
  items: [
    { event: "Festival XYZ", fee: 8000, costs: 2500, state: "čeká na zaplacení" },
    { event: "Gala večer", fee: 12000, costs: 900, state: "čeká na zaplacení" },
    { event: "Natáčení spotu", fee: 15000, costs: 1200, state: "zaplaceno" },
    { event: "Večerní představení", fee: 6500, costs: 400, state: "zaplaceno" },
  ],
  costBreakdown: [
    { label: "doprava", value: 800 },
    { label: "kostým", value: 500 },
    { label: "ubytování", value: 1200 },
  ],
};

export const credits = [
  { project: "Romeo & Julie", role: "tanečnice", year: "2026", production: "XYZ Production" },
  { project: "Hamlet", role: "Ofélie", year: "2026", production: "Národní divadlo" },
  { project: "Gala Nova", role: "moderátorka", year: "2025", production: "Nova Events" },
  { project: "Spot Aurora", role: "herečka", year: "2025", production: "Studio R" },
];

export const careerTracks = [
  { label: "Tanec", value: 85, skills: ["technika", "partneřina", "improvizace", "styly"] },
  { label: "Herectví", value: 60, skills: ["text", "jevištní práce", "kamera", "emoce"] },
  { label: "Moderování", value: 45, skills: ["artikulace", "improvizace", "práce s publikem", "mikrofon", "timing", "rozhovor", "kamera"] },
  { label: "Choreografie", value: 35, skills: ["kompozice", "vedení zkoušky", "hudební frázování"] },
  { label: "Voice", value: 30, skills: ["dech", "rezonance", "projev"] },
];

export const recoveryLog = [
  { date: "17. 9.", energy: 7, body: 4, mind: 6, stress: 3, helped: ["spánek", "protažení"] },
  { date: "15. 9.", energy: 5, body: 7, mind: 5, stress: 5, helped: ["masáž", "volno"] },
  { date: "12. 9.", energy: 8, body: 3, mind: 3, stress: 2, helped: ["jídlo", "klid"] },
];

export const recoveryInsight =
  "Za poslední měsíc: po akcích s cestou delší než 2 h potřebuješ nejčastěji 1 den regenerace.";

export const reflections = [
  {
    event: "Gala Nova · 15. 9.",
    rating: 4,
    worked: "Improvizace při technické pauze, publikum drželo pozornost.",
    didnt: "Nástup po videoprojekci — chyběl signál z režie.",
    learned: "Domluvit si vizuální signál se stage managerem.",
    next: "Přijít o 15 min dřív na zvuk.",
  },
  {
    event: "Festival Letná · 6. 9.",
    rating: 5,
    worked: "Choreografie 03 sedla na hudbu, kostým pohodlný.",
    didnt: "Povrch jeviště byl klouzavý.",
    learned: "Vždy si vzít náhradní boty s lepší podrážkou.",
    next: "Ověřit povrch v rideru dopředu.",
  },
];

export const kpis = [
  { value: "12", label: "nadcházejících akcí" },
  { value: "4", label: "aktivní projekty" },
  { value: "7", label: "otevřených příprav" },
  { value: "83 %", label: "připravenost" },
  { value: "38 500 Kč", label: "honoráře tento měsíc" },
  { value: "6", label: "tréninků" },
];

export const nav = [
  { to: "/", icon: "🏠", label: "Dnes" },
  { to: "/kalendar", icon: "📅", label: "Kalendář" },
  { to: "/akce", icon: "🎬", label: "Akce" },
  { to: "/projekty", icon: "🎭", label: "Projekty & role" },
  { to: "/priprava", icon: "🧠", label: "Příprava" },
  { to: "/trenink", icon: "💃", label: "Trénink" },
  { to: "/materialy", icon: "📚", label: "Materiály" },
  { to: "/kostymy", icon: "👗", label: "Kostýmy" },
  { to: "/rider", icon: "🎤", label: "Rider" },
  { to: "/logistika", icon: "🚗", label: "Logistika" },
  { to: "/honorare", icon: "💰", label: "Honoráře" },
  { to: "/portfolio", icon: "📸", label: "Portfolio" },
  { to: "/kariera", icon: "📈", label: "Kariéra" },
  { to: "/regenerace", icon: "🧘", label: "Regenerace" },
  { to: "/reflexe", icon: "📝", label: "Reflexe" },
  { to: "/performeri", icon: "👥", label: "Performeři" },
  { to: "/zalohy", icon: "🗂", label: "Zálohy" },
] as const;

export function formatCzk(value: number) {
  return `${value.toLocaleString("cs-CZ")} Kč`;
}
