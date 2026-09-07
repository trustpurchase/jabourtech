import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";

export const Route = createFileRoute("/_authenticated/clients")({
  head: () => ({
    meta: [
      { title: "Clients — BTP Gestion" },
      { name: "description", content: "Fichier clients : raison sociale, ICE, contacts et villes." },
      { property: "og:title", content: "Clients — BTP Gestion" },
      { property: "og:description", content: "Gérez votre fichier clients et leurs coordonnées." },
    ],
  }),
  component: () => (
    <CrudPage
      table="clients"
      title="Clients"
      subtitle="Fichier clients et coordonnées de facturation."
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
