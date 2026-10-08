import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalUL,
  LegalLI,
  LegalCallout,
} from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Shipping & Delivery Policy | Maison",
  description:
    "Our commitment to seamless, secure, and complimentary nationwide delivery across all 64 districts of Bangladesh.",
};

const TOC = [
  { id: "coverage", label: "Nationwide Coverage" },
  { id: "times", label: "Transit Times" },
  { id: "charges", label: "Freight Charges" },
  { id: "courier", label: "Courier Alliance" },
  { id: "tracking", label: "Order Tracking" },
  { id: "failed", label: "Unsuccessful Deliveries" },
  { id: "delays", label: "Potential Delays" },
];

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Shipping"
      titleAccent="policy."
      lastUpdated="October 2026"
      toc={TOC}
    >
      <LegalCallout>
        <strong>Complimentary nationwide delivery.</strong> We dispatch to all 64 districts of Bangladesh with precision and care via our trusted courier alliance.
      </LegalCallout>

      <LegalH2 id="coverage">Nationwide Coverage</LegalH2>
      <LegalP>
        We dispatch to every corner of Bangladesh — from the heart of Dhaka metro to the most remote upazilas. No exceptions.
      </LegalP>

      <LegalH2 id="times">Transit Times</LegalH2>
      <LegalUL>
        <LegalLI>Dhaka Metro: 1–2 business days</LegalLI>
        <LegalLI>
          Chattogram, Sylhet, Khulna, Rajshahi: 2–3 business days
        </LegalLI>
        <LegalLI>Other districts: 3–4 business days</LegalLI>
        <LegalLI>Remote upazilas: up to 5 business days</LegalLI>
      </LegalUL>

      <LegalH2 id="charges">Freight Charges</LegalH2>
      <LegalUL>
        <LegalLI>Dhaka: ৳60</LegalLI>
        <LegalLI>Chattogram: ৳100</LegalLI>
        <LegalLI>Other districts: ৳120–130</LegalLI>
        <LegalLI>
          <strong>Complimentary delivery</strong> on all acquisitions exceeding ৳2,000
        </LegalLI>
      </LegalUL>

      <LegalH2 id="courier">Courier Alliance</LegalH2>
      <LegalP>
        We partner exclusively with <strong>Steadfast Courier</strong>, ensuring secure, trackable, and reliable nationwide dispatch for every acquisition.
      </LegalP>

      <LegalH2 id="tracking">Order Tracking</LegalH2>
      <LegalP>
        Upon dispatch, you will receive:
      </LegalP>
      <LegalUL>
        <LegalLI>An SMS containing your unique tracking reference.</LegalLI>
        <LegalLI>
          A direct link to our{" "}
          <a href="/track" className="text-[#B8935A] hover:underline font-medium transition-colors">
            Track Order portal
          </a>
          .
        </LegalLI>
        <LegalLI>
          Real-time status updates regarding your acquisition&apos;s journey.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="failed">Unsuccessful Deliveries</LegalH2>
      <LegalP>
        Our courier will contact you prior to arrival. Should you miss this communication, we will gracefully arrange one additional delivery attempt at no extra cost. Following two unsuccessful attempts, the acquisition will be returned to our atelier.
      </LegalP>

      <LegalH2 id="delays">Potential Delays</LegalH2>
      <LegalP>
        Occasionally, unforeseen circumstances such as severe weather, civil unrest, or logistical disruptions may impact transit times. Should this occur, we will notify you promptly via SMS. You may also monitor your order&apos;s status at any time via our{" "}
        <a href="/track" className="text-[#B8935A] hover:underline font-medium transition-colors">
          Track Order portal
        </a>
        .
      </LegalP>
    </LegalPageLayout>
  );
}