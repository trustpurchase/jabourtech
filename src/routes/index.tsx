import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/tableau-de-bord" });
  },
  head: () => ({
    meta: [
      { title: "BTP Gestion — ERP chantiers & commerce" },
      {
        name: "description",
        content:
          "Logiciel de gestion commerciale et BTP : devis, projets, achats, stock, facturation et pointage des ouvriers.",
      },
      { property: "og:title", content: "BTP Gestion — ERP chantiers & commerce" },
      {
        property: "og:description",
        content: "Devis, projets, achats, stock, facturation et pointage des ouvriers.",
      },
    ],
  }),
  component: () => null,
});
