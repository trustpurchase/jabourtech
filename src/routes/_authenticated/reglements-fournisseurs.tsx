import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { fmtDate, fmtMAD } from "@/lib/db";
import { MODES_PAIEMENT, useDocOptions, useFournisseurOptions } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/reglements-fournisseurs")({
  head: () => ({
    meta: [
      { title: "Règlements fournisseurs — BTP Gestion" },
      {
        name: "description",
        content: "Paiements aux fournisseurs : montants, modes de paiement et factures d'achat.",
      },
      { property: "og:title", content: "Règlements fournisseurs — BTP Gestion" },
      { property: "og:description", content: "Paiements fournisseurs et suivi de la dette." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReglementsFournisseursPage,
});

function ReglementsFournisseursPage() {
  const fournisseurs = useFournisseurOptions();
  const factures = useDocOptions("factures_achat");

  return (
    <CrudPage
      table="reglements_fournisseurs"
      title="Règlements fournisseurs"
      subtitle="Paiements effectués aux fournisseurs."
      searchKeys={["reference", "notes"]}
      columns={[
        {
          name: "date_reglement",
          label: "Date",
          render: (r: Row) => fmtDate(r["date_reglement"] as string),
        },
        {
          name: "fournisseur_id",
          label: "Fournisseur",
          render: (r: Row) => fournisseurs.map.get(String(r["fournisseur_id"])) ?? "—",
        },
        {
          name: "facture_achat_id",
          label: "Facture d'achat",
          render: (r: Row) => factures.map.get(String(r["facture_achat_id"])) ?? "—",
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
        { name: "fournisseur_id", label: "Fournisseur", type: "select", options: fournisseurs.options },
        { name: "facture_achat_id", label: "Facture d'achat", type: "select", options: factures.options },
        { name: "montant", label: "Montant (MAD)", type: "number", step: "0.01", required: true },
        { name: "mode", label: "Mode de paiement", type: "select", options: MODES_PAIEMENT, defaultValue: "especes" },
        { name: "reference", label: "Référence (n° chèque…)" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
