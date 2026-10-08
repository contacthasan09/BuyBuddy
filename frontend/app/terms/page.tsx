import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalUL,
  LegalLI,
  LegalCallout,
} from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Terms & Conditions | Maison",
  description:
    "The terms governing your engagement with Maison — our commitment to transparency, integrity, and exceptional service.",
};

const TOC = [
  { id: "using-store", label: "Utilizing Our Platform" },
  { id: "orders", label: "Order Protocols" },
  { id: "pricing", label: "Pricing Structure" },
  { id: "payment", label: "Payment Methods" },
  { id: "delivery", label: "Delivery Commitments" },
  { id: "returns", label: "Return Privileges" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "changes", label: "Amendments" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms &"
      titleAccent="conditions."
      lastUpdated="October 2026"
      toc={TOC}
    >
      <LegalCallout>
        By placing an order, you acknowledge and accept these terms. We encourage you to review them thoroughly.
      </LegalCallout>

      <LegalH2 id="using-store">Utilizing Our Platform</LegalH2>
      <LegalP>
        Maison provides curated products for personal, non-commercial use. By accessing our platform, you agree to engage with it respectfully, refraining from any misuse, disruption, or unlawful activity.
      </LegalP>

      <LegalH2 id="orders">Order Protocols</LegalH2>
      <LegalUL>
        <LegalLI>
          All acquisitions are subject to product availability and our discretion.
        </LegalLI>
        <LegalLI>
          We reserve the right to decline or cancel any order should stock be unavailable, or if the delivery destination falls outside our service area.
        </LegalLI>
        <LegalLI>
          In the event of a cancellation, our concierge will notify you promptly via SMS and telephone.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="pricing">Pricing Structure</LegalH2>
      <LegalUL>
        <LegalLI>
          All prices are denominated in BDT (৳) and inclusive of applicable taxes.
        </LegalLI>
        <LegalLI>
          Delivery charges are calculated at checkout and presented for your approval prior to confirmation.
        </LegalLI>
        <LegalLI>
          We retain the right to adjust pricing without prior notice; however, all orders already placed will be honored at the price confirmed at the time of purchase.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="payment">Payment Methods</LegalH2>
      <LegalP>
        We exclusively accept <strong>Cash on Delivery</strong>. You settle payment securely with our courier upon arrival of your acquisition. No online payment is required or accepted at this time.
      </LegalP>

      <LegalH2 id="delivery">Delivery Commitments</LegalH2>
      <LegalP>
        We dispatch to all 64 districts of Bangladesh. Estimated transit is 2–4 business days, contingent upon your location.
      </LegalP>
      <LegalP>
        Please note that delivery times are estimates, not absolute guarantees. Unforeseen circumstances such as severe weather, civil disruptions, or logistical challenges may cause delays. Should this occur, we will notify you promptly.
      </LegalP>

      <LegalH2 id="returns">Return Privileges</LegalH2>
      <LegalP>
        Please consult our{" "}
        <a
          href="/return-policy"
          className="text-[#B8935A] hover:underline font-medium transition-colors"
        >
          Return & Refund Privileges
        </a>{" "}
        for comprehensive details. In summary: a 7-day return privilege is extended on unused acquisitions in their original packaging.
      </LegalP>

      <LegalH2 id="liability">Limitation of Liability</LegalH2>
      <LegalP>
        Our liability is limited to the value of the products you acquire. We are not liable for indirect losses (such as missed engagements or consequential damages) arising from delivery delays or product unavailability.
      </LegalP>

      <LegalH2 id="changes">Amendments</LegalH2>
      <LegalP>
        We may amend these terms periodically. Your continued engagement with our platform following any modification constitutes your acceptance of the revised terms.
      </LegalP>
    </LegalPageLayout>
  );
}