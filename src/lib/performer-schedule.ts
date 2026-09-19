import { events, type PerfEvent } from "./performer-data";

export type RunSlotState = "done" | "now" | "next";
export type RunSlot = { time: string; label: string; state: RunSlotState; note?: string };

const PERFORMING: PerfEvent["type"][] = [
  "představení",
  "vystoupení",
  "moderování",
  "natáčení",
  "focení",
];

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
}

function toTime(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function lengthMinutes(length: string) {
  const hours = /(\d+)\s*h/.exec(length);
  const mins = /(\d+)\s*min/.exec(length);
  if (!hours && !mins) return length === "celý den" ? 8 * 60 : 60;
  return (hours ? Number(hours[1]) * 60 : 0) + (mins ? Number(mins[1]) : 0);
}

export function travelMinutes(event: PerfEvent) {
  return event.city === "Praha" ? 42 : 135;
}

/**
 * Real runsheet derived from the event in the calendar: travel, call time,
 * technical rehearsal, show and wrap — all computed from its own times.
 */
export function buildRunsheet(event: PerfEvent, nowLabel = "16:10"): RunSlot[] {
  const start = toMinutes(event.time);
  if (start === null) {
    return [
      { time: "celý den", label: event.title, state: "now" },
    ];
  }

  const travel = travelMinutes(event);
  const call = toMinutes(event.callTime ?? "") ?? start - 45;
  const performing = PERFORMING.includes(event.type);

  const slots: { at: number; label: string; note?: string }[] = [
    { at: call - travel - 15, label: "Odjezd", note: `${event.city} · ${travel} min cesty` },
    { at: call - 10, label: "Příjezd a parkování", note: event.venue },
    { at: call, label: "Call time", note: event.contact },
  ];

  if (performing) {
    slots.push({ at: call + 20, label: "Převlek a kostým" });
    if (start - call >= 90) {
      slots.push({ at: call + 45, label: "Technická zkouška" });
    }
    slots.push({ at: start - 90 > call ? start - 90 : call + 50, label: "Soundcheck" });
    slots.push({ at: start - 45, label: "Makeup a rozcvičení" });
  } else {
    slots.push({ at: call + 15, label: "Příprava na místě" });
  }

  slots.push({
    at: start,
    label: performing ? `${event.type.toUpperCase()} — start` : event.title,
    note: event.role !== "—" ? event.role : undefined,
  });
  slots.push({ at: start + lengthMinutes(event.length), label: "Konec", note: event.length });

  const now = toMinutes(nowLabel) ?? 0;
  const sorted = slots.sort((a, b) => a.at - b.at);
  const currentIndex = sorted.reduce(
    (acc, slot, i) => (slot.at <= now ? i : acc),
    -1,
  );

  return sorted.map((slot, i) => ({
    time: toTime(slot.at),
    label: slot.label,
    note: slot.note,
    state: i < currentIndex ? "done" : i === currentIndex ? "now" : "next",
  }));
}

/** Preparation items that follow from the event type in the calendar. */
export function buildEventPrep(event: PerfEvent) {
  const base = [
    { label: "smlouva potvrzená", done: event.status === "potvrzeno" || event.status === "hotovo" },
    { label: `doprava do ${event.city}`, done: event.city === "Praha" },
    { label: "kontakt na produkci", done: event.contact !== "—" },
    { label: "podklady v materiálech", done: (event.attachments?.length ?? 0) > 0 },
  ];

  const byType: Record<string, { label: string; done: boolean }[]> = {
    "představení": [
      { label: "kostým a boty", done: false },
      { label: "choreografie / text", done: true },
      { label: "rekvizity", done: true },
      { label: "backstage a nástupy", done: false },
    ],
    "vystoupení": [
      { label: "kostým a boty", done: false },
      { label: "hudba / playback", done: true },
      { label: "technický rider odeslán", done: false },
    ],
    "moderování": [
      { label: "scénář ve finální verzi", done: false },
      { label: "otázky pro hosty", done: false },
      { label: "mikrofon / headset", done: true },
      { label: "timing bloků", done: true },
    ],
    "natáčení": [
      { label: "text scén", done: true },
      { label: "makeup a vlasy", done: true },
      { label: "call sheet od produkce", done: false },
    ],
    "focení": [
      { label: "outfity", done: true },
      { label: "moodboard", done: true },
    ],
    "zkouška": [
      { label: "text / choreografie", done: true },
      { label: "poznámky z minulé zkoušky", done: false },
    ],
    "fitting": [{ label: "boty a spodní vrstva", done: true }],
  };

  const extra = byType[event.type] ?? [{ label: "příprava na místě", done: false }];
  return [...base, ...extra, { label: "fakturace", done: event.fee <= 0 }];
}

export const eventsByDate = [...events].sort((a, b) => a.date.localeCompare(b.date));

export function eventById(id: string) {
  return events.find((e) => e.id === id);
}

export function formatDateCz(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
}

export function weekdayCz(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("cs-CZ", { weekday: "short" });
}

export function prepScore(event: PerfEvent) {
  const items = buildEventPrep(event);
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}
