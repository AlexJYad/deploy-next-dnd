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
      characters: {
        Row: {
          age: number | null
          armor_class: number
          avatar_url: string | null
          backstory: string | null
          charisma: number
          constitution: number
          copper: number
          current_hp: number
          current_mana: number
          dexterity: number
          electrum: number
          experience: number
          gold: number
          id: number
          intelligence: number
          inventory: Json
          level: number | null
          max_hp: number
          max_mana: number
          name: string | null
          notes: string | null
          platinum: number
          silver: number
          skills: Json
          strength: number
          user_id: number
          wisdom: number
        }
        Insert: {
          age?: number | null
          armor_class?: number
          avatar_url?: string | null
          backstory?: string | null
          charisma?: number
          constitution?: number
          copper?: number
          current_hp?: number
          current_mana?: number
          dexterity?: number
          electrum?: number
          experience?: number
          gold?: number
          id?: number
          intelligence?: number
          inventory?: Json
          level?: number | null
          max_hp?: number
          max_mana?: number
          name?: string | null
          notes?: string | null
          platinum?: number
          silver?: number
          skills?: Json
          strength?: number
          user_id: number
          wisdom?: number
        }
        Update: {
          age?: number | null
          armor_class?: number
          avatar_url?: string | null
          backstory?: string | null
          charisma?: number
          constitution?: number
          copper?: number
          current_hp?: number
          current_mana?: number
          dexterity?: number
          electrum?: number
          experience?: number
          gold?: number
          id?: number
          intelligence?: number
          inventory?: Json
          level?: number | null
          max_hp?: number
          max_mana?: number
          name?: string | null
          notes?: string | null
          platinum?: number
          silver?: number
          skills?: Json
          strength?: number
          user_id?: number
          wisdom?: number
        }
        Relationships: []
      }
      gods: {
        Row: {
          alignment: string
          category: string
          description: string
          id: string
          image_url: string | null
          min_role: string
          name: string
          order: number | null
          region: string | null
          title: string
        }
        Insert: {
          alignment: string
          category: string
          description: string
          id: string
          image_url?: string | null
          min_role?: string
          name: string
          order?: number | null
          region?: string | null
          title: string
        }
        Update: {
          alignment?: string
          category?: string
          description?: string
          id?: string
          image_url?: string | null
          min_role?: string
          name?: string
          order?: number | null
          region?: string | null
          title?: string
        }
        Relationships: []
      }
      map_markers: {
        Row: {
          icon_type: string | null
          id: string
          link: string | null
          map_id: string
          min_role: string | null
          target_map_id: string | null
          title: string
          x: number
          y: number
        }
        Insert: {
          icon_type?: string | null
          id?: string
          link?: string | null
          map_id: string
          min_role?: string | null
          target_map_id?: string | null
          title: string
          x: number
          y: number
        }
        Update: {
          icon_type?: string | null
          id?: string
          link?: string | null
          map_id?: string
          min_role?: string | null
          target_map_id?: string | null
          title?: string
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "map_markers_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_markers_target_map_id_fkey"
            columns: ["target_map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
        ]
      }
      maps: {
        Row: {
          height: number
          id: string
          image_url: string
          min_role: string | null
          parent_map_id: string | null
          title: string
          width: number
        }
        Insert: {
          height: number
          id?: string
          image_url: string
          min_role?: string | null
          parent_map_id?: string | null
          title: string
          width: number
        }
        Update: {
          height?: number
          id?: string
          image_url?: string
          min_role?: string | null
          parent_map_id?: string | null
          title?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "maps_parent_map_id_fkey"
            columns: ["parent_map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string | null
          password: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name?: string | null
          password: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string | null
          password?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
