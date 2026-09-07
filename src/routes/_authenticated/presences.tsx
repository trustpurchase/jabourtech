import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db, fmtDate } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/presences")({
  head: () => ({
    meta: [
      { title: "Registre des présences — BTP Gestion" },
      {
        name: "description",
        content: "Historique des pointages des ouvriers par chantier, avec position GPS et distance vérifiée.",
      },
      { property: "og:title", content: "Registre des présences — BTP Gestion" },
      { property: "og:description", content: "Pointages des ouvriers par chantier." },
    ],
  }),
  component: Presences,
});

function Presences() {
  const { data } = useQuery({
    queryKey: ["presences"],
    queryFn: async () => {
      const [att, profiles] = await Promise.all([
        db
          .from("attendances")
          .select(
            "id, employee_id, timestamp, type, distance_meters, scanned_latitude, scanned_longitude, projet:projets(code, intitule)",
          )
          .order("timestamp", { ascending: false })
          .limit(200),
        db.from("profiles").select("id, full_name"),
      ]);
      const names = new Map(
        ((profiles.data ?? []) as { id: string; full_name: string }[]).map((p) => [p.id, p.full_name]),
      );
      return ((att.data ?? []) as Record<string, unknown>[]).map((r) => ({
        ...r,
        nom: names.get(r['employee_id'] as string) || "—",
      }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Registre des présences</h1>
        <p className="text-sm text-muted-foreground">
          Pointages horodatés par le serveur, avec contrôle GPS du chantier.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Derniers pointages</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ouvrier</TableHead>
                <TableHead>Chantier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun pointage enregistré.
                  </TableCell>
                </TableRow>
              )}
              {(data ?? []).map((row) => {
                const projet = row['projet'] as { code?: string; intitule?: string } | null;
                const ts = new Date(row['timestamp'] as string);
                return (
                  <TableRow key={row['id'] as string}>
                    <TableCell className="font-medium">{row['nom'] as string}</TableCell>
                    <TableCell>
                      {projet?.code ?? "—"} {projet?.intitule ? `— ${projet.intitule}` : ""}
                    </TableCell>
                    <TableCell>{fmtDate(row['timestamp'] as string)}</TableCell>
                    <TableCell>{ts.toLocaleTimeString("fr-FR")}</TableCell>
                    <TableCell>
                      <Badge variant={row['type'] === "check_in" ? "default" : "secondary"}>
                        {row['type'] === "check_in" ? "Entrée" : "Sortie"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {row['distance_meters'] == null
                        ? "—"
                        : `${Math.round(Number(row['distance_meters']))} m`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
