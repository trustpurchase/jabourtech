import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";

export const Route = createFileRoute("/_authenticated/fournisseurs")({
  head: () => ({
    meta: [
      { title: "Fournisseurs — BTP Gestion" },
      { name: "description", content: "Base fournisseurs : coordonnées, ICE et contacts achats." },
      { property: "og:title", content: "Fournisseurs — BTP Gestion" },
      { property: "og:description", content: "Base fournisseurs et suivi des contacts achats." },
    ],
  }),
  component: () => (
    <CrudPage
      table="fournisseurs"
      title="Fournisseurs"
      subtitle="Base fournisseurs pour le cycle d'achat."
      searchKeys={["raison_sociale", "ice", "ville", "telephone"]}
      columns={[
        { name: "raison_sociale", label: "Raison sociale" },
        { name: "ice", label: "ICE" },
        { name: "contact", label: "Contact" },
        { name: "telephone", label: "Téléphone" },
        { name: "ville", label: "Ville" },
      ]}
      fields={[
        { name: "raison_sociale", label: "Raison sociale", required: true },
        { name: "ice", label: "ICE" },
        { name: "contact", label: "Personne de contact" },
        { name: "telephone", label: "Téléphone" },
        { name: "email", label: "Email" },
        { name: "ville", label: "Ville" },
        { name: "adresse", label: "Adresse", type: "textarea" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  ),
});
