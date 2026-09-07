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
