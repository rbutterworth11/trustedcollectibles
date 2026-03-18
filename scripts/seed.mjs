#!/usr/bin/env node
/**
 * Seed script — run with: node scripts/seed.mjs
 * Creates 4 seller profiles and 15 sample listings via Supabase JS client.
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

// Load .env.local manually
const envFile = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}
Object.assign(process.env, env);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SELLERS = [
  { id: randomUUID(), email: "james.mitchell@example.com", name: "James Mitchell" },
  { id: randomUUID(), email: "sarah.thompson@example.com", name: "Sarah Thompson" },
  { id: randomUUID(), email: "david.williams@example.com", name: "David Williams" },
  { id: randomUUID(), email: "emma.clarke@example.com", name: "Emma Clarke" },
];

async function createSellers() {
  for (const seller of SELLERS) {
    // Create auth user via admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: seller.email,
      password: "password123",
      email_confirm: true,
      user_metadata: { full_name: seller.name },
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        // User exists — look up their ID
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users?.users?.find((u) => u.email === seller.email);
        if (existing) {
          seller.id = existing.id;
          console.log(`  Seller exists: ${seller.name} (${existing.id})`);
        }
      } else {
        console.error(`  Error creating ${seller.name}:`, error.message);
        continue;
      }
    } else {
      seller.id = data.user.id;
      console.log(`  Created seller: ${seller.name} (${data.user.id})`);
    }

    // Set role to seller
    await supabase
      .from("profiles")
      .update({ role: "seller", full_name: seller.name })
      .eq("id", seller.id);
  }
}

const LISTINGS = [
  {
    sellerIdx: 0,
    title: "Wayne Rooney Signed Manchester United Shirt 2011",
    description: "Authentic Wayne Rooney signed Manchester United home shirt from the 2010/11 Premier League season. Signed in black marker on the front. This shirt was personally signed at a private signing event. Comes with a Certificate of Authenticity from Beckett Authentication.",
    price: 34999, category: "Signed Jersey", sport: "Football (Soccer)",
    player: "Wayne Rooney", team: "Manchester United", year: "2011", condition: "Excellent",
    images: ["https://picsum.photos/seed/rooney1/800/800", "https://picsum.photos/seed/rooney2/800/800", "https://picsum.photos/seed/rooney3/800/800"],
    accept_offers: true, minimum_offer: 25000,
    coa_source: "Beckett Authentication", coa_certificate_number: "BAS-WR-20110042",
  },
  {
    sellerIdx: 0,
    title: "Steven Gerrard Signed Liverpool FC Champions League Shirt 2005",
    description: "Iconic Steven Gerrard signed Liverpool home shirt from the unforgettable 2004/05 Champions League winning season. The shirt features Gerrard's signature in silver marker across the number 8. One of the most sought-after pieces of football memorabilia.",
    price: 74999, category: "Signed Jersey", sport: "Football (Soccer)",
    player: "Steven Gerrard", team: "Liverpool FC", year: "2005", condition: "Near Mint",
    images: ["https://picsum.photos/seed/gerrard1/800/800", "https://picsum.photos/seed/gerrard2/800/800"],
    accept_offers: true, minimum_offer: 50000,
    coa_source: "PSA", coa_certificate_number: "PSA-SG-05CL-8821",
  },
  {
    sellerIdx: 0,
    title: "Cristiano Ronaldo Signed Real Madrid 16x20 Photo",
    description: "Stunning 16x20 photograph of Cristiano Ronaldo celebrating a Champions League goal for Real Madrid. Signed in blue marker with full signature. Authenticated by PSA/DNA with tamper-evident hologram.",
    price: 49999, category: "Signed Photo", sport: "Football (Soccer)",
    player: "Cristiano Ronaldo", team: "Real Madrid", year: "2017", condition: "Mint",
    images: ["https://picsum.photos/seed/ronaldo1/800/800", "https://picsum.photos/seed/ronaldo2/800/800"],
    accept_offers: false, minimum_offer: null,
    coa_source: "PSA", coa_certificate_number: "PSA-CR7-RM-44291",
  },
  {
    sellerIdx: 3,
    title: "Lionel Messi Signed FC Barcelona Home Shirt 2015",
    description: "Lionel Messi hand-signed FC Barcelona home shirt from the treble-winning 2014/15 season. Signed on the front in permanent black marker. This is a genuine Nike match shirt, not a replica. Includes full JSA letter of authenticity.",
    price: 99999, category: "Signed Jersey", sport: "Football (Soccer)",
    player: "Lionel Messi", team: "FC Barcelona", year: "2015", condition: "Excellent",
    images: ["https://picsum.photos/seed/messi1/800/800", "https://picsum.photos/seed/messi2/800/800", "https://picsum.photos/seed/messi3/800/800"],
    accept_offers: true, minimum_offer: 75000,
    coa_source: "JSA (James Spence Authentication)", coa_certificate_number: "JSA-LM10-BCN-76543",
  },
  {
    sellerIdx: 1,
    title: "Muhammad Ali Signed Everlast Boxing Glove",
    description: "Rare Muhammad Ali signed red Everlast boxing glove. Signed \"Muhammad Ali\" in black marker. This glove was signed in the 1990s and has been kept in excellent condition in a display case. A true centrepiece for any boxing collection. Authenticated by PSA/DNA.",
    price: 499999, category: "Signed Glove", sport: "Boxing",
    player: "Muhammad Ali", team: "", year: "1995", condition: "Very Good",
    images: ["https://picsum.photos/seed/ali1/800/800", "https://picsum.photos/seed/ali2/800/800", "https://picsum.photos/seed/ali3/800/800"],
    accept_offers: true, minimum_offer: 400000,
    coa_source: "PSA", coa_certificate_number: "PSA-MA-GLV-99102",
  },
  {
    sellerIdx: 1,
    title: "Mike Tyson Signed 11x14 Knockout Photo",
    description: "Mike Tyson signed 11x14 photograph capturing one of his legendary knockout victories. Signed in silver marker with \"Iron Mike\" inscription. Perfect for framing. Beckett authenticated.",
    price: 12999, category: "Signed Photo", sport: "Boxing",
    player: "Mike Tyson", team: "", year: "2020", condition: "Mint",
    images: ["https://picsum.photos/seed/tyson1/800/800", "https://picsum.photos/seed/tyson2/800/800"],
    accept_offers: true, minimum_offer: null,
    coa_source: "Beckett Authentication", coa_certificate_number: "BAS-MT-KO-33847",
  },
  {
    sellerIdx: 1,
    title: "Anthony Joshua Signed Red Everlast Boxing Glove",
    description: "Anthony Joshua signed red Everlast boxing glove from a private signing session in London. Signed in black marker with \"AJ\" inscription. Comes with photo proof of signing and Beckett COA.",
    price: 19999, category: "Signed Glove", sport: "Boxing",
    player: "Anthony Joshua", team: "", year: "2023", condition: "Mint",
    images: ["https://picsum.photos/seed/aj1/800/800", "https://picsum.photos/seed/aj2/800/800"],
    accept_offers: true, minimum_offer: 15000,
    coa_source: "Beckett Authentication", coa_certificate_number: "BAS-AJ-GLV-55102",
  },
  {
    sellerIdx: 2,
    title: "Jonny Wilkinson Signed England Rugby World Cup Shirt 2003",
    description: "Jonny Wilkinson signed England rugby shirt from the 2003 Rugby World Cup winning campaign. Signed on the back below the number 10. One of the most iconic moments in English sporting history. Authenticated by JSA.",
    price: 44999, category: "Signed Jersey", sport: "Rugby",
    player: "Jonny Wilkinson", team: "England", year: "2003", condition: "Excellent",
    images: ["https://picsum.photos/seed/wilko1/800/800", "https://picsum.photos/seed/wilko2/800/800"],
    accept_offers: true, minimum_offer: 35000,
    coa_source: "JSA (James Spence Authentication)", coa_certificate_number: "JSA-JW-ENG-03RWC",
  },
  {
    sellerIdx: 2,
    title: "Martin Johnson Signed England Rugby Captain Photo 2003",
    description: "Martin Johnson signed 12x16 photograph lifting the Webb Ellis Cup after England's 2003 Rugby World Cup Final victory over Australia. A stunning piece signed in gold marker. PSA authenticated.",
    price: 14999, category: "Signed Photo", sport: "Rugby",
    player: "Martin Johnson", team: "England", year: "2003", condition: "Mint",
    images: ["https://picsum.photos/seed/johnson1/800/800"],
    accept_offers: false, minimum_offer: null,
    coa_source: "PSA", coa_certificate_number: "PSA-MJ-RWC-03FIN",
  },
  {
    sellerIdx: 2,
    title: "Sachin Tendulkar Signed Full-Size Cricket Bat",
    description: "Sachin Tendulkar hand-signed full-size Gray-Nicolls cricket bat. Signed on the face of the bat in black marker. The greatest batsman in cricket history — a must-have for any cricket collector. Comes with Beckett LOA.",
    price: 39999, category: "Signed Bat/Stick", sport: "Cricket",
    player: "Sachin Tendulkar", team: "India", year: "2013", condition: "Very Good",
    images: ["https://picsum.photos/seed/sachin1/800/800", "https://picsum.photos/seed/sachin2/800/800"],
    accept_offers: true, minimum_offer: 30000,
    coa_source: "Beckett Authentication", coa_certificate_number: "BAS-ST-BAT-IND2013",
  },
  {
    sellerIdx: 2,
    title: "Ben Stokes Signed England Ashes Cricket Shirt 2019",
    description: "Ben Stokes signed England cricket shirt from the historic 2019 Ashes series, where he played one of the greatest innings of all time at Headingley. Signed on the front in blue marker. PSA/DNA authenticated.",
    price: 17999, category: "Signed Jersey", sport: "Cricket",
    player: "Ben Stokes", team: "England", year: "2019", condition: "Excellent",
    images: ["https://picsum.photos/seed/stokes1/800/800", "https://picsum.photos/seed/stokes2/800/800"],
    accept_offers: true, minimum_offer: null,
    coa_source: "PSA", coa_certificate_number: "PSA-BS-ENG-ASHES19",
  },
  {
    sellerIdx: 3,
    title: "Thierry Henry Signed Arsenal Invincibles Shirt 2004",
    description: "Thierry Henry signed Arsenal home shirt from the legendary 2003/04 Invincibles season. Signed on the front below the O2 sponsor logo in black marker. One of the most desirable football shirts in existence. Full Beckett authentication.",
    price: 59999, category: "Signed Jersey", sport: "Football (Soccer)",
    player: "Thierry Henry", team: "Arsenal", year: "2004", condition: "Near Mint",
    images: ["https://picsum.photos/seed/henry1/800/800", "https://picsum.photos/seed/henry2/800/800", "https://picsum.photos/seed/henry3/800/800"],
    accept_offers: true, minimum_offer: 45000,
    coa_source: "Beckett Authentication", coa_certificate_number: "BAS-TH14-ARS-04INV",
  },
  {
    sellerIdx: 0,
    title: "David Beckham Signed England 2002 World Cup Shirt",
    description: "David Beckham signed England home shirt from the 2002 FIFA World Cup in Japan/South Korea. Features Beckham's signature on the number 7 on the back. A beautiful piece from the golden generation era. JSA authenticated with full letter.",
    price: 29999, category: "Signed Jersey", sport: "Football (Soccer)",
    player: "David Beckham", team: "England", year: "2002", condition: "Excellent",
    images: ["https://picsum.photos/seed/beckham1/800/800", "https://picsum.photos/seed/beckham2/800/800"],
    accept_offers: true, minimum_offer: 22000,
    coa_source: "JSA (James Spence Authentication)", coa_certificate_number: "JSA-DB7-ENG-02WC",
  },
  {
    sellerIdx: 1,
    title: "Lennox Lewis Signed Black Everlast Boxing Glove",
    description: "Lennox Lewis signed black Everlast boxing glove. The last undisputed heavyweight champion of the 20th century. Signed in silver marker with inscription \"2 x Champ\". PSA authenticated.",
    price: 8999, category: "Signed Glove", sport: "Boxing",
    player: "Lennox Lewis", team: "", year: "2022", condition: "Mint",
    images: ["https://picsum.photos/seed/lewis1/800/800", "https://picsum.photos/seed/lewis2/800/800"],
    accept_offers: true, minimum_offer: null,
    coa_source: "PSA", coa_certificate_number: "PSA-LL-GLV-HW2022",
  },
  {
    sellerIdx: 3,
    title: "Eric Cantona Signed Manchester United Celebration Photo",
    description: "Eric Cantona signed 16x12 photograph showing his iconic collar-up celebration at Old Trafford. Signed in black marker with \"King Eric\" inscription. A true piece of Manchester United and Premier League history. Beckett authenticated.",
    price: 24999, category: "Signed Photo", sport: "Football (Soccer)",
    player: "Eric Cantona", team: "Manchester United", year: "1996", condition: "Mint",
    images: ["https://picsum.photos/seed/cantona1/800/800", "https://picsum.photos/seed/cantona2/800/800"],
    accept_offers: true, minimum_offer: 18000,
    coa_source: "Beckett Authentication", coa_certificate_number: "BAS-EC7-MUFC-96ICN",
  },
];

async function createListings() {
  for (const item of LISTINGS) {
    const seller = SELLERS[item.sellerIdx];
    const { sellerIdx, ...listingData } = item;

    const { error } = await supabase.from("listings").insert({
      seller_id: seller.id,
      ...listingData,
      status: "listed",
      flagged: false,
    });

    if (error) {
      console.error(`  Error inserting "${item.title}":`, error.message);
    } else {
      console.log(`  Listed: ${item.title} ($${(item.price / 100).toFixed(2)})`);
    }
  }
}

async function main() {
  console.log("Creating sellers...");
  await createSellers();

  console.log("\nCreating listings...");
  await createListings();

  console.log("\nDone! Seed complete.");
}

main().catch(console.error);
