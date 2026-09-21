// Pathless layout route that gates every child under `src/routes/_authenticated/`
// behind a signed-in Supabase user, and provides the shared workspace data.
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { WorkspaceProvider } from "@/lib/workspace";

const SIGN_IN_ROUTE = "/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: SIGN_IN_ROUTE });
    }
    return { user: data.user };
  },
  component: () => (
    <WorkspaceProvider>
      <Outlet />
    </WorkspaceProvider>
  ),
});
