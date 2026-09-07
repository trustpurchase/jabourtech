import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtMAD } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/appels-offres")({
  head: () => ({
    meta: [
      { title: "Appels d'offres — BTP Gestion" },
      {
        name: "description",
        content: "Préparation et suivi des appels d'offres : maître d'ouvrage, caution et dates limites.",
      },
      { property: "og:title", content: "Appels d'offres — BTP Gestion" },
      { property: "og:description", content: "Suivi des appels d'offres et des dates limites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppelsOffresPage,
});

const STATUTS = [
  { value: "preparation", label: "En préparation" },
  { value: "depose", label: "Déposé" },
  { value: "gagne", label: "Gagné" },
  { value: "perdu", label: "Perdu" },
];

function AppelsOffresPage() {
  return (
    <CrudPage
      table="appels_offres"
      title="Appels d'offres"
      subtitle="Préparation des dossiers de soumission."
      searchKeys={["numero", "objet", "maitre_ouvrage"]}
      columns={[
        { name: "numero", label: "N°" },
        { name: "objet", label: "Objet" },
        { name: "maitre_ouvrage", label: "Maître d'ouvrage" },
        {
          name: "date_limite",
          label: "Date limite",
          render: (r: Row) => fmtDate(r["date_limite"] as string),
        },
        {
          name: "montant_estime",
          label: "Montant estimé",
          render: (r: Row) => fmtMAD(r["montant_estime"] as number),
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "gagne" ? "default" : "secondary"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "objet", label: "Objet", required: true },
        { name: "maitre_ouvrage", label: "Maître d'ouvrage" },
        { name: "date_publication", label: "Date de publication", type: "date" },
        { name: "date_limite", label: "Date limite", type: "date" },
        { name: "caution", label: "Caution (MAD)", type: "number", step: "0.01" },
        { name: "montant_estime", label: "Montant estimé (MAD)", type: "number", step: "0.01" },
        { name: "statut", label: "Statut", type: "select", options: STATUTS, defaultValue: "preparation" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
