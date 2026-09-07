import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CrudPage, type Row } from "@/components/crud-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, fmtDate, fmtMAD } from "@/lib/db";
import { MODES_PAIEMENT } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/caisse")({
  head: () => ({
    meta: [
      { title: "Caisse — BTP Gestion" },
      {
        name: "description",
        content: "Journal de caisse : entrées, sorties et solde courant de la trésorerie.",
      },
      { property: "og:title", content: "Caisse — BTP Gestion" },
      { property: "og:description", content: "Entrées, sorties et solde de caisse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CaissePage,
});

const TYPES = [
  { value: "entree", label: "Entrée" },
  { value: "sortie", label: "Sortie" },
];

function CaissePage() {
  const { data } = useQuery({
    queryKey: ["caisse", "solde"],
    queryFn: async () => {
      const { data, error } = await db.from("caisse").select("type, montant");
      if (error) throw error;
      return (data ?? []) as unknown as Record<string, unknown>[];
    },
  });

  const entrees = (data ?? [])
    .filter((r) => r["type"] === "entree")
    .reduce((s, r) => s + Number(r["montant"] ?? 0), 0);
  const sorties = (data ?? [])
    .filter((r) => r["type"] === "sortie")
    .reduce((s, r) => s + Number(r["montant"] ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total encaissé", value: fmtMAD(entrees) },
          { label: "Total décaissé", value: fmtMAD(sorties) },
          { label: "Solde de caisse", value: fmtMAD(entrees - sorties) },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <CrudPage
        table="caisse"
        title="Caisse"
        subtitle="Journal des mouvements de trésorerie."
        orderBy="date_operation"
        searchKeys={["libelle", "reference"]}
        columns={[
          {
            name: "date_operation",
            label: "Date",
            render: (r: Row) => fmtDate(r["date_operation"] as string),
          },
          {
            name: "type",
            label: "Type",
            render: (r: Row) => (
              <Badge variant={r["type"] === "entree" ? "default" : "destructive"}>
                {r["type"] === "entree" ? "Entrée" : "Sortie"}
              </Badge>
            ),
          },
          { name: "libelle", label: "Libellé" },
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
          { name: "date_operation", label: "Date", type: "date" },
          { name: "type", label: "Type", type: "select", options: TYPES, defaultValue: "entree" },
          { name: "libelle", label: "Libellé", required: true },
          { name: "montant", label: "Montant (MAD)", type: "number", step: "0.01", required: true },
          { name: "mode", label: "Mode", type: "select", options: MODES_PAIEMENT, defaultValue: "especes" },
          { name: "reference", label: "Référence" },
        ]}
      />
    </div>
  );
}
