import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TTL_SECONDS = 20;

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function hmacToken(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 40);
}

/** Écran du chantier : génère un jeton QR temporaire (staff uniquement). */
export const issueQrToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { projectId: string }) => {
    if (!input?.projectId) throw new Error("Chantier requis");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Accès refusé");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: projet, error } = await supabaseAdmin
      .from("projets")
      .select("id, code, intitule, qr_secret_key, latitude, longitude, radius_meters")
      .eq("id", data.projectId)
      .maybeSingle();
    if (error || !projet) throw new Error("Chantier introuvable");

    const nonce = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000);
    const token = await hmacToken(
      (projet as { qr_secret_key: string }).qr_secret_key,
      `${projet.id}:${nonce}:${expiresAt.getTime()}`,
    );

    await supabaseAdmin.from("qr_sessions").insert({
      project_id: projet.id,
      token,
      expires_at: expiresAt.toISOString(),
    });
    await supabaseAdmin.from("qr_sessions").delete().lt("expires_at", new Date(Date.now() - 300000).toISOString());

    return {
      token,
      expiresAt: expiresAt.toISOString(),
      ttl: TTL_SECONDS,
      projet: {
        code: projet.code as string,
        intitule: projet.intitule as string,
        hasGeo: projet.latitude != null && projet.longitude != null,
      },
    };
  });

/** Téléphone de l'ouvrier : valide le jeton, la position GPS et enregistre le pointage. */
export const scanAttendance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      token: string;
      latitude: number;
      longitude: number;
      deviceFingerprint: string;
      type: "check_in" | "check_out";
    }) => {
      if (!input?.token) throw new Error("Code QR invalide");
      if (typeof input.latitude !== "number" || typeof input.longitude !== "number")
        throw new Error("Position GPS indisponible");
      if (!input.deviceFingerprint) throw new Error("Appareil non identifié");
      if (input.type !== "check_in" && input.type !== "check_out") throw new Error("Type invalide");
      return input;
    },
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: session } = await supabaseAdmin
      .from("qr_sessions")
      .select("id, project_id, expires_at")
      .eq("token", data.token)
      .maybeSingle();
    if (!session) throw new Error("Code QR invalide ou déjà expiré");
    if (new Date(session.expires_at as string).getTime() < Date.now())
      throw new Error("Code QR expiré, veuillez rescanner l'écran");

    const { data: projet } = await supabaseAdmin
      .from("projets")
      .select("id, code, intitule, latitude, longitude, radius_meters")
      .eq("id", session.project_id as string)
      .maybeSingle();
    if (!projet) throw new Error("Chantier introuvable");

    let distance: number | null = null;
    if (projet.latitude != null && projet.longitude != null) {
      distance = haversineMeters(
        data.latitude,
        data.longitude,
        projet.latitude as number,
        projet.longitude as number,
      );
      const radius = Number(projet.radius_meters ?? 50);
      if (distance > radius)
        throw new Error(
          `Vous êtes à ${Math.round(distance)} m du chantier (limite ${radius} m). Pointage refusé.`,
        );
    }

    // Liaison compte / appareil
    const { data: byDevice } = await supabaseAdmin
      .from("user_devices")
      .select("user_id")
      .eq("device_fingerprint", data.deviceFingerprint)
      .maybeSingle();
    const { data: byUser } = await supabaseAdmin
      .from("user_devices")
      .select("device_fingerprint")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (byDevice && byDevice.user_id !== context.userId)
      throw new Error("Cet appareil est déjà associé à un autre compte.");
    if (byUser && byUser.device_fingerprint !== data.deviceFingerprint)
      throw new Error("Compte associé à un autre téléphone. Contactez l'administrateur.");
    if (!byUser)
      await supabaseAdmin
        .from("user_devices")
        .insert({ user_id: context.userId, device_fingerprint: data.deviceFingerprint });

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("attendances")
      .insert({
        employee_id: context.userId,
        project_id: projet.id,
        type: data.type,
        scanned_latitude: data.latitude,
        scanned_longitude: data.longitude,
        distance_meters: distance,
        device_fingerprint: data.deviceFingerprint,
      })
      .select("id, timestamp, type")
      .single();
    if (insErr) throw new Error(insErr.message);

    // Jeton à usage unique
    await supabaseAdmin.from("qr_sessions").delete().eq("id", session.id as string);

    return {
      id: inserted.id as string,
      timestamp: inserted.timestamp as string,
      type: inserted.type as string,
      distance: distance == null ? null : Math.round(distance),
      projet: `${projet.code} — ${projet.intitule}`,
    };
  });
