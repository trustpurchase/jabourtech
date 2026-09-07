import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Row = Record<string, unknown>;

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
  step?: string;
};

export type Column = {
  name: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  className?: string;
};

type Props = {
  table: string;
  title: string;
  subtitle?: string;
  select?: string;
  orderBy?: string;
  columns: Column[];
  fields: Field[];
  searchKeys: string[];
  emptyLabel?: string;
};

export function CrudPage({
  table,
  title,
  subtitle,
  select = "*",
  orderBy = "created_at",
  columns,
  fields,
  searchKeys,
  emptyLabel = "Aucun enregistrement pour le moment.",
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await db
        .from(table)
        .select(select)
        .order(orderBy, { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const query = editing
        ? db
            .from(table)
            .update(payload)
            .eq("id", editing["id"] as string)
        : db.from(table).insert(payload);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success(editing ? "Modification enregistrée" : "Enregistrement créé");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter((row) =>
      searchKeys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [data, search, searchKeys]);

  function openCreate() {
    setEditing(null);
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.name] = f.defaultValue ?? "";
    });
    setForm(initial);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      const v = row[f.name];
      initial[f.name] = v === null || v === undefined ? "" : String(v);
    });
    setForm(initial);
    setOpen(true);
  }

  function submit() {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = (form[f.name] ?? "").trim();
      if (f.required && !raw) {
        toast.error(`Le champ « ${f.label} » est obligatoire.`);
        return;
      }
      if (raw === "") {
        payload[f.name] = f.type === "number" ? 0 : null;
      } else if (f.type === "number") {
        payload[f.name] = Number(raw);
      } else {
        payload[f.name] = raw;
      }
    }
    save.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.name} className={c.className}>
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center">
                  Chargement…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-muted-foreground"
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={String(row["id"])}>
                  {columns.map((c) => (
                    <TableCell key={c.name} className={c.className}>
                      {c.render ? c.render(row) : ((row[c.name] as React.ReactNode) ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Confirmer la suppression ?"))
                          remove.mutate(row["id"] as string);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Modifier — ${title}` : `Nouveau — ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={f.type === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}
              >
                <Label htmlFor={f.name}>
                  {f.label}
                  {f.required ? " *" : ""}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={form[f.name] ?? ""}
                    onValueChange={(v) => setForm({ ...form, [f.name]: v })}
                  >
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder="Sélectionner…" />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    step={f.step}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
