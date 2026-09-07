import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { fmtDate, fmtMAD } from "@/lib/db";
import { MODES_PAIEMENT, useClientOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/vente-comptoir")({
  head: () => ({
    meta: [
      { title: "Vente au comptoir — BTP Gestion" },
      {
        name: "description",
        content: "Ventes directes au comptoir : montants encaissés et mode de paiement.",
      },
      { property: "og:title", content: "Vente au comptoir — BTP Gestion" },
      { property: "og:description", content: "Ventes directes et encaissements au comptoir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VenteComptoirPage,
});

function VenteComptoirPage() {
  const clients = useClientOptions();

  return (
    <CrudPage
      table="ventes_comptoir"
      title="Vente au comptoir"
      subtitle="Ventes directes encaissées immédiatement."
      searchKeys={["numero", "client_nom"]}
      columns={[
        { name: "numero", label: "N° ticket" },
        {
          name: "client_id",
          label: "Client",
          render: (r: Row) =>
            clients.map.get(String(r["client_id"])) ?? (r["client_nom"] as string) ?? "Comptoir",
        },
        {
          name: "date_vente",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_vente"] as string),
        },
        {
          name: "total_ttc",
          label: "Total TTC",
          render: (r: Row) => fmtMAD(r["total_ttc"] as number),
        },
        {
          name: "mode_paiement",
          label: "Paiement",
          render: (r: Row) =>
            MODES_PAIEMENT.find((m) => m.value === r["mode_paiement"])?.label ??
            String(r["mode_paiement"]),
        },
      ]}
      fields={[
        { name: "numero", label: "Numéro", required: true },
        { name: "client_id", label: "Client enregistré", type: "select", options: clients.options },
        { name: "client_nom", label: "Client de passage" },
        { name: "date_vente", label: "Date", type: "date" },
        { name: "total_ht", label: "Total HT", type: "number", step: "0.01" },
        { name: "total_tva", label: "Total TVA", type: "number", step: "0.01" },
        { name: "total_ttc", label: "Total TTC", type: "number", step: "0.01" },
        {
          name: "mode_paiement",
          label: "Mode de paiement",
          type: "select",
          options: MODES_PAIEMENT,
          defaultValue: "especes",
        },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
