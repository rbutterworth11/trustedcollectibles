export const SPORTS = [
  "Baseball",
  "Basketball",
  "Boxing",
  "Cricket",
  "Football (American)",
  "Football (Soccer)",
  "Golf",
  "Hockey",
  "MMA/UFC",
  "Motorsport",
  "Rugby",
  "Tennis",
  "Track & Field",
  "Wrestling",
  "Other",
] as const;

export const ITEM_TYPES = [
  "Signed Jersey",
  "Signed Ball",
  "Signed Photo",
  "Signed Card",
  "Signed Bat/Stick",
  "Signed Glove",
  "Signed Helmet",
  "Signed Boots/Cleats",
  "Signed Program/Magazine",
  "Game-Worn Item",
  "Trophy/Medal",
  "Ticket Stub",
  "Other Memorabilia",
] as const;

export const CONDITIONS = [
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
] as const;

export const COA_SOURCES = [
  "PSA",
  "JSA (James Spence Authentication)",
  "Beckett Authentication",
  "SGC",
  "Fanatics",
  "Upper Deck Authenticated",
  "Steiner Sports",
  "Mounted Memories",
  "Tristar Productions",
  "GTSM (Global Trading Sports Marketing)",
  "Seller Self-Authenticated",
  "Other",
] as const;

export const PLATFORM_COMMISSION_RATE = 0.10; // 10%
export const STRIPE_PROCESSING_RATE = 0.029; // 2.9%
export const STRIPE_FIXED_FEE = 30; // 30 cents
