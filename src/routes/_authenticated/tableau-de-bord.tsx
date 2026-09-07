import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Users, FileText, AlertTriangle } from "lucide-react";
import { db, fmtMAD, fmtNumber } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — BTP Gestion" },
      {
        name: "description",
        content: "Vue d'ensemble : chantiers en cours, devis, clients et alertes de stock.",
      },
      { property: "og:title", content: "Tableau de bord — BTP Gestion" },
      { property: "og:description", content: "Chantiers, devis, clients et alertes de stock." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [projets, clients, devis, articles] = await Promise.all([
        db.from("projets").select("id, code, intitule, montant_marche, avancement, statut"),
        db.from("clients").select("id"),
        db.from("devis").select("id, total_ttc, statut"),
        db.from("articles").select("id, reference, designation, stock_actuel, stock_alerte, unite"),
      ]);
      return {
        projets: (projets.data ?? []) as Record<string, unknown>[],
        clients: (clients.data ?? []) as Record<string, unknown>[],
        devis: (devis.data ?? []) as Record<string, unknown>[],
        articles: (articles.data ?? []) as Record<string, unknown>[],
      };
    },
  });

  const projets = data?.projets ?? [];
  const devis = data?.devis ?? [];
  const enCours = projets.filter((p) => p["statut"] === "en_cours");
  const carnet = projets.reduce((sum, p) => sum + Number(p["montant_marche"] ?? 0), 0);
  const devisAttente = devis.filter((d) => d["statut"] !== "accepte" && d["statut"] !== "refuse");
  const alertes = (data?.articles ?? []).filter(
    (a) => Number(a["stock_actuel"] ?? 0) <= Number(a["stock_alerte"] ?? 0),
  );

  const stats = [
    {
      label: "Chantiers en cours",
      value: String(enCours.length),
      icon: FolderKanban,
      to: "/projets" as const,
    },
    { label: "Carnet de commandes", value: fmtMAD(carnet), icon: FileText, to: "/projets" as const },
    {
      label: "Devis en attente",
      value: String(devisAttente.length),
      icon: FileText,
      to: "/devis" as const,
    },
    {
      label: "Clients",
      value: String((data?.clients ?? []).length),
      icon: Users,
      to: "/clients" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">
          Vue d'ensemble de l'activité commerciale et des chantiers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chantiers en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enCours.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun chantier en cours.</p>
            ) : (
              enCours.slice(0, 6).map((p) => (
                <div key={String(p["id"])} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {String(p["code"])} — {String(p["intitule"])}
                    </span>
                    <span className="text-muted-foreground">
                      {Number(p["avancement"] ?? 0)} %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${Math.min(100, Number(p["avancement"] ?? 0))}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

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
              alertes.slice(0, 8).map((a) => (
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
      </div>
    </div>
  );
}
