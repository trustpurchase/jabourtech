export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appels_offres: {
        Row: {
          caution: number
          created_at: string
          created_by: string | null
          date_limite: string | null
          date_publication: string | null
          id: string
          maitre_ouvrage: string | null
          montant_estime: number
          notes: string | null
          numero: string
          objet: string
          statut: string
          updated_at: string
        }
        Insert: {
          caution?: number
          created_at?: string
          created_by?: string | null
          date_limite?: string | null
          date_publication?: string | null
          id?: string
          maitre_ouvrage?: string | null
          montant_estime?: number
          notes?: string | null
          numero: string
          objet: string
          statut?: string
          updated_at?: string
        }
        Update: {
          caution?: number
          created_at?: string
          created_by?: string | null
          date_limite?: string | null
          date_publication?: string | null
          id?: string
          maitre_ouvrage?: string | null
          montant_estime?: number
          notes?: string | null
          numero?: string
          objet?: string
          statut?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          created_at: string
          designation: string
          famille: string | null
          id: string
          prix_achat: number
          prix_vente: number
          reference: string
          stock_actuel: number
          stock_alerte: number
          tva: number
          unite: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation: string
          famille?: string | null
          id?: string
          prix_achat?: number
          prix_vente?: number
          reference: string
          stock_actuel?: number
          stock_alerte?: number
          tva?: number
          unite?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string
          famille?: string | null
          id?: string
          prix_achat?: number
          prix_vente?: number
          reference?: string
          stock_actuel?: number
          stock_alerte?: number
          tva?: number
          unite?: string
          updated_at?: string
        }
        Relationships: []
      }
      attachements: {
        Row: {
          created_at: string
          created_by: string | null
          date_attachement: string
          id: string
          montant_ht: number
          notes: string | null
          numero: string
          periode: string | null
          projet_id: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_attachement?: string
          id?: string
          montant_ht?: number
          notes?: string | null
          numero: string
          periode?: string | null
          projet_id?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_attachement?: string
          id?: string
          montant_ht?: number
          notes?: string | null
          numero?: string
          periode?: string | null
          projet_id?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachements_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      attachements_lignes: {
        Row: {
          attachement_id: string
          created_at: string
          designation: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          unite: string
          updated_at: string
        }
        Insert: {
          attachement_id: string
          created_at?: string
          designation: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          unite?: string
          updated_at?: string
        }
        Update: {
          attachement_id?: string
          created_at?: string
          designation?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          unite?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachements_lignes_attachement_id_fkey"
            columns: ["attachement_id"]
            isOneToOne: false
            referencedRelation: "attachements"
            referencedColumns: ["id"]
          },
        ]
      }
      attendances: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          distance_meters: number | null
          employee_id: string
          id: string
          project_id: string
          scanned_latitude: number | null
          scanned_longitude: number | null
          timestamp: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          distance_meters?: number | null
          employee_id: string
          id?: string
          project_id: string
          scanned_latitude?: number | null
          scanned_longitude?: number | null
          timestamp?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          distance_meters?: number | null
          employee_id?: string
          id?: string
          project_id?: string
          scanned_latitude?: number | null
          scanned_longitude?: number | null
          timestamp?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_commande: {
        Row: {
          created_at: string
          created_by: string | null
          date_bc: string
          fournisseur_id: string | null
          id: string
          notes: string | null
          numero: string
          projet_id: string | null
          statut: string
          total_ht: number
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_bc?: string
          fournisseur_id?: string | null
          id?: string
          notes?: string | null
          numero: string
          projet_id?: string | null
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_bc?: string
          fournisseur_id?: string | null
          id?: string
          notes?: string | null
          numero?: string
          projet_id?: string | null
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_commande_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_commande_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_commande_lignes: {
        Row: {
          article_id: string | null
          bon_commande_id: string
          created_at: string
          designation: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          tva: number
          unite: string
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          bon_commande_id: string
          created_at?: string
          designation: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          bon_commande_id?: string
          created_at?: string
          designation?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_commande_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_commande_lignes_bon_commande_id_fkey"
            columns: ["bon_commande_id"]
            isOneToOne: false
            referencedRelation: "bons_commande"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_livraison: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          date_bl: string
          id: string
          notes: string | null
          numero: string
          projet_id: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_bl?: string
          id?: string
          notes?: string | null
          numero: string
          projet_id?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_bl?: string
          id?: string
          notes?: string | null
          numero?: string
          projet_id?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_livraison_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_livraison_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_livraison_lignes: {
        Row: {
          article_id: string | null
          bon_livraison_id: string
          created_at: string
          designation: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          unite: string
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          bon_livraison_id: string
          created_at?: string
          designation: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          unite?: string
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          bon_livraison_id?: string
          created_at?: string
          designation?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          unite?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_livraison_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_livraison_lignes_bon_livraison_id_fkey"
            columns: ["bon_livraison_id"]
            isOneToOne: false
            referencedRelation: "bons_livraison"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_reception: {
        Row: {
          bon_commande_id: string | null
          created_at: string
          created_by: string | null
          date_br: string
          fournisseur_id: string | null
          id: string
          notes: string | null
          numero: string
          projet_id: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          bon_commande_id?: string | null
          created_at?: string
          created_by?: string | null
          date_br?: string
          fournisseur_id?: string | null
          id?: string
          notes?: string | null
          numero: string
          projet_id?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          bon_commande_id?: string | null
          created_at?: string
          created_by?: string | null
          date_br?: string
          fournisseur_id?: string | null
          id?: string
          notes?: string | null
          numero?: string
          projet_id?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_reception_bon_commande_id_fkey"
            columns: ["bon_commande_id"]
            isOneToOne: false
            referencedRelation: "bons_commande"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_reception_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_reception_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_reception_lignes: {
        Row: {
          article_id: string | null
          bon_reception_id: string
          created_at: string
          designation: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          unite: string
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          bon_reception_id: string
          created_at?: string
          designation: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          unite?: string
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          bon_reception_id?: string
          created_at?: string
          designation?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          unite?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_reception_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_reception_lignes_bon_reception_id_fkey"
            columns: ["bon_reception_id"]
            isOneToOne: false
            referencedRelation: "bons_reception"
            referencedColumns: ["id"]
          },
        ]
      }
      caisse: {
        Row: {
          created_at: string
          created_by: string | null
          date_operation: string
          id: string
          libelle: string
          mode: string
          montant: number
          reference: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_operation?: string
          id?: string
          libelle: string
          mode?: string
          montant?: number
          reference?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_operation?: string
          id?: string
          libelle?: string
          mode?: string
          montant?: number
          reference?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string | null
          contact: string | null
          created_at: string
          created_by: string | null
          email: string | null
          ice: string | null
          id: string
          notes: string | null
          raison_sociale: string
          telephone: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          notes?: string | null
          raison_sociale: string
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          notes?: string | null
          raison_sociale?: string
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      decomptes: {
        Row: {
          attachement_id: string | null
          avance: number
          created_at: string
          created_by: string | null
          date_decompte: string
          id: string
          montant_net: number
          montant_travaux: number
          notes: string | null
          numero: string
          numero_ordre: number
          projet_id: string | null
          retenue_garantie: number
          statut: string
          updated_at: string
        }
        Insert: {
          attachement_id?: string | null
          avance?: number
          created_at?: string
          created_by?: string | null
          date_decompte?: string
          id?: string
          montant_net?: number
          montant_travaux?: number
          notes?: string | null
          numero: string
          numero_ordre?: number
          projet_id?: string | null
          retenue_garantie?: number
          statut?: string
          updated_at?: string
        }
        Update: {
          attachement_id?: string | null
          avance?: number
          created_at?: string
          created_by?: string | null
          date_decompte?: string
          id?: string
          montant_net?: number
          montant_travaux?: number
          notes?: string | null
          numero?: string
          numero_ordre?: number
          projet_id?: string | null
          retenue_garantie?: number
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "decomptes_attachement_id_fkey"
            columns: ["attachement_id"]
            isOneToOne: false
            referencedRelation: "attachements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decomptes_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      devis: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          date_devis: string
          date_validite: string | null
          id: string
          notes: string | null
          numero: string
          objet: string | null
          projet_id: string | null
          remise: number
          statut: string
          total_ht: number
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_devis?: string
          date_validite?: string | null
          id?: string
          notes?: string | null
          numero: string
          objet?: string | null
          projet_id?: string | null
          remise?: number
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_devis?: string
          date_validite?: string | null
          id?: string
          notes?: string | null
          numero?: string
          objet?: string | null
          projet_id?: string | null
          remise?: number
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      devis_lignes: {
        Row: {
          article_id: string | null
          created_at: string
          designation: string
          devis_id: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          tva: number
          unite: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          designation: string
          devis_id: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          designation?: string
          devis_id?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
        }
        Relationships: [
          {
            foreignKeyName: "devis_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_lignes_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          date_echeance: string | null
          date_facture: string
          decompte_id: string | null
          devis_id: string | null
          id: string
          montant_paye: number
          notes: string | null
          numero: string
          objet: string | null
          projet_id: string | null
          statut: string
          total_ht: number
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_echeance?: string | null
          date_facture?: string
          decompte_id?: string | null
          devis_id?: string | null
          id?: string
          montant_paye?: number
          notes?: string | null
          numero: string
          objet?: string | null
          projet_id?: string | null
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_echeance?: string | null
          date_facture?: string
          decompte_id?: string | null
          devis_id?: string | null
          id?: string
          montant_paye?: number
          notes?: string | null
          numero?: string
          objet?: string | null
          projet_id?: string | null
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_decompte_id_fkey"
            columns: ["decompte_id"]
            isOneToOne: false
            referencedRelation: "decomptes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      factures_achat: {
        Row: {
          bon_reception_id: string | null
          created_at: string
          created_by: string | null
          date_echeance: string | null
          date_facture: string
          fournisseur_id: string | null
          id: string
          montant_paye: number
          notes: string | null
          numero: string
          projet_id: string | null
          statut: string
          total_ht: number
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          bon_reception_id?: string | null
          created_at?: string
          created_by?: string | null
          date_echeance?: string | null
          date_facture?: string
          fournisseur_id?: string | null
          id?: string
          montant_paye?: number
          notes?: string | null
          numero: string
          projet_id?: string | null
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Update: {
          bon_reception_id?: string | null
          created_at?: string
          created_by?: string | null
          date_echeance?: string | null
          date_facture?: string
          fournisseur_id?: string | null
          id?: string
          montant_paye?: number
          notes?: string | null
          numero?: string
          projet_id?: string | null
          statut?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_achat_bon_reception_id_fkey"
            columns: ["bon_reception_id"]
            isOneToOne: false
            referencedRelation: "bons_reception"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_achat_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_achat_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      factures_lignes: {
        Row: {
          article_id: string | null
          created_at: string
          designation: string
          facture_id: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          tva: number
          unite: string
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          designation: string
          facture_id: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          designation?: string
          facture_id?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_lignes_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      fournisseurs: {
        Row: {
          adresse: string | null
          contact: string | null
          created_at: string
          created_by: string | null
          email: string | null
          ice: string | null
          id: string
          notes: string | null
          raison_sociale: string
          telephone: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          notes?: string | null
          raison_sociale: string
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          notes?: string | null
          raison_sociale?: string
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          poste: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          poste?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          poste?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projets: {
        Row: {
          adresse: string | null
          avancement: number
          client_id: string | null
          code: string
          created_at: string
          date_debut: string | null
          date_fin_prevue: string | null
          id: string
          intitule: string
          latitude: number | null
          longitude: number | null
          maitre_ouvrage: string | null
          montant_marche: number
          qr_secret_key: string
          radius_meters: number
          statut: string
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          avancement?: number
          client_id?: string | null
          code: string
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          id?: string
          intitule: string
          latitude?: number | null
          longitude?: number | null
          maitre_ouvrage?: string | null
          montant_marche?: number
          qr_secret_key?: string
          radius_meters?: number
          statut?: string
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          avancement?: number
          client_id?: string | null
          code?: string
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          id?: string
          intitule?: string
          latitude?: number | null
          longitude?: number | null
          maitre_ouvrage?: string | null
          montant_marche?: number
          qr_secret_key?: string
          radius_meters?: number
          statut?: string
          updated_at?: string
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          project_id: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          project_id: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          project_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      reglements_clients: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          date_reglement: string
          facture_id: string | null
          id: string
          mode: string
          montant: number
          notes: string | null
          reference: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_reglement?: string
          facture_id?: string | null
          id?: string
          mode?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_reglement?: string
          facture_id?: string | null
          id?: string
          mode?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reglements_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_clients_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      reglements_fournisseurs: {
        Row: {
          created_at: string
          created_by: string | null
          date_reglement: string
          facture_achat_id: string | null
          fournisseur_id: string | null
          id: string
          mode: string
          montant: number
          notes: string | null
          reference: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_reglement?: string
          facture_achat_id?: string | null
          fournisseur_id?: string | null
          id?: string
          mode?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_reglement?: string
          facture_achat_id?: string | null
          fournisseur_id?: string | null
          id?: string
          mode?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reglements_fournisseurs_facture_achat_id_fkey"
            columns: ["facture_achat_id"]
            isOneToOne: false
            referencedRelation: "factures_achat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_fournisseurs_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devices: {
        Row: {
          created_at: string
          device_fingerprint: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      ventes_comptoir: {
        Row: {
          client_id: string | null
          client_nom: string | null
          created_at: string
          created_by: string | null
          date_vente: string
          id: string
          mode_paiement: string
          notes: string | null
          numero: string
          total_ht: number
          total_ttc: number
          total_tva: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_nom?: string | null
          created_at?: string
          created_by?: string | null
          date_vente?: string
          id?: string
          mode_paiement?: string
          notes?: string | null
          numero: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_nom?: string | null
          created_at?: string
          created_by?: string | null
          date_vente?: string
          id?: string
          mode_paiement?: string
          notes?: string | null
          numero?: string
          total_ht?: number
          total_ttc?: number
          total_tva?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ventes_comptoir_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ventes_comptoir_lignes: {
        Row: {
          article_id: string | null
          created_at: string
          designation: string
          id: string
          ordre: number
          prix_unitaire: number
          quantite: number
          tva: number
          unite: string
          updated_at: string
          vente_id: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          designation: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
          updated_at?: string
          vente_id: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          designation?: string
          id?: string
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          tva?: number
          unite?: string
          updated_at?: string
          vente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ventes_comptoir_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventes_comptoir_lignes_vente_id_fkey"
            columns: ["vente_id"]
            isOneToOne: false
            referencedRelation: "ventes_comptoir"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "gestionnaire" | "achat" | "comptable" | "ouvrier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gestionnaire", "achat", "comptable", "ouvrier"],
    },
  },
} as const
