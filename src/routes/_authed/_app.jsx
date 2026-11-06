import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppShell from "@/components/dashboard/AppShell";
import AssistantWidget from "@/components/ai/AssistantWidget";

export const Route = createFileRoute("/_authed/_app")({
  component: () => (
    <AppShell>
      <Outlet />
      <AssistantWidget page="espace artiste" />
    </AppShell>
  ),
});