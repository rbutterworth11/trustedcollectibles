export type UserRole = "buyer" | "seller" | "admin";

export type ListingStatus =
  | "draft"
  | "pending_verification"
  | "verified"
  | "listed"
  | "sold"
  | "disputed";

export type OrderStatus =
  | "pending"
  | "payment_held"
  | "shipped"
  | "delivered"
  | "completed"
  | "refunded"
  | "disputed";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  stripe_account_id: string | null;
  stripe_onboarded: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sport: string;
  player: string;
  year: string | null;
  condition: string;
  authentication_details: string | null;
  images: string[];
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  platform_fee: number;
  stripe_payment_intent_id: string | null;
  status: OrderStatus;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}
