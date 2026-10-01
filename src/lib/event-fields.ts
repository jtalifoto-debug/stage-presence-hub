import type { Field } from "@/components/perf/editable";
import { eventTypeMeta } from "./performer-data";
import { uid, type PerfEventRow } from "./workspace-types";

export const eventFields: Field<PerfEventRow>[] = [
  { key: "title", label: "Název akce", width: "lg" },
  { key: "type", label: "Typ", type: "select", options: Object.keys(eventTypeMeta) },
  { key: "status", label: "Stav", type: "select", options: ["potvrzeno", "nabídka", "připravit", "hotovo"] },
  { key: "date", label: "Datum", type: "date" },
  { key: "time", label: "Začátek", type: "time" },
  { key: "callTime", label: "Call time", type: "time" },
  { key: "length", label: "Délka (např. 2 h 30 min)" },
  { key: "client", label: "Klient" },
  { key: "contact", label: "Kontakt" },
  { key: "venue", label: "Místo" },
  { key: "city", label: "Město" },
  { key: "role", label: "Role" },
  { key: "fee", label: "Honorář (Kč)", type: "number" },
  { key: "notes", label: "Poznámky", type: "textarea" },
];

export function newEvent(): PerfEventRow {
  const d = new Date();
  return {
    id: uid(),
    title: "Nová akce",
    type: "vystoupení",
    client: "",
    venue: "",
    city: "Praha",
    date: d.toISOString().slice(0, 10),
    time: "19:00",
    callTime: "17:30",
    length: "2 h",
    role: "—",
    contact: "—",
    fee: 0,
    status: "nabídka",
    notes: "",
    attachments: [],
  };
}
