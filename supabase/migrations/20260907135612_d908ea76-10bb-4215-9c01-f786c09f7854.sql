-- Appels d'offres
CREATE TABLE public.appels_offres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  objet text NOT NULL,
  maitre_ouvrage text,
  date_publication date,
  date_limite date,
  caution numeric NOT NULL DEFAULT 0,
  montant_estime numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'preparation',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Achats
CREATE TABLE public.bons_commande (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  date_bc date NOT NULL DEFAULT CURRENT_DATE,
  statut text NOT NULL DEFAULT 'brouillon',
  total_ht numeric NOT NULL DEFAULT 0,
  total_tva numeric NOT NULL DEFAULT 0,
  total_ttc numeric NOT NULL DEFAULT 0,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bons_commande_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bon_commande_id uuid NOT NULL REFERENCES public.bons_commande(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  designation text NOT NULL,
  unite text NOT NULL DEFAULT 'U',
  quantite numeric NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  tva numeric NOT NULL DEFAULT 20,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bons_reception (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  bon_commande_id uuid REFERENCES public.bons_commande(id) ON DELETE SET NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  date_br date NOT NULL DEFAULT CURRENT_DATE,
  statut text NOT NULL DEFAULT 'recu',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bons_reception_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bon_reception_id uuid NOT NULL REFERENCES public.bons_reception(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  designation text NOT NULL,
  unite text NOT NULL DEFAULT 'U',
  quantite numeric NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.factures_achat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  bon_reception_id uuid REFERENCES public.bons_reception(id) ON DELETE SET NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  date_facture date NOT NULL DEFAULT CURRENT_DATE,
  date_echeance date,
  total_ht numeric NOT NULL DEFAULT 0,
  total_tva numeric NOT NULL DEFAULT 0,
  total_ttc numeric NOT NULL DEFAULT 0,
  montant_paye numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'impayee',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projets / ventes
CREATE TABLE public.bons_livraison (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  date_bl date NOT NULL DEFAULT CURRENT_DATE,
  statut text NOT NULL DEFAULT 'livre',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bons_livraison_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bon_livraison_id uuid NOT NULL REFERENCES public.bons_livraison(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  designation text NOT NULL,
  unite text NOT NULL DEFAULT 'U',
  quantite numeric NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.attachements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  date_attachement date NOT NULL DEFAULT CURRENT_DATE,
  periode text,
  montant_ht numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'brouillon',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.attachements_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attachement_id uuid NOT NULL REFERENCES public.attachements(id) ON DELETE CASCADE,
  designation text NOT NULL,
  unite text NOT NULL DEFAULT 'U',
  quantite numeric NOT NULL DEFAULT 0,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.decomptes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  attachement_id uuid REFERENCES public.attachements(id) ON DELETE SET NULL,
  numero_ordre integer NOT NULL DEFAULT 1,
  date_decompte date NOT NULL DEFAULT CURRENT_DATE,
  montant_travaux numeric NOT NULL DEFAULT 0,
  retenue_garantie numeric NOT NULL DEFAULT 0,
  avance numeric NOT NULL DEFAULT 0,
  montant_net numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'brouillon',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.factures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE SET NULL,
  devis_id uuid REFERENCES public.devis(id) ON DELETE SET NULL,
  decompte_id uuid REFERENCES public.decomptes(id) ON DELETE SET NULL,
  objet text,
  date_facture date NOT NULL DEFAULT CURRENT_DATE,
  date_echeance date,
  total_ht numeric NOT NULL DEFAULT 0,
  total_tva numeric NOT NULL DEFAULT 0,
  total_ttc numeric NOT NULL DEFAULT 0,
  montant_paye numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'impayee',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.factures_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facture_id uuid NOT NULL REFERENCES public.factures(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  designation text NOT NULL,
  unite text NOT NULL DEFAULT 'U',
  quantite numeric NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  tva numeric NOT NULL DEFAULT 20,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Finances
CREATE TABLE public.reglements_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  facture_id uuid REFERENCES public.factures(id) ON DELETE SET NULL,
  date_reglement date NOT NULL DEFAULT CURRENT_DATE,
  montant numeric NOT NULL DEFAULT 0,
  mode text NOT NULL DEFAULT 'especes',
  reference text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reglements_fournisseurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  facture_achat_id uuid REFERENCES public.factures_achat(id) ON DELETE SET NULL,
  date_reglement date NOT NULL DEFAULT CURRENT_DATE,
  montant numeric NOT NULL DEFAULT 0,
  mode text NOT NULL DEFAULT 'especes',
  reference text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.caisse (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_operation date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL DEFAULT 'entree',
  libelle text NOT NULL,
  montant numeric NOT NULL DEFAULT 0,
  mode text NOT NULL DEFAULT 'especes',
  reference text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ventes_comptoir (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  client_nom text,
  date_vente date NOT NULL DEFAULT CURRENT_DATE,
  total_ht numeric NOT NULL DEFAULT 0,
  total_tva numeric NOT NULL DEFAULT 0,
  total_ttc numeric NOT NULL DEFAULT 0,
  mode_paiement text NOT NULL DEFAULT 'especes',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ventes_comptoir_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vente_id uuid NOT NULL REFERENCES public.ventes_comptoir(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  designation text NOT NULL,
  unite text NOT NULL DEFAULT 'U',
  quantite numeric NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  tva numeric NOT NULL DEFAULT 20,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'appels_offres','bons_commande','bons_commande_lignes','bons_reception','bons_reception_lignes',
    'factures_achat','bons_livraison','bons_livraison_lignes','attachements','attachements_lignes',
    'decomptes','factures','factures_lignes','reglements_clients','reglements_fournisseurs',
    'caisse','ventes_comptoir','ventes_comptoir_lignes'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.is_staff(auth.uid()))', t || '_select', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()))', t || '_write', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'trg_' || t || '_updated', t);
  END LOOP;
END $$;

CREATE UNIQUE INDEX appels_offres_numero_key ON public.appels_offres(numero);
CREATE UNIQUE INDEX bons_commande_numero_key ON public.bons_commande(numero);
CREATE UNIQUE INDEX bons_reception_numero_key ON public.bons_reception(numero);
CREATE UNIQUE INDEX factures_achat_numero_key ON public.factures_achat(numero);
CREATE UNIQUE INDEX bons_livraison_numero_key ON public.bons_livraison(numero);
CREATE UNIQUE INDEX attachements_numero_key ON public.attachements(numero);
CREATE UNIQUE INDEX decomptes_numero_key ON public.decomptes(numero);
CREATE UNIQUE INDEX factures_numero_key ON public.factures(numero);
CREATE UNIQUE INDEX ventes_comptoir_numero_key ON public.ventes_comptoir(numero);