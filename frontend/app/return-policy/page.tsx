import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalUL,
  LegalLI,
  LegalCallout,
} from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Return & Refund Privileges | Maison",
  description:
    "Our commitment to your satisfaction: a seamless 7-day return and exchange privilege for all Maison acquisitions.",
};

const TOC = [
  { id: "window", label: "Return Window" },
  { id: "how", label: "Initiating a Return" },
  { id: "refunds", label: "Refund Protocols" },
  { id: "non-returnable", label: "Excluded Items" },
  { id: "damaged", label: "Damaged on Arrival" },
  { id: "exchanges", label: "Exchange Privileges" },
];

export default function ReturnPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Return &"
      titleAccent="refund privileges."
      lastUpdated="October 2026"
      toc={TOC}
    >
      <LegalCallout>
        <strong>7-day return privilege.</strong> If your acquisition does not meet your expectations, our concierge will ensure it is made right.
      </LegalCallout>

      <LegalH2 id="window">Return Window</LegalH2>
      <LegalP>
        You have <strong>7 days</strong> from the date of delivery to request a return. To be eligible, acquisitions must be:
      </LegalP>
      <LegalUL>
        <LegalLI>Unused and in pristine condition.</LegalLI>
        <LegalLI>In original packaging (with all tags intact).</LegalLI>
        <LegalLI>Accompanied by the original order reference.</LegalLI>
      </LegalUL>

      <LegalH2 id="how">Initiating a Return</LegalH2>
      <LegalUL>
        <LegalLI>
          Contact our concierge via WhatsApp at +880 1700-000000 with your Order Reference.
        </LegalLI>
        <LegalLI>Provide the reason for the return.</LegalLI>
        <LegalLI>
          We will arrange a complimentary courier pickup at your convenience.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="refunds">Refund Protocols</LegalH2>
      <LegalP>
        Upon receipt and inspection of the returned acquisition, we process refunds within <strong>3–5 business days</strong> via bKash, Nagad, or direct bank transfer — at your preference.
      </LegalP>
      <LegalUL>
        <LegalLI>
          <strong>Cash on Delivery orders:</strong> Refunds are issued via bKash or Nagad.
        </LegalLI>
        <LegalLI>
          <strong>Delivery charges</strong> are fully refundable if the return is due to our error (incorrect item, damaged, or defective).
        </LegalLI>
        <LegalLI>
          <strong>Delivery charges</strong> are non-refundable if the return is due to a change of preference.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="non-returnable">Excluded Items</LegalH2>
      <LegalUL>
        <LegalLI>Acquisitions that have been used, altered, or laundered.</LegalLI>
        <LegalLI>Items returned without their original packaging.</LegalLI>
        <LegalLI>
          Personal care and wellness products that have been unsealed.
        </LegalLI>
        <LegalLI>Bespoke or personalized acquisitions.</LegalLI>
        <LegalLI>Intimate apparel (for hygiene and sanitary reasons).</LegalLI>
      </LegalUL>

      <LegalH2 id="damaged">Damaged on Arrival</LegalH2>
      <LegalP>
        Should your acquisition arrive damaged, defective, or incorrect, please <strong>contact our concierge immediately</strong>:
      </LegalP>
      <LegalUL>
        <LegalLI>Provide a photograph of the item via WhatsApp.</LegalLI>
        <LegalLI>Include your Order Reference.</LegalLI>
        <LegalLI>
          We will arrange a complimentary replacement, typically dispatched within 2–3 days.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="exchanges">Exchange Privileges</LegalH2>
      <LegalP>
        Should you prefer to exchange your acquisition for a different piece or size, our concierge will gladly facilitate the process. Any difference in value will be settled accordingly. Please contact us via WhatsApp to initiate an exchange.
      </LegalP>
    </LegalPageLayout>
  );
}