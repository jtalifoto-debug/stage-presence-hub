import { useEffect, useState, type ReactNode } from "react";

import { Button, Eyebrow, Panel, Progress } from "./ui";

export type FieldType = "text" | "number" | "date" | "time" | "select" | "textarea" | "check";

export type Field<T> = {
  key: keyof T & string;
  label: string;
  type?: FieldType;
  options?: readonly string[];
  width?: "sm" | "md" | "lg";
};

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value ?? ""));
  useEffect(() => setDraft(String(value ?? "")), [value]);

  return (
    <input
      type={type}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onChange(draft)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className={`w-full rounded-xl border border-border bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none placeholder:text-mist focus:border-brand/60 ${className}`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(value ?? "");
  useEffect(() => setDraft(value ?? ""), [value]);
  return (
    <textarea
      value={draft}
      rows={3}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onChange(draft)}
      className="w-full rounded-xl border border-border bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none placeholder:text-mist focus:border-brand/60"
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none focus:border-brand/60"
    >
      {!options.includes(value) ? <option value={value}>{value || "—"}</option> : null}
      {options.map((o) => (
        <option key={o} value={o} className="bg-ink text-foreground">
          {o}
        </option>
      ))}
    </select>
  );
}

export function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] tracking-wider text-mist uppercase">{label}</span>
      {children}
    </label>
  );
}

/** Schema-driven editor for a collection of records: add, edit, delete. */
export function RecordEditor<T extends { id: string }>({
  title,
  items,
  fields,
  onChange,
  makeNew,
  titleKey,
  addLabel = "Přidat",
  emptyText = "Zatím nic — přidej první položku.",
}: {
  title?: string;
  items: T[];
  fields: Field<T>[];
  onChange: (next: T[]) => void;
  makeNew: () => T;
  titleKey: keyof T & string;
  addLabel?: string;
  emptyText?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const update = (id: string, key: keyof T & string, value: unknown) =>
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));

  return (
    <div>
      {title ? <Eyebrow>{title}</Eyebrow> : null}
      {items.length === 0 ? <p className="mb-4 text-sm text-mist">{emptyText}</p> : null}

      <div className="space-y-3">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} className="glass-soft rounded-2xl p-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="font-display flex-1 truncate text-left text-sm font-medium"
                >
                  {String(item[titleKey] || "—")}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="rounded-lg border border-border px-2 py-1 text-[11px] text-mist hover:text-foreground"
                  >
                    {open ? "zavřít" : "upravit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                    className="rounded-lg border border-danger/30 px-2 py-1 text-[11px] text-danger"
                  >
                    smazat
                  </button>
                </div>
              </div>

              {open ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {fields.map((field) => {
                    const raw = item[field.key] as unknown;
                    const type = field.type ?? "text";
                    return (
                      <div
                        key={field.key}
                        className={type === "textarea" || field.width === "lg" ? "sm:col-span-2" : ""}
                      >
                        <LabeledField label={field.label}>
                          {type === "textarea" ? (
                            <TextArea
                              value={String(raw ?? "")}
                              onChange={(v) => update(item.id, field.key, v)}
                            />
                          ) : type === "select" ? (
                            <SelectInput
                              value={String(raw ?? "")}
                              options={field.options ?? []}
                              onChange={(v) => update(item.id, field.key, v)}
                            />
                          ) : type === "check" ? (
                            <button
                              type="button"
                              onClick={() => update(item.id, field.key, !raw)}
                              className="glass rounded-xl px-3 py-2 text-sm"
                            >
                              {raw ? "✓ ano" : "— ne"}
                            </button>
                          ) : (
                            <TextInput
                              type={type === "number" ? "number" : type === "date" ? "date" : type === "time" ? "time" : "text"}
                              value={String(raw ?? "")}
                              onChange={(v) =>
                                update(item.id, field.key, type === "number" ? Number(v || 0) : v)
                              }
                            />
                          )}
                        </LabeledField>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4"
        variant="ghost"
        onClick={() => {
          const created = makeNew();
          onChange([...items, created]);
          setOpenId(created.id);
        }}
      >
        + {addLabel}
      </Button>
    </div>
  );
}

/** Editable checklist: toggle, rename, add and remove items. */
export function EditableChecklist({
  items,
  onChange,
  makeNew,
  columns = 1,
  addLabel = "Přidat položku",
}: {
  items: { id: string; label: string; done: boolean }[];
  onChange: (next: { id: string; label: string; done: boolean }[]) => void;
  makeNew: (label: string) => { id: string; label: string; done: boolean };
  columns?: 1 | 2;
  addLabel?: string;
}) {
  const [draft, setDraft] = useState("");
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-mist">
        <span>
          {done} / {items.length} hotovo
        </span>
        <span className="font-display text-accent">{pct} %</span>
      </div>
      <Progress value={pct} />

      <ul className={`mt-4 grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onChange(items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))
              }
              className={`grid size-5 shrink-0 place-items-center rounded-md border text-[10px] ${
                item.done ? "gradient-brand border-transparent text-ink" : "border-border text-transparent"
              }`}
            >
              ✓
            </button>
            <TextInput
              value={item.label}
              onChange={(v) => onChange(items.map((i) => (i.id === item.id ? { ...i, label: v } : i)))}
              className={item.done ? "text-mist line-through" : ""}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              className="shrink-0 px-1 text-mist hover:text-danger"
              aria-label="Smazat položku"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          onChange([...items, makeNew(draft.trim())]);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={addLabel}
          className="w-full rounded-xl border border-border bg-foreground/5 px-3 py-2 text-sm outline-none placeholder:text-mist focus:border-brand/60"
        />
        <Button variant="ghost">+</Button>
      </form>
    </div>
  );
}

export function EditPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel>
      <Eyebrow>{title}</Eyebrow>
      {children}
    </Panel>
  );
}
