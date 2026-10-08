import Link from "next/link";
import { Check, ArrowRight, Phone } from "lucide-react";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkSoft: "#5C4F42",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
  bone: "#F7F1E3",
};

function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-multiply"
    >
      <filter id="grain-success">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-success)" />
    </svg>
  );
}

interface Props {
  searchParams: { invoice?: string };
}

export default function OrderSuccessPage({ searchParams }: Props) {
  const invoice = searchParams.invoice || "";

  return (
    <div
      className="relative min-h-[80vh] flex items-center justify-center"
      style={{ background: T.bg }}
    >
      <Grain />

      <div className="relative max-w-xl px-6 text-center z-10">
        {/* Icon */}
        <div className="relative mx-auto mb-10">
          <div
            className="w-24 h-24 rounded-sm flex items-center justify-center mx-auto"
            style={{
              background: T.bone,
              border: `1px solid ${T.gold}40`,
              boxShadow: `0 8px 24px -8px ${T.gold}30`,
            }}
          >
            <Check
              className="w-10 h-10"
              strokeWidth={1.5}
              style={{ color: T.gold }}
            />
          </div>
          <div
            className="absolute inset-0 rounded-sm animate-ping"
            style={{
              border: `1px solid ${T.gold}30`,
              animationDuration: "3s",
            }}
          />
        </div>

        {/* Heading */}
        <h1
          className="mb-5 leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 400,
            color: T.ink,
          }}
        >
          Acquisition{" "}
          <span className="italic font-light" style={{ color: T.wine }}>
            confirmed.
          </span>
        </h1>

        <p
          className="mb-10 max-w-md mx-auto leading-relaxed"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "15px",
            color: T.inkSoft,
            lineHeight: 1.7,
          }}
        >
          Thank you for your order. Our concierge will contact you shortly to
          verify the details and arrange dispatch.
        </p>

        {/* Invoice */}
        {invoice && (
          <div
            className="inline-flex items-center gap-4 px-6 py-4 rounded-sm mb-12"
            style={{
              background: T.bone,
              border: `1px solid ${T.gold}35`,
            }}
          >
            <span
              className="text-[9px] tracking-[0.35em] uppercase font-medium"
              style={{
                color: T.gold,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              Order Reference
            </span>
            <span
              className="text-[14px] font-medium tabular-nums"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              {invoice}
            </span>
          </div>
        )}

        {/* Next steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 text-left">
          {[
            {
              num: "01",
              label: "Concierge Confirmation",
              sub: "Within 2 hours",
            },
            {
              num: "02",
              label: "Expedited Dispatch",
              sub: "Within 24 hours",
            },
            {
              num: "03",
              label: "Secure Settlement",
              sub: "Upon delivery",
            },
          ].map((s) => (
            <div
              key={s.num}
              className="relative p-5 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}25`,
              }}
            >
              <div
                className="absolute inset-2 pointer-events-none rounded-sm"
                style={{ border: `0.5px solid ${T.gold}`, opacity: 0.15 }}
                aria-hidden
              />
              <div className="relative z-10">
                <div
                  className="text-[18px] font-medium mb-3"
                  style={{
                    color: T.gold,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {s.num}
                </div>
                <p
                  className="text-[13px] font-medium mb-1"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {s.label}
                </p>
                <p
                  className="text-[11px] tracking-[0.15em] uppercase"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {invoice && (
            <Link
              href={`/track?invoice=${encodeURIComponent(invoice)}`}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)]"
              style={{
                background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 600,
                boxShadow: `0 8px 24px -8px rgba(184,147,90,0.4)`,
              }}
            >
              Track Acquisition
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                strokeWidth={1.5}
              />
            </Link>
          )}
          <Link
            href="/products"
            className="continue-shopping group inline-flex items-center justify-center px-8 py-4 rounded-sm transition-all duration-300"
            style={{
              color: T.inkSoft,
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
              border: `1px solid ${T.gold}40`,
            }}
          >
            Continue Shopping
          </Link>
        </div>

        <p
          className="text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-2"
          style={{
            color: T.inkSoft,
            fontFamily: "var(--font-fraunces), Georgia, serif",
          }}
        >
          <Phone
            className="w-3.5 h-3.5"
            strokeWidth={1.5}
            style={{ color: T.gold }}
          />
          Questions? Contact our concierge at +880 1700-000000
        </p>

        {/* Hover styles for the secondary button — pure CSS, no JS */}
        <style>{`
          .continue-shopping:hover {
            border-color: #B8935A !important;
            color: #1C1612 !important;
            background: rgba(184, 147, 90, 0.08) !important;
          }
        `}</style>
      </div>
    </div>
  );
}