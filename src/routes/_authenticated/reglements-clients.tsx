import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { fmtDate, fmtMAD } from "@/lib/db";
import { MODES_PAIEMENT, useClientOptions, useDocOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/reglements-clients")({
  head: () => ({
    meta: [
      { title: "Règlements clients — BTP Gestion" },
      {
        name: "description",
        content: "Encaissements clients : montants, modes de paiement et factures rattachées.",
      },
      { property: "og:title", content: "Règlements clients — BTP Gestion" },
      { property: "og:description", content: "Encaissements et modes de paiement des clients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReglementsClientsPage,
});

function ReglementsClientsPage() {
  const clients = useClientOptions();
  const factures = useDocOptions("factures");

  return (
    <CrudPage
      table="reglements_clients"
      title="Règlements clients"
      subtitle="Encaissements reçus des clients."
      searchKeys={["reference", "notes"]}
      columns={[
        {
          name: "date_reglement",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_reglement"] as string),
        },
        {
          name: "client_id",
          label: "Client",
          render: (r: Row) => clients.map.get(String(r["client_id"])) ?? "—",
        },
        {
          name: "facture_id",
          label: "Facture",
          render: (r: Row) => factures.map.get(String(r["facture_id"])) ?? "—",
        },
        { name: "montant", label: "Montant", render: (r: Row) => fmtMAD(r["montant"] as number) },
        {
          name: "mode",
          label: "Mode",
          render: (r: Row) =>
            MODES_PAIEMENT.find((m) => m.value === r["mode"])?.label ?? String(r["mode"]),
        },
        { name: "reference", label: "Référence" },
      ]}
      fields={[
        { name: "date_reglement", label: "Date du règlement", type: "date" },
        { name: "client_id", label: "Client", type: "select", options: clients.options },
        { name: "facture_id", label: "Facture", type: "select", options: factures.options },
        { name: "montant", label: "Montant (MAD)", type: "number", step: "0.01", required: true },
        { name: "mode", label: "Mode de paiement", type: "select", options: MODES_PAIEMENT, defaultValue: "especes" },
        { name: "reference", label: "Référence (n° chèque…)" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
