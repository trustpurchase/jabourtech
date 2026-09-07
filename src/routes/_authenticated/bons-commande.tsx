import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtMAD } from "@/lib/db";
import { useFournisseurOptions, useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/bons-commande")({
  head: () => ({
    meta: [
      { title: "Bons de commande — BTP Gestion" },
      {
        name: "description",
        content: "Commandes fournisseurs : montants, chantier concerné et suivi du statut.",
      },
      { property: "og:title", content: "Bons de commande — BTP Gestion" },
      { property: "og:description", content: "Commandes fournisseurs et suivi des livraisons." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BonsCommandePage,
});

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "envoye", label: "Envoyé" },
  { value: "receptionne", label: "Réceptionné" },
  { value: "annule", label: "Annulé" },
];

function BonsCommandePage() {
  const fournisseurs = useFournisseurOptions();
  const projets = useProjetOptions();

  return (
    <CrudPage
      table="bons_commande"
      title="Bons de commande"
      subtitle="Commandes adressées aux fournisseurs."
      searchKeys={["numero", "notes"]}
      columns={[
        { name: "numero", label: "N° BC" },
        {
          name: "fournisseur_id",
          label: "Fournisseur",
          render: (r: Row) => fournisseurs.map.get(String(r["fournisseur_id"])) ?? "—",
        },
        {
          name: "projet_id",
          label: "Projet",
          render: (r: Row) => projets.map.get(String(r["projet_id"])) ?? "—",
        },
        { name: "date_bc", label: "Date", render: (r: Row) => fmtDate(r["date_bc"] as string) },
        {
          name: "total_ttc",
          label: "Total TTC",
          render: (r: Row) => fmtMAD(r["total_ttc"] as number),
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "receptionne" ? "default" : "secondary"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", options: fournisseurs.options },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "date_bc", label: "Date de commande", type: "date" },
        { name: "total_ht", label: "Total HT", type: "number", step: "0.01" },
        { name: "total_tva", label: "Total TVA", type: "number", step: "0.01" },
        { name: "total_ttc", label: "Total TTC", type: "number", step: "0.01" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "brouillon" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
