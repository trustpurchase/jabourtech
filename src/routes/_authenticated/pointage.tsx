import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QrCode, LogIn, LogOut } from "lucide-react";
import { db, fmtDate } from "@/lib/db";
import { useAuth } from "@/hooks/useAuth";
import { getDeviceFingerprint } from "@/lib/device";
import { scanAttendance } from "@/lib/attendance.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/pointage")({
  head: () => ({
    meta: [
      { title: "Pointage ouvrier — BTP Gestion" },
      {
        name: "description",
        content: "Scannez le QR code du chantier pour enregistrer votre entrée ou votre sortie.",
      },
      { property: "og:title", content: "Pointage ouvrier — BTP Gestion" },
      { property: "og:description", content: "Pointage par QR code avec vérification GPS." },
    ],
  }),
  component: Pointage,
});

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non disponible sur cet appareil"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, () => reject(new Error("Position GPS refusée")), {
      enableHighAccuracy: true,
      timeout: 15000,
    });
  });
}

function Pointage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const scan = useServerFn(scanAttendance);
  const [type, setType] = useState<"check_in" | "check_out">("check_in");
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);

  const { data: history } = useQuery({
    queryKey: ["mes-pointages", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await db
        .from("attendances")
        .select("id, timestamp, type, distance_meters, projet:projets(code, intitule)")
        .eq("employee_id", user!.id)
        .order("timestamp", { ascending: false })
        .limit(15);
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const stopScanner = async () => {
    try {
      await scannerRef.current?.stop();
      scannerRef.current?.clear();
    } catch {
      /* déjà arrêté */
    }
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, []);

  const submit = async (token: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const pos = await getPosition();
      const res = await scan({
        data: {
          token,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          deviceFingerprint: getDeviceFingerprint(),
          type,
        },
      });
      toast.success(
        `${res.type === "check_in" ? "Entrée" : "Sortie"} enregistrée — ${res.projet}`,
        {
          description: `${new Date(res.timestamp).toLocaleTimeString("fr-FR")}${
            res.distance != null ? ` · ${res.distance} m du chantier` : ""
          }`,
        },
      );
      await qc.invalidateQueries({ queryKey: ["mes-pointages"] });
      await stopScanner();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Pointage refusé");
    } finally {
      setBusy(false);
    }
  };

  const startScanner = async () => {
    setScanning(true);
    const { Html5Qrcode } = await import("html5-qrcode");
    const instance = new Html5Qrcode("qr-reader");
    scannerRef.current = instance as unknown as { stop: () => Promise<void>; clear: () => void };
    try {
      await instance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          void submit(decoded);
        },
        () => {},
      );
    } catch {
      toast.error("Impossible d'accéder à la caméra");
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pointage</h1>
        <p className="text-sm text-muted-foreground">
          Scannez le QR code affiché à l'entrée du chantier. Votre position GPS est vérifiée.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <QrCode className="size-4" /> Enregistrer un mouvement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={type === "check_in" ? "default" : "outline"}
              onClick={() => setType("check_in")}
              className="flex-1"
            >
              <LogIn className="size-4" /> Entrée
            </Button>
            <Button
              variant={type === "check_out" ? "default" : "outline"}
              onClick={() => setType("check_out")}
              className="flex-1"
            >
              <LogOut className="size-4" /> Sortie
            </Button>
          </div>

          <div id="qr-reader" className={scanning ? "overflow-hidden rounded-lg border" : "hidden"} />

          {scanning ? (
            <Button variant="outline" className="w-full" onClick={() => void stopScanner()}>
              Annuler
            </Button>
          ) : (
            <Button className="w-full" disabled={busy} onClick={() => void startScanner()}>
              <QrCode className="size-4" /> Scanner le QR code
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mes derniers pointages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(history ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun pointage enregistré.</p>
          )}
          {(history ?? []).map((row) => {
            const projet = row['projet'] as { code?: string; intitule?: string } | null;
            const ts = new Date(row['timestamp'] as string);
            return (
              <div
                key={row['id'] as string}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {projet?.code ?? "—"} {projet?.intitule ? `— ${projet.intitule}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(row['timestamp'] as string)} à {ts.toLocaleTimeString("fr-FR")}
                  </p>
                </div>
                <Badge variant={row['type'] === "check_in" ? "default" : "secondary"}>
                  {row['type'] === "check_in" ? "Entrée" : "Sortie"}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
