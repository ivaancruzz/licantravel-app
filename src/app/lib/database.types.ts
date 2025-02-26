export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          profile_type: Database["public"]["Enums"]["profile_types"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          profile_type: Database["public"]["Enums"]["profile_types"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          profile_type?: Database["public"]["Enums"]["profile_types"]
          user_id?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_visible: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client: {
        Row: {
          birthday: string
          created_at: string
          document: string
          email: string
          first_name: string
          gender: Database["public"]["Enums"]["genders"]
          id: string
          is_active: boolean
          is_deleted: boolean
          last_name: string
          nationality: string
          phone: string | null
          user_id: string | null
        }
        Insert: {
          birthday: string
          created_at?: string
          document: string
          email: string
          first_name: string
          gender?: Database["public"]["Enums"]["genders"]
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          last_name: string
          nationality: string
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          birthday?: string
          created_at?: string
          document?: string
          email?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["genders"]
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          last_name?: string
          nationality?: string
          phone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_deleted: boolean
          is_feature: boolean | null
          is_visible: boolean
          price: number
          price_off: number | null
          provider_id: string | null
          season: Database["public"]["Enums"]["seasons"]
          state: Database["public"]["Enums"]["product_state"]
          title: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean
          is_feature?: boolean | null
          is_visible: boolean
          price: number
          price_off?: number | null
          provider_id?: string | null
          season: Database["public"]["Enums"]["seasons"]
          state?: Database["public"]["Enums"]["product_state"]
          title: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean
          is_feature?: boolean | null
          is_visible?: boolean
          price?: number
          price_off?: number | null
          provider_id?: string | null
          season?: Database["public"]["Enums"]["seasons"]
          state?: Database["public"]["Enums"]["product_state"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider"
            referencedColumns: ["id"]
          },
        ]
      }
      product_multimedia: {
        Row: {
          created_at: string
          file_type: Database["public"]["Enums"]["file_types"]
          file_url: string | null
          id: string
          order: number
          product_id: string
        }
        Insert: {
          created_at?: string
          file_type: Database["public"]["Enums"]["file_types"]
          file_url?: string | null
          id?: string
          order: number
          product_id: string
        }
        Update: {
          created_at?: string
          file_type?: Database["public"]["Enums"]["file_types"]
          file_url?: string | null
          id?: string
          order?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_multimedia_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      provider: {
        Row: {
          address: string
          commune: string
          created_at: string
          display_name: string
          document: string | null
          email: string
          google_maps_link: string
          id: string
          is_active: boolean
          is_deleted: boolean
          open_days: Json
          phone: string | null
          region: string
          user_id: string | null
        }
        Insert: {
          address: string
          commune: string
          created_at?: string
          display_name: string
          document?: string | null
          email: string
          google_maps_link: string
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          open_days: Json
          phone?: string | null
          region: string
          user_id?: string | null
        }
        Update: {
          address?: string
          commune?: string
          created_at?: string
          display_name?: string
          document?: string | null
          email?: string
          google_maps_link?: string
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          open_days?: Json
          phone?: string | null
          region?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sale: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          creation_type: Database["public"]["Enums"]["cration_type_sale"]
          id: string
          is_deleted: boolean
          payment_method: Database["public"]["Enums"]["payment_methods"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          products: Json
          sale_code: string
          sale_date: string
          total: number
          transaction_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          creation_type: Database["public"]["Enums"]["cration_type_sale"]
          id?: string
          is_deleted?: boolean
          payment_method: Database["public"]["Enums"]["payment_methods"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          products: Json
          sale_code?: string
          sale_date?: string
          total: number
          transaction_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          creation_type?: Database["public"]["Enums"]["cration_type_sale"]
          id?: string
          is_deleted?: boolean
          payment_method?: Database["public"]["Enums"]["payment_methods"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          products?: Json
          sale_code?: string
          sale_date?: string
          total?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_products: {
        Row: {
          id: string
          product_id: string | null
          quantity: number
          sale_id: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          quantity: number
          sale_id: string
        }
        Update: {
          id?: string
          product_id?: string | null
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_products_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sale"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket: {
        Row: {
          client_id: string
          code: string
          created_at: string
          date_use: string | null
          id: string
          product_id: string | null
          sale_id: string | null
          status: Database["public"]["Enums"]["ticket_state"]
          updated_at: string | null
        }
        Insert: {
          client_id: string
          code?: string
          created_at?: string
          date_use?: string | null
          id?: string
          product_id?: string | null
          sale_id?: string | null
          status?: Database["public"]["Enums"]["ticket_state"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          code?: string
          created_at?: string
          date_use?: string | null
          id?: string
          product_id?: string | null
          sale_id?: string | null
          status?: Database["public"]["Enums"]["ticket_state"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sale"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _create_default_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
      _delete_client: {
        Args: {
          p_client_id: string
        }
        Returns: undefined
      }
      _delete_product: {
        Args: {
          p_product_id: string
        }
        Returns: undefined
      }
      _delete_provider: {
        Args: {
          p_provider_id: string
        }
        Returns: undefined
      }
      _get_unique_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      cleanup_last_changed_pages: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      docs_search_embeddings: {
        Args: {
          embedding: string
          match_threshold: number
        }
        Returns: {
          id: number
          path: string
          type: string
          title: string
          subtitle: string
          description: string
          headings: string[]
          slugs: string[]
        }[]
      }
      docs_search_fts: {
        Args: {
          query: string
        }
        Returns: {
          id: number
          path: string
          type: string
          title: string
          subtitle: string
          description: string
        }[]
      }
      get_last_revalidation_for_tags: {
        Args: {
          tags: string[]
        }
        Returns: {
          tag: string
          created_at: string
        }[]
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      insert_product_with_multimedia: {
        Args: {
          p_id: string
          category_id?: string
          description?: string
          is_feature?: boolean
          is_visible?: boolean
          price?: number
          price_off?: number
          provider_id?: string
          season?: Database["public"]["Enums"]["seasons"]
          state?: Database["public"]["Enums"]["product_state"]
          title?: string
          product_multimedia?: Json
        }
        Returns: Json
      }
      ipv6_active_status: {
        Args: {
          project_ref: string
        }
        Returns: {
          pgbouncer_active: boolean
          vercel_active: boolean
        }[]
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      json_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: {
          schema: Json
        }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: string[]
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      update_last_changed_checksum: {
        Args: {
          new_parent_page: string
          new_heading: string
          new_checksum: string
          git_update_time: string
          check_time: string
        }
        Returns: string
      }
      update_product_with_multimedia: {
        Args: {
          p_product_id: string
          category_id?: string
          description?: string
          is_feature?: boolean
          is_visible?: boolean
          price?: number
          price_off?: number
          provider_id?: string
          season?: Database["public"]["Enums"]["seasons"]
          state?: Database["public"]["Enums"]["product_state"]
          title?: string
          product_multimedia?: Json
        }
        Returns: Json
      }
      validate_troubleshooting_errors: {
        Args: {
          errors: Json[]
        }
        Returns: boolean
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      cration_type_sale: "manual" | "automatic"
      feedback_vote: "yes" | "no"
      file_types: "image" | "video"
      genders: "male" | "female" | "other"
      payment_methods: "credit_card" | "debit_card" | "bank_transfer" | "cash"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      product_state: "0" | "1"
      profile_types:
        | "lican_superadmin"
        | "lican_admin"
        | "lican_provider"
        | "authenticated"
      seasons: "Invierno" | "Verano"
      ticket_state: "pending" | "active" | "used" | "expired" | "canceled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

