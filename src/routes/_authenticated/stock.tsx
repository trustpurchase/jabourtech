import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package } from "lucide-react";
import { db, fmtMAD, fmtNumber } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/stock")({
  head: () => ({
    meta: [
      { title: "État de stock — BTP Gestion" },
      {
        name: "description",
        content: "État du stock, valorisation du magasin et articles passés sous le seuil d'alerte.",
      },
      { property: "og:title", content: "État de stock — BTP Gestion" },
      { property: "og:description", content: "Valorisation du magasin et stock en alerte." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StockPage,
});

function StockPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "stock"],
    queryFn: async () => {
      const { data, error } = await db
        .from("articles")
        .select("id, reference, designation, unite, famille, prix_achat, stock_actuel, stock_alerte")
        .order("reference");
      if (error) throw error;
      return (data ?? []) as unknown as Record<string, unknown>[];
    },
  });

  const rows = data ?? [];
  const valeur = rows.reduce(
    (s, a) => s + Number(a["stock_actuel"] ?? 0) * Number(a["prix_achat"] ?? 0),
    0,
  );
  const alertes = rows.filter(
    (a) => Number(a["stock_actuel"] ?? 0) <= Number(a["stock_alerte"] ?? 0),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">État de stock</h1>
        <p className="text-sm text-muted-foreground">
          Situation du magasin et articles sous le seuil d'alerte.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Articles référencés", value: String(rows.length), icon: Package },
          { label: "Valeur du stock", value: fmtMAD(valeur), icon: Package },
          { label: "Articles en alerte", value: String(alertes.length), icon: AlertTriangle },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Stock en alerte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alertes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun article sous le seuil.</p>
          ) : (
            alertes.map((a) => (
              <div
                key={String(a["id"])}
                className="flex items-center justify-between border-b pb-2 text-sm last:border-0"
              >
                <span>
                  {String(a["reference"])} — {String(a["designation"])}
                </span>
                <Badge variant="destructive">
                  {fmtNumber(Number(a["stock_actuel"] ?? 0))} {String(a["unite"] ?? "")}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Désignation</TableHead>
              <TableHead>Famille</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Seuil</TableHead>
              <TableHead>Valeur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  Chargement…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucun article enregistré.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((a) => (
                <TableRow key={String(a["id"])}>
                  <TableCell>{String(a["reference"])}</TableCell>
                  <TableCell>{String(a["designation"])}</TableCell>
                  <TableCell>{(a["famille"] as string) ?? "—"}</TableCell>
                  <TableCell>
                    {fmtNumber(Number(a["stock_actuel"] ?? 0))} {String(a["unite"] ?? "")}
                  </TableCell>
                  <TableCell>{fmtNumber(Number(a["stock_alerte"] ?? 0))}</TableCell>
                  <TableCell>
                    {fmtMAD(Number(a["stock_actuel"] ?? 0) * Number(a["prix_achat"] ?? 0))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
