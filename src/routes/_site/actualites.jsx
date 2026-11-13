import { createFileRoute, Outlet } from "@tanstack/react-router";

// Simple conteneur de /actualites : la liste est dans actualites.index.jsx, un article dans actualites.$slug.jsx.
// (Cette route affichait auparavant une copie de la liste sans <Outlet />, ce qui empêchait d'ouvrir tout article.)
export const Route = createFileRoute("/_site/actualites")({
  component: Outlet,
});
