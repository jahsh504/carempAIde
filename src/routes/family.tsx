import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/family")({
  component: FamilyLayout,
});

function FamilyLayout() {
  return <Outlet />;
}
