import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtMAD } from "@/lib/db";
import { useDocOptions, useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/decomptes")({
  head: () => ({
    meta: [
      { title: "Décomptes — BTP Gestion" },
      {
        name: "description",
        content: "Décomptes provisoires : travaux, retenue de garantie, avance et net à payer.",
      },
      { property: "og:title", content: "Décomptes — BTP Gestion" },
      { property: "og:description", content: "Décomptes de travaux et net à payer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DecomptesPage,
});

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "depose", label: "Déposé" },
  { value: "valide", label: "Validé" },
  { value: "paye", label: "Payé" },
];

function DecomptesPage() {
  const projets = useProjetOptions();
  const attachements = useDocOptions("attachements");

  return (
    <CrudPage
      table="decomptes"
      title="Décomptes"
      subtitle="Décomptes provisoires et définitifs des chantiers."
      searchKeys={["numero", "notes"]}
      columns={[
        { name: "numero", label: "N°" },
        {
          name: "projet_id",
          label: "Projet",
          render: (r: Row) => projets.map.get(String(r["projet_id"])) ?? "—",
        },
        { name: "numero_ordre", label: "Ordre" },
        {
          name: "date_decompte",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_decompte"] as string),
        },
        {
          name: "montant_travaux",
          label: "Travaux",
          render: (r: Row) => fmtMAD(r["montant_travaux"] as number),
        },
        {
          name: "montant_net",
          label: "Net à payer",
          render: (r: Row) => fmtMAD(r["montant_net"] as number),
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "paye" ? "default" : "secondary"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "attachement_id", label: "Attachement", type: "select", options: attachements.options },
        { name: "numero_ordre", label: "N° d'ordre", type: "number" },
        { name: "date_decompte", label: "Date", type: "date" },
        { name: "montant_travaux", label: "Montant des travaux", type: "number", step: "0.01" },
        { name: "retenue_garantie", label: "Retenue de garantie", type: "number", step: "0.01" },
        { name: "avance", label: "Avance à déduire", type: "number", step: "0.01" },
        { name: "montant_net", label: "Net à payer", type: "number", step: "0.01" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "brouillon" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
