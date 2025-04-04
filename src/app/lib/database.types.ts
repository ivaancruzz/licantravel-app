export type Json = any;

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          is_active: boolean;
          last_name: string;
          profile_type: Database['public']['Enums']['profile_types'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          is_active?: boolean;
          last_name: string;
          profile_type: Database['public']['Enums']['profile_types'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          is_active?: boolean;
          last_name?: string;
          profile_type?: Database['public']['Enums']['profile_types'];
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          icon: string;
          id: string;
          is_visible: boolean;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon: string;
          id?: string;
          is_visible?: boolean;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon?: string;
          id?: string;
          is_visible?: boolean;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          birthday: string | null;
          created_at: string;
          document: string | null;
          email: string;
          first_name: string;
          gender: Database['public']['Enums']['genders'] | null;
          id: string;
          is_active: boolean;
          is_deleted: boolean;
          last_name: string;
          nationality: string | null;
          phone: string | null;
          user_id: string | null;
        };
        Insert: {
          birthday?: string | null;
          created_at?: string;
          document?: string | null;
          email: string;
          first_name: string;
          gender?: Database['public']['Enums']['genders'] | null;
          id?: string;
          is_active?: boolean;
          is_deleted?: boolean;
          last_name: string;
          nationality?: string | null;
          phone?: string | null;
          user_id?: string | null;
        };
        Update: {
          birthday?: string | null;
          created_at?: string;
          document?: string | null;
          email?: string;
          first_name?: string;
          gender?: Database['public']['Enums']['genders'] | null;
          id?: string;
          is_active?: boolean;
          is_deleted?: boolean;
          last_name?: string;
          nationality?: string | null;
          phone?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category_id: string | null;
          created_at: string;
          description: string;
          id: string;
          is_deleted: boolean;
          is_feature: boolean;
          is_visible: boolean;
          name: string;
          price: number;
          price_off: number | null;
          product_multimedia: Json;
          provider_id: string;
          season: Database['public']['Enums']['seasons'] | null;
          slug: string | null;
          state: Database['public']['Enums']['product_state'] | null;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          description: string;
          id: string;
          is_deleted?: boolean;
          is_feature: boolean;
          is_visible: boolean;
          name: string;
          price: number;
          price_off?: number | null;
          product_multimedia: Json;
          provider_id: string;
          season?: Database['public']['Enums']['seasons'] | null;
          slug?: string | null;
          state?: Database['public']['Enums']['product_state'] | null;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_deleted?: boolean;
          is_feature?: boolean;
          is_visible?: boolean;
          name?: string;
          price?: number;
          price_off?: number | null;
          product_multimedia?: Json;
          provider_id?: string;
          season?: Database['public']['Enums']['seasons'] | null;
          slug?: string | null;
          state?: Database['public']['Enums']['product_state'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'providers';
            referencedColumns: ['id'];
          },
        ];
      };
      providers: {
        Row: {
          address: string;
          commune: string;
          created_at: string;
          display_name: string;
          document: string | null;
          email: string;
          google_maps_link: string;
          id: string;
          is_active: boolean;
          is_deleted: boolean;
          open_days: Json;
          phone: string | null;
          region: string;
          user_id: string | null;
        };
        Insert: {
          address: string;
          commune: string;
          created_at?: string;
          display_name: string;
          document?: string | null;
          email: string;
          google_maps_link: string;
          id?: string;
          is_active?: boolean;
          is_deleted?: boolean;
          open_days: Json;
          phone?: string | null;
          region: string;
          user_id?: string | null;
        };
        Update: {
          address?: string;
          commune?: string;
          created_at?: string;
          display_name?: string;
          document?: string | null;
          email?: string;
          google_maps_link?: string;
          id?: string;
          is_active?: boolean;
          is_deleted?: boolean;
          open_days?: Json;
          phone?: string | null;
          region?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      sales: {
        Row: {
          client_id: string | null;
          created_at: string;
          created_by: string | null;
          creation_type: Database['public']['Enums']['sale_creation_types'];
          id: string;
          is_deleted: boolean;
          payment_method: Database['public']['Enums']['payment_methods'];
          payment_status: Database['public']['Enums']['payment_status'];
          products: Json;
          provider_id: string;
          sale_code: string;
          sale_date: string;
          total: number;
          transaction_id: string | null;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          creation_type?: Database['public']['Enums']['sale_creation_types'];
          id?: string;
          is_deleted?: boolean;
          payment_method: Database['public']['Enums']['payment_methods'];
          payment_status: Database['public']['Enums']['payment_status'];
          products: Json;
          provider_id: string;
          sale_code?: string;
          sale_date?: string;
          total: number;
          transaction_id?: string | null;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          creation_type?: Database['public']['Enums']['sale_creation_types'];
          id?: string;
          is_deleted?: boolean;
          payment_method?: Database['public']['Enums']['payment_methods'];
          payment_status?: Database['public']['Enums']['payment_status'];
          products?: Json;
          provider_id?: string;
          sale_code?: string;
          sale_date?: string;
          total?: number;
          transaction_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sales_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'providers';
            referencedColumns: ['id'];
          },
        ];
      };
      sales_products: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          sale_id: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity: number;
          sale_id: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          sale_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_products_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sales_products_sale_id_fkey';
            columns: ['sale_id'];
            isOneToOne: false;
            referencedRelation: 'sales';
            referencedColumns: ['id'];
          },
        ];
      };
      tickets: {
        Row: {
          client_id: string | null;
          code: string;
          created_at: string;
          date_use: string | null;
          id: string;
          product_id: string | null;
          provider_id: string | null;
          sale_id: string | null;
          status: Database['public']['Enums']['ticket_states'];
        };
        Insert: {
          client_id?: string | null;
          code?: string;
          created_at?: string;
          date_use?: string | null;
          id?: string;
          product_id?: string | null;
          provider_id?: string | null;
          sale_id?: string | null;
          status?: Database['public']['Enums']['ticket_states'];
        };
        Update: {
          client_id?: string | null;
          code?: string;
          created_at?: string;
          date_use?: string | null;
          id?: string;
          product_id?: string | null;
          provider_id?: string | null;
          sale_id?: string | null;
          status?: Database['public']['Enums']['ticket_states'];
        };
        Relationships: [
          {
            foreignKeyName: 'tickets_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'providers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_sale_id_fkey';
            columns: ['sale_id'];
            isOneToOne: false;
            referencedRelation: 'sales';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_default_user: {
        Args: {
          email: string;
          password: string;
        };
        Returns: undefined;
      };
      generate_auto_code: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_unique_slug: {
        Args: {
          base_text: string;
          table_name: string;
        };
        Returns: string;
      };
      insert_product_with_multimedia: {
        Args: {
          p_id?: string;
          category_id?: string;
          description?: string;
          is_feature?: boolean;
          is_visible?: boolean;
          price?: number;
          price_off?: number;
          provider_id?: string;
          season?: Database['public']['Enums']['seasons'];
          state?: Database['public']['Enums']['product_state'];
          p_name?: string;
          product_multimedia?: Json;
        };
        Returns: Json;
      };
      unaccent: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      unaccent_init: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
    };
    Enums: {
      file_types: 'image' | 'video';
      genders: 'male' | 'female' | 'other';
      payment_methods: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash';
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
      product_state: 'draft' | 'published';
      profile_types:
        | 'lican_superadmin'
        | 'lican_admin'
        | 'lican_provider'
        | 'authenticated';
      sale_creation_types: 'automatic' | 'manual';
      seasons: 'summer' | 'winter';
      ticket_states: 'pending' | 'active' | 'used' | 'expired' | 'canceled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
