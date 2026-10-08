import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalUL,
  LegalLI,
  LegalCallout,
} from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy | Maison",
  description:
    "How Maison collects, utilizes, and protects your personal information with the utmost discretion.",
};

const TOC = [
  { id: "what-we-collect", label: "Information Gathered" },
  { id: "what-we-dont", label: "Information Excluded" },
  { id: "how-we-use", label: "Data Utilization" },
  { id: "sharing", label: "Sharing Protocols" },
  { id: "cookies", label: "Cookie Usage" },
  { id: "your-rights", label: "Your Rights" },
  { id: "contact", label: "Concierge Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy"
      titleAccent="policy."
      lastUpdated="October 2026"
      toc={TOC}
    >
      <LegalCallout>
        <strong>In brief:</strong> We collect only what is strictly necessary to facilitate your acquisition. We never sell your personal data.
      </LegalCallout>

      <LegalH2 id="what-we-collect">Information We Gather</LegalH2>
      <LegalP>
        When you place an order or communicate with our concierge, we collect:
      </LegalP>
      <LegalUL>
        <LegalLI>Your full name — to ensure proper delivery attribution.</LegalLI>
        <LegalLI>
          Your contact number — to verify order details and coordinate dispatch.
        </LegalLI>
        <LegalLI>Your delivery address — to facilitate seamless shipping.</LegalLI>
        <LegalLI>
          Order history — to refine and expedite your future acquisitions.
        </LegalLI>
        <LegalLI>
          Basic device data — to maintain optimal store functionality.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="what-we-dont">
        Information We Do <em>Not</em> Gather
      </LegalH2>
      <LegalUL>
        <LegalLI>
          <strong>No passwords.</strong> We offer a seamless guest checkout experience; account creation is not required.
        </LegalLI>
        <LegalLI>
          <strong>No financial details.</strong> We exclusively utilize Cash on Delivery.
        </LegalLI>
        <LegalLI>
          <strong>No intrusive third-party trackers</strong> beyond essential, anonymized analytics.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="how-we-use">How We Utilize Your Information</LegalH2>
      <LegalUL>
        <LegalLI>To process and dispatch your acquisition with precision.</LegalLI>
        <LegalLI>
          To communicate regarding your order status (via call, SMS, or WhatsApp).
        </LegalLI>
        <LegalLI>
          To refine our curated product selection and elevate the delivery experience.
        </LegalLI>
        <LegalLI>
          To dispatch exclusive updates <em>only</em> upon your explicit consent.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="sharing">Data Sharing Protocols</LegalH2>
      <LegalP>
        We share your <strong>name, contact number, and delivery address</strong> strictly with our designated courier partner to ensure the secure delivery of your package. No other information is disclosed, under any circumstances.
      </LegalP>
      <LegalP>
        We do not sell, rent, or trade your personal data to any third party.
      </LegalP>

      <LegalH2 id="cookies">Cookie Usage</LegalH2>
      <LegalP>
        We employ minimal cookies solely to maintain your cart functionality and remember your preferences. You retain full control over cookie settings via the banner presented upon your initial visit.
      </LegalP>
      <LegalUL>
        <LegalLI>
          <strong>Essential cookies</strong> — required for cart and checkout operations.
        </LegalLI>
        <LegalLI>
          <strong>Analytics cookies</strong> — assist us in understanding client preferences to better curate our offerings.
        </LegalLI>
      </LegalUL>

      <LegalH2 id="your-rights">Your Privacy Rights</LegalH2>
      <LegalP>You may request that we:</LegalP>
      <LegalUL>
        <LegalLI>Provide a comprehensive copy of all data we hold regarding you.</LegalLI>
        <LegalLI>Permanently erase all your personal data from our records.</LegalLI>
        <LegalLI>Immediately opt out of any marketing communications.</LegalLI>
      </LegalUL>

      <LegalH2 id="contact">Concierge Contact</LegalH2>
      <LegalP>
        For any inquiries regarding your privacy, please contact our concierge at{" "}
        <a
          href="mailto:concierge@maison.com"
          className="text-[#B8935A] hover:underline font-medium transition-colors"
        >
          concierge@maison.com
        </a>{" "}
        or via WhatsApp at{" "}
        <a
          href="https://wa.me/8801700000000"
          className="text-[#B8935A] hover:underline font-medium transition-colors"
        >
          +880 1700-000000
        </a>
        . We guarantee a response within 24 hours.
      </LegalP>
    </LegalPageLayout>
  );
}