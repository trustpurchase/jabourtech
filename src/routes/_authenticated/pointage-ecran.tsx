import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import QRCode from "qrcode";
import { MonitorSmartphone } from "lucide-react";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { issueQrToken } from "@/lib/attendance.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/pointage-ecran")({
  head: () => ({
    meta: [
      { title: "Écran de pointage QR — BTP Gestion" },
      {
        name: "description",
        content: "Affichage d'un QR code dynamique renouvelé toutes les 20 secondes à l'entrée du chantier.",
      },
      { property: "og:title", content: "Écran de pointage QR — BTP Gestion" },
      { property: "og:description", content: "QR code temporaire pour le pointage des ouvriers." },
    ],
  }),
  component: EcranPointage,
});

function EcranPointage() {
  const issue = useServerFn(issueQrToken);
  const [projectId, setProjectId] = useState<string>("");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState<string>("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: projets } = useQuery({
    queryKey: ["projets-pointage"],
    queryFn: async () => {
      const { data } = await db.from("projets").select("id, code, intitule").order("code");
      return (data ?? []) as { id: string; code: string; intitule: string }[];
    },
  });

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await issue({ data: { projectId } });
        if (cancelled) return;
        setError("");
        setDataUrl(await QRCode.toDataURL(res.token, { width: 520, margin: 1 }));
        setRemaining(res.ttl);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur de génération");
      }
    };

    void refresh();
    const gen = setInterval(refresh, 20000);
    timer.current = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => {
      cancelled = true;
      clearInterval(gen);
      if (timer.current) clearInterval(timer.current);
    };
  }, [projectId, issue]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Écran de pointage</h1>
        <p className="text-sm text-muted-foreground">
          À afficher sur une tablette ou un écran à l'entrée du chantier. Le code change automatiquement
          toutes les 20 secondes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MonitorSmartphone className="size-4" /> Chantier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-2">
            <Label>Sélectionner le chantier</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un chantier" />
              </SelectTrigger>
              <SelectContent>
                {(projets ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} — {p.intitule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {projectId && dataUrl && (
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6">
              <img src={dataUrl} alt="QR code de pointage" className="w-full max-w-[420px]" />
              <p className="text-sm text-muted-foreground">
                Nouveau code dans <span className="font-semibold text-foreground">{remaining}s</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
