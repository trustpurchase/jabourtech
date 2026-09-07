import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtMAD } from "@/lib/db";
import { useClientOptions, useDocOptions, useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/factures")({
  head: () => ({
    meta: [
      { title: "Factures clients — BTP Gestion" },
      {
        name: "description",
        content: "Facturation des clients : montants, échéances et encours à recouvrer.",
      },
      { property: "og:title", content: "Factures clients — BTP Gestion" },
      { property: "og:description", content: "Facturation clients et encours à recouvrer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacturesPage,
});

const STATUTS = [
  { value: "impayee", label: "Impayée" },
  { value: "partielle", label: "Partiellement réglée" },
  { value: "payee", label: "Réglée" },
];

function FacturesPage() {
  const clients = useClientOptions();
  const projets = useProjetOptions();
  const devis = useDocOptions("devis");
  const decomptes = useDocOptions("decomptes");

  return (
    <CrudPage
      table="factures"
      title="Factures"
      subtitle="Facturation client et suivi des encaissements."
      searchKeys={["numero", "objet"]}
      columns={[
        { name: "numero", label: "N° facture" },
        {
          name: "client_id",
          label: "Client",
          render: (r: Row) => clients.map.get(String(r["client_id"])) ?? "—",
        },
        { name: "objet", label: "Objet" },
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
          label: "Reste dû",
          render: (r: Row) => fmtMAD(Number(r["total_ttc"] ?? 0) - Number(r["montant_paye"] ?? 0)),
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
        { name: "client_id", label: "Client", type: "select", options: clients.options },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "devis_id", label: "Devis d'origine", type: "select", options: devis.options },
        { name: "decompte_id", label: "Décompte lié", type: "select", options: decomptes.options },
        { name: "objet", label: "Objet" },
        { name: "date_facture", label: "Date de facture", type: "date" },
        { name: "date_echeance", label: "Échéance", type: "date" },
        { name: "total_ht", label: "Total HT", type: "number", step: "0.01" },
        { name: "total_tva", label: "Total TVA", type: "number", step: "0.01" },
        { name: "total_ttc", label: "Total TTC", type: "number", step: "0.01" },
        { name: "montant_paye", label: "Montant encaissé", type: "number", step: "0.01" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "impayee" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
