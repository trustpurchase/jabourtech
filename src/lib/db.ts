import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Untyped view of the client, used by the generic CRUD screens. */
export const db = supabase as unknown as SupabaseClient;

export const fmtMAD = (value: number | null | undefined) =>
  new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(Number(value ?? 0));

export const fmtNumber = (value: number | null | undefined) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(Number(value ?? 0));

export const fmtDate = (value: string | null | undefined) =>
  value ? new Intl.DateTimeFormat("fr-FR").format(new Date(value)) : "—";
