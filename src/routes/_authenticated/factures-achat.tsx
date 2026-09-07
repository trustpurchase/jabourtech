import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtMAD } from "@/lib/db";
import { useDocOptions, useFournisseurOptions, useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/factures-achat")({
  head: () => ({
    meta: [
      { title: "Factures d'achat — BTP Gestion" },
      {
        name: "description",
        content: "Factures fournisseurs, échéances et dette fournisseurs restant à payer.",
      },
      { property: "og:title", content: "Factures d'achat — BTP Gestion" },
      { property: "og:description", content: "Factures fournisseurs et dettes en cours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacturesAchatPage,
});

const STATUTS = [
  { value: "impayee", label: "Impayée" },
  { value: "partielle", label: "Partiellement payée" },
  { value: "payee", label: "Payée" },
];

function FacturesAchatPage() {
  const fournisseurs = useFournisseurOptions();
  const projets = useProjetOptions();
  const brs = useDocOptions("bons_reception");

  return (
    <CrudPage
      table="factures_achat"
      title="Factures d'achat"
      subtitle="Factures fournisseurs et dette restant à régler."
      searchKeys={["numero", "notes"]}
      columns={[
        { name: "numero", label: "N° facture" },
        {
          name: "fournisseur_id",
          label: "Fournisseur",
          render: (r: Row) => fournisseurs.map.get(String(r["fournisseur_id"])) ?? "—",
        },
        {
          name: "date_facture",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_facture"] as string),
        },
        {
          name: "total_ttc",
          label: "Total TTC",
          render: (r: Row) => fmtMAD(r["total_ttc"] as number),
        },
        {
          name: "reste",
          label: "Reste à payer",
          render: (r: Row) =>
            fmtMAD(Number(r["total_ttc"] ?? 0) - Number(r["montant_paye"] ?? 0)),
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "payee" ? "default" : "destructive"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", options: fournisseurs.options },
        { name: "bon_reception_id", label: "Bon de réception", type: "select", options: brs.options },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "date_facture", label: "Date de facture", type: "date" },
        { name: "date_echeance", label: "Échéance", type: "date" },
        { name: "total_ht", label: "Total HT", type: "number", step: "0.01" },
        { name: "total_tva", label: "Total TVA", type: "number", step: "0.01" },
        { name: "total_ttc", label: "Total TTC", type: "number", step: "0.01" },
        { name: "montant_paye", label: "Montant payé", type: "number", step: "0.01" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "impayee" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
