import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { db, fmtDate, fmtMAD } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/devis")({
  head: () => ({
    meta: [
      { title: "Devis — BTP Gestion" },
      {
        name: "description",
        content: "Préparation et suivi des devis clients : montants, validité et statut.",
      },
      { property: "og:title", content: "Devis — BTP Gestion" },
      { property: "og:description", content: "Préparation et suivi des devis clients." },
    ],
  }),
  component: DevisPage,
});

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "envoye", label: "Envoyé" },
  { value: "accepte", label: "Accepté" },
  { value: "refuse", label: "Refusé" },
];

function DevisPage() {
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

  const { data: projets } = useQuery({
    queryKey: ["projets", "options"],
    queryFn: async () => {
      const { data, error } = await db.from("projets").select("id, code, intitule").order("code");
      if (error) throw error;
      return (data ?? []) as { id: string; code: string; intitule: string }[];
    },
  });

  const clientMap = new Map((clients ?? []).map((c) => [c.id, c.raison_sociale]));

  return (
    <CrudPage
      table="devis"
      title="Devis"
      subtitle="Offres de prix adressées aux clients."
      searchKeys={["numero", "objet"]}
      columns={[
        { name: "numero", label: "N° devis" },
        {
          name: "client_id",
          label: "Client",
          render: (r: Row) => clientMap.get(String(r["client_id"])) ?? "—",
        },
        { name: "objet", label: "Objet" },
        {
          name: "date_devis",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_devis"] as string),
        },
        {
          name: "total_ttc",
          label: "Total TTC",
          render: (r: Row) => fmtMAD(r["total_ttc"] as number),
        },
        {
          name: "statut",
          label: "Statut",
          render: (r: Row) => (
            <Badge variant={r["statut"] === "accepte" ? "default" : "secondary"}>
              {STATUTS.find((s) => s.value === r["statut"])?.label ?? String(r["statut"])}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        {
          name: "client_id",
          label: "Client",
          type: "select",
          options: (clients ?? []).map((c) => ({ value: c.id, label: c.raison_sociale })),
        },
        {
          name: "projet_id",
          label: "Projet",
          type: "select",
          options: (projets ?? []).map((p) => ({ value: p.id, label: `${p.code} — ${p.intitule}` })),
        },
        { name: "objet", label: "Objet" },
        { name: "date_devis", label: "Date du devis", type: "date" },
        { name: "date_validite", label: "Validité", type: "date" },
        { name: "remise", label: "Remise (MAD)", type: "number", step: "0.01" },
        { name: "total_ht", label: "Total HT", type: "number", step: "0.01" },
        { name: "total_tva", label: "Total TVA", type: "number", step: "0.01" },
        { name: "total_ttc", label: "Total TTC", type: "number", step: "0.01" },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: STATUTS,
          defaultValue: "brouillon",
        },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
