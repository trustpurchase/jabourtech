import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate } from "@/lib/db";
import { useClientOptions, useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/bons-livraison")({
  head: () => ({
    meta: [
      { title: "Bons de livraison — BTP Gestion" },
      {
        name: "description",
        content: "Livraisons vers les clients et les chantiers, avec suivi des statuts.",
      },
      { property: "og:title", content: "Bons de livraison — BTP Gestion" },
      { property: "og:description", content: "Livraisons clients et sorties vers chantiers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BonsLivraisonPage,
});

const STATUTS = [
  { value: "prepare", label: "Préparé" },
  { value: "livre", label: "Livré" },
  { value: "facture", label: "Facturé" },
];

function BonsLivraisonPage() {
  const clients = useClientOptions();
  const projets = useProjetOptions();

  return (
    <CrudPage
      table="bons_livraison"
      title="Bons de livraison"
      subtitle="Livraisons aux clients et sorties vers les chantiers."
      searchKeys={["numero", "notes"]}
      columns={[
        { name: "numero", label: "N° BL" },
        {
          name: "client_id",
          label: "Client",
          render: (r: Row) => clients.map.get(String(r["client_id"])) ?? "—",
        },
        {
          name: "projet_id",
          label: "Projet",
          render: (r: Row) => projets.map.get(String(r["projet_id"])) ?? "—",
        },
        { name: "date_bl", label: "Date", render: (r: Row) => fmtDate(r["date_bl"] as string) },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "facture" ? "default" : "secondary"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "client_id", label: "Client", type: "select", options: clients.options },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "date_bl", label: "Date de livraison", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "livre" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
