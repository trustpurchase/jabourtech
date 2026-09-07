import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

type Opt = { value: string; label: string };

function useOptions(key: string, table: string, select: string, order: string) {
  return useQuery({
    queryKey: [table, "options", key],
    queryFn: async () => {
      const { data, error } = await db.from(table).select(select).order(order);
      if (error) throw error;
      return (data ?? []) as unknown as Record<string, unknown>[];
    },
  });
}

export function useClientOptions() {
  const { data } = useOptions("clients", "clients", "id, raison_sociale", "raison_sociale");
  const options: Opt[] = (data ?? []).map((r) => ({
    value: String(r["id"]),
    label: String(r["raison_sociale"]),
  }));
  return { options, map: new Map(options.map((o) => [o.value, o.label])) };
}

export function useFournisseurOptions() {
  const { data } = useOptions("fournisseurs", "fournisseurs", "id, raison_sociale", "raison_sociale");
  const options: Opt[] = (data ?? []).map((r) => ({
    value: String(r["id"]),
    label: String(r["raison_sociale"]),
  }));
  return { options, map: new Map(options.map((o) => [o.value, o.label])) };
}

export function useProjetOptions() {
  const { data } = useOptions("projets", "projets", "id, code, intitule", "code");
  const options: Opt[] = (data ?? []).map((r) => ({
    value: String(r["id"]),
    label: `${String(r["code"])} — ${String(r["intitule"])}`,
  }));
  return { options, map: new Map(options.map((o) => [o.value, o.label])) };
}

export function useDocOptions(table: string, labelKey = "numero") {
  const { data } = useOptions(table, table, `id, ${labelKey}`, labelKey);
  const options: Opt[] = (data ?? []).map((r) => ({
    value: String(r["id"]),
    label: String(r[labelKey]),
  }));
  return { options, map: new Map(options.map((o) => [o.value, o.label])) };
}

export const MODES_PAIEMENT: Opt[] = [
  { value: "especes", label: "Espèces" },
  { value: "cheque", label: "Chèque" },
  { value: "virement", label: "Virement" },
  { value: "effet", label: "Effet" },
  { value: "carte", label: "Carte bancaire" },
];
