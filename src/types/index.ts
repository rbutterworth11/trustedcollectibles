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
  coa_source: string | null;
  coa_certificate_number: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  flagged: boolean;
  flag_reason: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export type ReviewAction =
  | "approved"
  | "rejected"
  | "request_photos"
  | "flagged"
  | "unflagged";

export interface ListingReview {
  id: string;
  listing_id: string;
  reviewer_id: string;
  action: ReviewAction;
  reason: string | null;
  created_at: string;
}

export interface ListingWithSeller extends Listing {
  seller: Profile;
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

export type OfferStatus = "pending" | "accepted" | "declined" | "expired" | "withdrawn";

export interface Offer {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: OfferStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferWithDetails extends Offer {
  listing: Listing;
  buyer: Profile;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing: Listing;
}

export interface FollowedSeller {
  id: string;
  follower_id: string;
  seller_id: string;
  created_at: string;
  seller: Profile;
}

export interface SellerReview {
  id: string;
  order_id: string;
  reviewer_id: string;
  seller_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: Profile;
}

export interface OrderWithListing extends Order {
  listing: Listing;
}

export interface OrderWithDetails extends Order {
  listing: Listing;
  buyer: Profile;
  seller: Profile;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export type NotificationType =
  | "offer_received"
  | "offer_accepted"
  | "offer_declined"
  | "offer_withdrawn"
  | "order_paid"
  | "order_shipped"
  | "order_delivered"
  | "order_completed"
  | "review_received"
  | "listing_approved"
  | "listing_rejected"
  | "new_message";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

// Form state for the create listing wizard
export interface ListingFormData {
  // Step 1: Photos
  mainPhoto: string;
  signaturePhoto: string;
  additionalPhotos: string[];

  // Step 2: Item details
  title: string;
  description: string;
  sport: string;
  category: string;
  player: string;
  team: string;
  year: string;
  condition: string;

  // Step 3: COA
  coaFront: string;
  coaBack: string;
  coaHologram: string;
  coaSource: string;
  coaCertificateNumber: string;

  // Step 4: Pricing
  price: string;
  acceptOffers: boolean;
  minimumOffer: string;
}
