import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Truck,
  Package,
  LogOut,
  HardHat,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/projets", label: "Projets", icon: FolderKanban },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/devis", label: "Devis", icon: FileText },
  { to: "/fournisseurs", label: "Fournisseurs", icon: Truck },
  { to: "/articles", label: "Articles & Stock", icon: Package },
] as const;

export function AppLayout() {
  const { user, roles, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:flex lg:translate-x-0",
          open ? "flex translate-x-0" : "hidden -translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
          <HardHat className="h-6 w-6 text-sidebar-primary" />
          <div>
            <p className="text-sm font-semibold tracking-tight">BTP Gestion</p>
            <p className="text-xs text-sidebar-foreground/60">Gestion & Chantiers</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border px-4 py-3 text-xs">
          <p className="truncate font-medium">{user?.email}</p>
          <p className="text-sidebar-foreground/60">{roles.join(", ") || "—"}</p>
          <button
            onClick={() => signOut()}
            className="mt-3 flex items-center gap-2 text-sidebar-foreground/75 hover:text-sidebar-primary"
          >
            <LogOut className="h-3.5 w-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b bg-card px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">BTP Gestion</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
