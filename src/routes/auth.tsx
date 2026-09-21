import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button, Panel } from "@/components/perf/ui";
import { LabeledField, TextInput } from "@/components/perf/editable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Přihlášení — Performer OS" },
      {
        name: "description",
        content: "Přihlas se do Performer OS a měj svoje akce, honoráře a přípravu vždy u sebe.",
      },
      { property: "og:title", content: "Přihlášení — Performer OS" },
      {
        property: "og:description",
        content: "Vstup do svého plánovače pro performery.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "up") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (err) throw err;
        setMessage("Hotovo! Zkontroluj e-mail a potvrď registraci.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        void navigate({ to: "/" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Přihlášení se nepovedlo.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (err) setError(err.message);
  };

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <div className="mb-8 text-center">
        <div className="eyebrow">🎭 Performer OS</div>
        <h1 className="mt-2 text-3xl font-semibold">
          {mode === "in" ? "Přihlášení" : "Vytvoř si účet"}
        </h1>
        <p className="mt-2 text-sm text-mist">
          Akce, kostýmy, rider, honoráře i trénink — všechno na jednom místě.
        </p>
      </div>

      <Panel>
        <div className="space-y-4">
          <LabeledField label="E-mail">
            <TextInput value={email} onChange={setEmail} placeholder="jmeno@email.cz" type="email" />
          </LabeledField>
          <LabeledField label="Heslo">
            <TextInput
              value={password}
              onChange={setPassword}
              placeholder="min. 6 znaků"
              type="password"
            />
          </LabeledField>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {message ? <p className="text-sm text-ok">{message}</p> : null}

          <Button className="w-full" onClick={() => void submit()}>
            {busy ? "Chvilku…" : mode === "in" ? "Přihlásit se" : "Zaregistrovat se"}
          </Button>

          <div className="flex items-center gap-3 text-[11px] tracking-widest text-mist uppercase">
            <span className="h-px flex-1 bg-foreground/10" /> nebo
            <span className="h-px flex-1 bg-foreground/10" />
          </div>

          <Button variant="ghost" className="w-full" onClick={() => void google()}>
            Pokračovat s Google
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="w-full text-center text-xs text-mist hover:text-foreground"
          >
            {mode === "in" ? "Nemáš účet? Zaregistruj se" : "Už máš účet? Přihlas se"}
          </button>
        </div>
      </Panel>
    </div>
  );
}
