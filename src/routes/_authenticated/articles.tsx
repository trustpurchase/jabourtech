import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { fmtMAD, fmtNumber } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/articles")({
  head: () => ({
    meta: [
      { title: "Articles & Stock — BTP Gestion" },
      {
        name: "description",
        content: "Catalogue des matériaux, prix, quantités disponibles et alertes de stock.",
      },
      { property: "og:title", content: "Articles & Stock — BTP Gestion" },
      {
        property: "og:description",
        content: "Catalogue matériaux, prix et alertes de stock minimum.",
      },
    ],
  }),
  component: () => (
    <CrudPage
      table="articles"
      title="Articles & Stock"
      subtitle="Matériaux, prix et niveaux de stock avec alertes."
      searchKeys={["reference", "designation", "famille"]}
      columns={[
        { name: "reference", label: "Référence" },
        { name: "designation", label: "Désignation" },
        { name: "unite", label: "Unité" },
        {
          name: "prix_achat",
          label: "Prix achat",
          render: (r: Row) => fmtMAD(r["prix_achat"] as number),
        },
        {
          name: "prix_vente",
          label: "Prix vente",
          render: (r: Row) => fmtMAD(r["prix_vente"] as number),
        },
        {
          name: "stock_actuel",
          label: "Stock",
          render: (r: Row) => {
            const stock = Number(r["stock_actuel"] ?? 0);
            const seuil = Number(r["stock_alerte"] ?? 0);
            return (
              <span className="flex items-center gap-2">
                {fmtNumber(stock)}
                {stock <= seuil ? <Badge variant="destructive">Alerte</Badge> : null}
              </span>
            );
          },
        },
      ]}
      fields={[
        { name: "reference", label: "Référence", required: true },
        { name: "designation", label: "Désignation", required: true },
        { name: "unite", label: "Unité", defaultValue: "U" },
        { name: "famille", label: "Famille" },
        { name: "prix_achat", label: "Prix d'achat (MAD)", type: "number", step: "0.01" },
        { name: "prix_vente", label: "Prix de vente (MAD)", type: "number", step: "0.01" },
        { name: "tva", label: "TVA (%)", type: "number", step: "0.01", defaultValue: "20" },
        { name: "stock_actuel", label: "Stock actuel", type: "number", step: "0.001" },
        { name: "stock_alerte", label: "Seuil d'alerte", type: "number", step: "0.001" },
      ]}
    />
  ),
});
