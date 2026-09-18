import { useState, type ReactNode } from "react";

export function Panel({
  children,
  className = "",
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  soft?: boolean;
}) {
  return (
    <div
      className={`${soft ? "glass-soft rounded-2xl" : "glass rounded-3xl"} p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow mb-4">{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Progress({ value, tone = "brand" }: { value: number; tone?: "brand" | "warn" | "danger" }) {
  const fill =
    tone === "warn" ? "bg-warn/80" : tone === "danger" ? "bg-danger/80" : "gradient-brand";
  return (
    <div className="h-1.5 w-full rounded-full bg-foreground/10">
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Meter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "brand" | "warn" | "danger";
}) {
  const auto = tone ?? (value < 50 ? "danger" : value < 70 ? "warn" : "brand");
  const text = auto === "brand" ? "text-accent" : auto === "warn" ? "text-warn" : "text-danger";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className={`font-display ${text}`}>{value} %</span>
      </div>
      <Progress value={value} tone={auto} />
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="font-display text-2xl font-semibold sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-mist">{label}</div>
    </div>
  );
}

type ChipTone = "brand" | "accent" | "ok" | "warn" | "danger" | "mist";

export function Chip({
  children,
  tone = "mist",
  active = false,
}: {
  children: ReactNode;
  tone?: ChipTone;
  active?: boolean;
}) {
  const tones: Record<ChipTone, string> = {
    brand: "bg-brand/20 text-foreground border-brand/40",
    accent: "bg-accent/15 text-accent border-accent/30",
    ok: "bg-ok/12 text-ok border-ok/25",
    warn: "bg-warn/12 text-warn border-warn/25",
    danger: "bg-danger/15 text-danger border-danger/30",
    mist: "bg-foreground/5 text-mist border-border",
  };
  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-[11px] ${tones[active ? "brand" : tone]}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "font-display rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "gradient-brand text-ink hover:opacity-90"
      : "glass text-foreground hover:bg-foreground/10";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Checklist({
  items,
  columns = 1,
}: {
  items: { label: string; done?: boolean }[];
  columns?: 1 | 2;
}) {
  const [state, setState] = useState(() => items.map((i) => Boolean(i.done)));
  const doneCount = state.filter(Boolean).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-mist">
        <span>
          {doneCount} / {items.length} hotovo
        </span>
        <span className="font-display text-accent">
          {Math.round((doneCount / items.length) * 100)} %
        </span>
      </div>
      <Progress value={(doneCount / items.length) * 100} />
      <ul className={`mt-4 grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {items.map((item, i) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => setState((s) => s.map((v, idx) => (idx === i ? !v : v)))}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-foreground/5"
            >
              <span
                className={`grid size-4.5 shrink-0 place-items-center rounded-md border text-[10px] ${
                  state[i] ? "gradient-brand border-transparent text-ink" : "border-border text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={state[i] ? "text-mist line-through" : ""}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Scale({
  label,
  value,
  max = 10,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-mist">{label}</span>
        <span className="font-display">
          {value} / {max}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < value ? "gradient-brand" : "bg-foreground/10"}`}
          />
        ))}
      </div>
    </div>
  );
}
