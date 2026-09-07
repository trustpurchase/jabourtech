import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate } from "@/lib/db";
import { useDocOptions, useFournisseurOptions, useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/bons-reception")({
  head: () => ({
    meta: [
      { title: "Bons de réception — BTP Gestion" },
      {
        name: "description",
        content: "Réception des marchandises fournisseurs et rattachement aux bons de commande.",
      },
      { property: "og:title", content: "Bons de réception — BTP Gestion" },
      { property: "og:description", content: "Réception des marchandises et contrôle des commandes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BonsReceptionPage,
});

const STATUTS = [
  { value: "partiel", label: "Partiel" },
  { value: "recu", label: "Reçu" },
  { value: "controle", label: "Contrôlé" },
];

function BonsReceptionPage() {
  const fournisseurs = useFournisseurOptions();
  const projets = useProjetOptions();
  const bcs = useDocOptions("bons_commande");

  return (
    <CrudPage
      table="bons_reception"
      title="Bons de réception"
      subtitle="Entrées de marchandises en provenance des fournisseurs."
      searchKeys={["numero", "notes"]}
      columns={[
        { name: "numero", label: "N° BR" },
        {
          name: "fournisseur_id",
          label: "Fournisseur",
          render: (r: Row) => fournisseurs.map.get(String(r["fournisseur_id"])) ?? "—",
        },
        {
          name: "bon_commande_id",
          label: "Bon de commande",
          render: (r: Row) => bcs.map.get(String(r["bon_commande_id"])) ?? "—",
        },
        {
          name: "projet_id",
          label: "Projet",
          render: (r: Row) => projets.map.get(String(r["projet_id"])) ?? "—",
        },
        { name: "date_br", label: "Date", render: (r: Row) => fmtDate(r["date_br"] as string) },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "controle" ? "default" : "secondary"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", options: fournisseurs.options },
        { name: "bon_commande_id", label: "Bon de commande", type: "select", options: bcs.options },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "date_br", label: "Date de réception", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "recu" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
