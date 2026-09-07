import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { db, fmtDate, fmtMAD } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/projets")({
  head: () => ({
    meta: [
      { title: "Projets & Chantiers — BTP Gestion" },
      {
        name: "description",
        content: "Suivi des chantiers : montant du marché, avancement, dates et localisation.",
      },
      { property: "og:title", content: "Projets & Chantiers — BTP Gestion" },
      { property: "og:description", content: "Suivi des chantiers, avancement et montants." },
    ],
  }),
  component: ProjetsPage,
});

const STATUTS = [
  { value: "prospection", label: "Prospection" },
  { value: "en_cours", label: "En cours" },
  { value: "suspendu", label: "Suspendu" },
  { value: "termine", label: "Terminé" },
];

function ProjetsPage() {
  const { data: clients } = useQuery({
    queryKey: ["clients", "options"],
    queryFn: async () => {
      const { data, error } = await db
        .from("clients")
        .select("id, raison_sociale")
        .order("raison_sociale");
      if (error) throw error;
      return (data ?? []) as { id: string; raison_sociale: string }[];
    },
  });

  const clientMap = new Map((clients ?? []).map((c) => [c.id, c.raison_sociale]));

  return (
    <CrudPage
      table="projets"
      title="Projets & Chantiers"
      subtitle="Marchés, avancement et coordonnées du chantier."
      searchKeys={["code", "intitule", "ville", "maitre_ouvrage"]}
      columns={[
        { name: "code", label: "Code" },
        { name: "intitule", label: "Intitulé" },
        {
          name: "client_id",
          label: "Client",
          render: (r: Row) => clientMap.get(String(r["client_id"])) ?? "—",
        },
        {
          name: "montant_marche",
          label: "Montant",
          render: (r: Row) => fmtMAD(r["montant_marche"] as number),
        },
        {
          name: "avancement",
          label: "Avancement",
          render: (r: Row) => `${Number(r["avancement"] ?? 0)} %`,
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "termine" ? "secondary" : "default"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
        {
          name: "date_fin_prevue",
          label: "Fin prévue",
          render: (r: Row) => fmtDate(r["date_fin_prevue"] as string),
        },
      ]}
      fields={[
        { name: "code", label: "Code projet", required: true },
        { name: "intitule", label: "Intitulé", required: true },
        {
          name: "client_id",
          label: "Client",
          type: "select",
          options: (clients ?? []).map((c) => ({ value: c.id, label: c.raison_sociale })),
        },
        { name: "maitre_ouvrage", label: "Maître d'ouvrage" },
        { name: "ville", label: "Ville" },
        { name: "adresse", label: "Adresse du chantier", type: "textarea" },
        { name: "montant_marche", label: "Montant du marché (MAD)", type: "number", step: "0.01" },
        { name: "date_debut", label: "Date de début", type: "date" },
        { name: "date_fin_prevue", label: "Fin prévue", type: "date" },
        { name: "avancement", label: "Avancement (%)", type: "number", step: "0.01" },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: STATUTS,
          defaultValue: "en_cours",
        },
        { name: "latitude", label: "Latitude du chantier", type: "number", step: "0.000001" },
        { name: "longitude", label: "Longitude du chantier", type: "number", step: "0.000001" },
        {
          name: "radius_meters",
          label: "Rayon de pointage (m)",
          type: "number",
          defaultValue: "100",
        },
      ]}
    />
  );
}
