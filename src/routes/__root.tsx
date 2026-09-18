import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { nav, performer } from "../lib/performer-data";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Stránka neexistuje</h2>
        <p className="mt-2 text-sm text-mist">Tuhle část nástěnky jsme nenašli.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="font-display gradient-brand inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-ink"
          >
            Zpět na Dnes
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Stránka se nenačetla</h1>
        <p className="mt-2 text-sm text-mist">Zkus to prosím znovu.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="font-display gradient-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-ink"
          >
            Zkusit znovu
          </button>
          <a href="/" className="glass rounded-xl px-4 py-2.5 text-sm font-medium">
            Zpět na Dnes
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Performer OS — plánovač pro performery" },
      {
        name: "description",
        content:
          "Nástěnka a plánovač pro tanečníky, herce a moderátory: call time, kostým, rider, honoráře i trénink na jednom místě.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Sidebar() {
  return (
    <aside className="glass sticky top-6 h-fit rounded-3xl p-4 max-lg:static max-lg:top-0">
      <div className="mb-5 flex items-center gap-3 px-2">
        <div className="gradient-brand font-display grid size-9 place-items-center rounded-xl text-sm font-bold text-ink">
          P
        </div>
        <div>
          <div className="font-display text-sm font-semibold">PERFORMER</div>
          <div className="text-[10px] tracking-widest text-mist uppercase">OS</div>
        </div>
      </div>

      <div className="mb-2 px-2 text-[10px] tracking-widest text-mist uppercase">Co děláš</div>
      <div className="mb-5 flex flex-wrap gap-1.5 px-1">
        {performer.roles.map((role) => (
          <span
            key={role}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${
              role === performer.activeRole
                ? "border-brand/40 bg-brand/20 text-foreground"
                : "border-border bg-foreground/5 text-mist"
            }`}
          >
            {role}
          </span>
        ))}
      </div>

      <nav className="space-y-0.5">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "bg-foreground/10 text-foreground" }}
            inactiveProps={{ className: "text-mist hover:text-foreground hover:bg-foreground/5" }}
            className="font-display flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          >
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="aurora-bg relative min-h-screen text-foreground/90">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 size-[520px] rounded-full bg-brand/25 blur-[140px]" />
          <div className="absolute top-1/3 right-0 size-[460px] rounded-full bg-accent/20 blur-[140px]" />
        </div>
        <div className="relative mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
          <Sidebar />
          <main className="min-w-0 space-y-6">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
