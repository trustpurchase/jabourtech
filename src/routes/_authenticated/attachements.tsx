import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtMAD } from "@/lib/db";
import { useProjetOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/attachements")({
  head: () => ({
    meta: [
      { title: "Attachements — BTP Gestion" },
      {
        name: "description",
        content: "Métrés et attachements de travaux réalisés par période et par chantier.",
      },
      { property: "og:title", content: "Attachements — BTP Gestion" },
      { property: "og:description", content: "Métrés et travaux réalisés par période." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AttachementsPage,
});

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "valide", label: "Validé" },
  { value: "decompte", label: "Décompté" },
];

function AttachementsPage() {
  const projets = useProjetOptions();

  return (
    <CrudPage
      table="attachements"
      title="Attachements"
      subtitle="Constat des travaux réalisés (métrés) par période."
      searchKeys={["numero", "periode", "notes"]}
      columns={[
        { name: "numero", label: "N°" },
        {
          name: "projet_id",
          label: "Projet",
          render: (r: Row) => projets.map.get(String(r["projet_id"])) ?? "—",
        },
        { name: "periode", label: "Période" },
        {
          name: "date_attachement",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_attachement"] as string),
        },
        {
          name: "montant_ht",
          label: "Montant HT",
          render: (r: Row) => fmtMAD(r["montant_ht"] as number),
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "brouillon" ? "secondary" : "default"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "projet_id", label: "Projet", type: "select", options: projets.options },
        { name: "date_attachement", label: "Date", type: "date" },
        { name: "periode", label: "Période (ex. Août 2026)" },
        { name: "montant_ht", label: "Montant HT", type: "number", step: "0.01" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "brouillon" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
