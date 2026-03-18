"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  category: string;
  items: FaqItem[];
}

const faqData: FaqSection[] = [
  {
    category: "Authentication & Verification",
    items: [
      {
        question: "How does TrustedCollectibles verify items?",
        answer:
          "Every item goes through our expert review process. We check the COA against known databases, examine photos for authenticity markers, and verify the authentication source (PSA, Beckett, JSA, etc.).",
      },
      {
        question: "What COA sources do you accept?",
        answer:
          "We accept items authenticated by PSA, JSA (James Spence), Beckett Authentication, SGC, Fanatics, Upper Deck Authenticated, Steiner Sports, and other recognised authentication houses.",
      },
      {
        question: "Can I sell items without a COA?",
        answer:
          'Items with "Seller Self-Authenticated" status can be submitted but undergo stricter review. We strongly recommend having items authenticated by a recognised house before listing.',
      },
      {
        question: "How long does verification take?",
        answer:
          "Most items are reviewed within 24\u201348 hours. Complex or high-value items may take up to 5 business days.",
      },
    ],
  },
  {
    category: "Buying",
    items: [
      {
        question: "How does escrow payment work?",
        answer:
          "When you buy an item, your payment is held securely by our platform. The seller ships the item, and once you confirm delivery, the payment is released to the seller. This protects you from fraud.",
      },
      {
        question: "What if the item isn\u2019t as described?",
        answer:
          "You have 3 business days after delivery to inspect the item. If it\u2019s not as described, open a dispute and our team will investigate. You\u2019ll receive a full refund if the item doesn\u2019t match the listing.",
      },
      {
        question: "Can I make an offer below the listed price?",
        answer:
          "Yes, if the seller has enabled offers. Some sellers set a minimum offer amount. The seller can accept, decline, or counter your offer.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express.",
      },
    ],
  },
  {
    category: "Selling",
    items: [
      {
        question: "How much does it cost to sell?",
        answer:
          "Listing is free. We charge a 10% commission on completed sales, plus Stripe processing fees (2.9% + 30p). There are no hidden fees.",
      },
      {
        question: "How do I get paid?",
        answer:
          "You\u2019ll need to connect your Stripe account. After a buyer confirms delivery, funds are transferred to your Stripe account within 2\u20133 business days.",
      },
      {
        question: "How quickly do I need to ship?",
        answer:
          "You must ship within 3 business days of receiving an order and provide a valid tracking number.",
      },
      {
        question: "What if a buyer disputes my item?",
        answer:
          "Our team will investigate. If the item matches the listing description and COA, we\u2019ll release the payment to you. We protect honest sellers.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        question: "Do you provide shipping labels?",
        answer:
          "Currently, sellers arrange their own shipping. We recommend using tracked and insured services for all items.",
      },
      {
        question: "What if my item is lost in transit?",
        answer:
          "If tracking shows the item was not delivered, we\u2019ll work with the seller to resolve the issue. Buyers are protected by our escrow system.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Shipping arrangements are between buyer and seller. Many sellers offer international shipping \u2014 check the listing for details.",
      },
    ],
  },
  {
    category: "Account & General",
    items: [
      {
        question: "How do I create a seller account?",
        answer:
          "Register for a free account, then connect your Stripe account from Settings. Once connected, you can start listing items.",
      },
      {
        question: "Is my personal data safe?",
        answer:
          "Yes. We\u2019re GDPR compliant and use industry-standard encryption. Payment data is handled by Stripe \u2014 we never store your card details. See our Privacy Policy for full details.",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  function toggle(key: string) {
    setOpenIndex((prev) => (prev === key ? null : key));
  }

  return (
    <div className="space-y-10">
      {faqData.map((section) => (
        <div key={section.category}>
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            {section.category}
          </h2>
          <div>
            {section.items.map((item, idx) => {
              const key = `${section.category}-${idx}`;
              const isOpen = openIndex === key;
              return (
                <div key={key} className="border-b border-white/[0.07]">
                  <button
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between py-4 text-left text-white font-medium hover:text-brand-amber transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronIcon open={isOpen} />
                  </button>
                  {isOpen && (
                    <p className="pb-4 text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
