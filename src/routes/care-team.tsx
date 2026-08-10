import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/care-team")({
  component: () => <Outlet />,
});
