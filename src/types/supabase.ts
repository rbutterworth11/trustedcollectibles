export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "buyer" | "seller" | "admin";
          stripe_account_id: string | null;
          stripe_onboarded: boolean;
          shipping_address: Record<string, string> | null;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          role?: "buyer" | "seller" | "admin";
          stripe_account_id?: string | null;
          stripe_onboarded?: boolean;
          shipping_address?: Record<string, string> | null;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: "buyer" | "seller" | "admin";
          stripe_account_id?: string | null;
          stripe_onboarded?: boolean;
          shipping_address?: Record<string, string> | null;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          accept_offers: boolean;
          minimum_offer: number | null;
          category: string;
          sport: string;
          player: string;
          team: string;
          year: string | null;
          condition: string;
          images: string[];
          signature_photo: string | null;
          coa_front: string | null;
          coa_back: string | null;
          coa_hologram: string | null;
          condition_photos: Array<{ url: string; label: string }> | null;
          bumped_at: string | null;
          bump_count: number;
          confidence_score: number | null;
          confidence_factors: string[];
          coa_source: string | null;
          coa_certificate_number: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          admin_notes: string | null;
          flagged: boolean;
          flag_reason: string | null;
          status:
            | "draft"
            | "pending_verification"
            | "verified"
            | "listed"
            | "sold"
            | "disputed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description?: string;
          price: number;
          accept_offers?: boolean;
          minimum_offer?: number | null;
          category: string;
          sport: string;
          player?: string;
          team?: string;
          year?: string | null;
          condition: string;
          images?: string[];
          signature_photo?: string | null;
          coa_front?: string | null;
          coa_back?: string | null;
          coa_hologram?: string | null;
          coa_source?: string | null;
          coa_certificate_number?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          admin_notes?: string | null;
          flagged?: boolean;
          flag_reason?: string | null;
          status?:
            | "draft"
            | "pending_verification"
            | "verified"
            | "listed"
            | "sold"
            | "disputed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          title?: string;
          description?: string;
          price?: number;
          accept_offers?: boolean;
          minimum_offer?: number | null;
          category?: string;
          sport?: string;
          player?: string;
          team?: string;
          year?: string | null;
          condition?: string;
          images?: string[];
          signature_photo?: string | null;
          coa_front?: string | null;
          coa_back?: string | null;
          coa_hologram?: string | null;
          coa_source?: string | null;
          coa_certificate_number?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          admin_notes?: string | null;
          flagged?: boolean;
          flag_reason?: string | null;
          condition_photos?: Array<{ url: string; label: string }> | null;
          bumped_at?: string | null;
          bump_count?: number;
          confidence_score?: number | null;
          confidence_factors?: string[];
          status?:
            | "draft"
            | "pending_verification"
            | "verified"
            | "listed"
            | "sold"
            | "disputed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      listing_reviews: {
        Row: {
          id: string;
          listing_id: string;
          reviewer_id: string;
          action: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          reviewer_id: string;
          action: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          reviewer_id?: string;
          action?: string;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listing_reviews_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listing_reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          amount: number;
          platform_fee: number;
          stripe_payment_intent_id: string | null;
          status:
            | "pending"
            | "payment_held"
            | "shipped"
            | "delivered"
            | "completed"
            | "refunded"
            | "disputed";
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          amount: number;
          platform_fee?: number;
          stripe_payment_intent_id?: string | null;
          status?:
            | "pending"
            | "payment_held"
            | "shipped"
            | "delivered"
            | "completed"
            | "refunded"
            | "disputed";
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          amount?: number;
          platform_fee?: number;
          stripe_payment_intent_id?: string | null;
          status?:
            | "pending"
            | "payment_held"
            | "shipped"
            | "delivered"
            | "completed"
            | "refunded"
            | "disputed";
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          amount: number;
          status: "pending" | "accepted" | "declined" | "expired" | "withdrawn";
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          amount: number;
          status?: "pending" | "accepted" | "declined" | "expired" | "withdrawn";
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          amount?: number;
          status?: "pending" | "accepted" | "declined" | "expired" | "withdrawn";
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "offers_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      followed_sellers: {
        Row: {
          id: string;
          follower_id: string;
          seller_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          seller_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          seller_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "followed_sellers_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "followed_sellers_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      seller_reviews: {
        Row: {
          id: string;
          order_id: string;
          reviewer_id: string;
          seller_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          reviewer_id: string;
          seller_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          reviewer_id?: string;
          seller_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seller_reviews_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: true;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seller_reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seller_reviews_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          read: boolean;
          data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          link?: string | null;
          read?: boolean;
          data?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          link?: string | null;
          read?: boolean;
          data?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      content_pages: {
        Row: {
          slug: string;
          title: string;
          content: string;
          meta_description: string | null;
          updated_at: string;
        };
        Insert: {
          slug: string;
          title: string;
          content?: string;
          meta_description?: string | null;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          content?: string;
          meta_description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      managed_categories: {
        Row: {
          id: string;
          type: "sport" | "item_type" | "condition" | "coa_source";
          name: string;
          image_url: string | null;
          enabled: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: "sport" | "item_type" | "condition" | "coa_source";
          name: string;
          image_url?: string | null;
          enabled?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: "sport" | "item_type";
          name?: string;
          image_url?: string | null;
          enabled?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          key: string;
          value: Record<string, unknown>;
          enabled: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Record<string, unknown>;
          enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Record<string, unknown>;
          enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      staff_picks: {
        Row: {
          id: string;
          listing_id: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_picks_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: true;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          filters: Record<string, string>;
          notify: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          filters?: Record<string, string>;
          notify?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          filters?: Record<string, string>;
          notify?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      auth_requests: {
        Row: {
          id: string;
          user_id: string;
          tier: "standard" | "premium";
          status: "pending_payment" | "paid" | "in_review" | "completed";
          sport: string;
          item_type: string;
          details: string | null;
          item_photos: string[];
          coa_photos: string[];
          verdict: "authentic" | "likely_authentic" | "inconclusive" | "likely_not_authentic" | null;
          reviewer_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          stripe_session_id: string | null;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier: "standard" | "premium";
          status?: "pending_payment" | "paid" | "in_review" | "completed";
          sport: string;
          item_type: string;
          details?: string | null;
          item_photos?: string[];
          coa_photos?: string[];
          verdict?: string | null;
          reviewer_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          stripe_session_id?: string | null;
          amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: "standard" | "premium";
          status?: "pending_payment" | "paid" | "in_review" | "completed";
          sport?: string;
          item_type?: string;
          details?: string | null;
          item_photos?: string[];
          coa_photos?: string[];
          verdict?: string | null;
          reviewer_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          stripe_session_id?: string | null;
          amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "auth_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trending_profiles: {
        Row: {
          id: string;
          name: string;
          image_url: string | null;
          filter_type: "player" | "team";
          sort_order: number;
          enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image_url?: string | null;
          filter_type?: "player" | "team";
          sort_order?: number;
          enabled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image_url?: string | null;
          filter_type?: "player" | "team";
          sort_order?: number;
          enabled?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "buyer" | "seller" | "admin";
      listing_status:
        | "draft"
        | "pending_verification"
        | "verified"
        | "listed"
        | "sold"
        | "disputed";
      order_status:
        | "pending"
        | "payment_held"
        | "shipped"
        | "delivered"
        | "completed"
        | "refunded"
        | "disputed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
