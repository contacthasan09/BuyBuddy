"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StaggerReveal } from "@/components/ui/StaggerReveal";

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
      <filter id="grain-contact">
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
      <rect width="100%" height="100%" filter="url(#grain-contact)" />
    </svg>
  );
}

const CONTACTS = [
  {
    icon: Phone,
    label: "Telephone",
    value: "+880 1700-000000",
    href: "tel:+8801700000000",
    note: "Available daily, 9 AM – 9 PM",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Concierge",
    value: "Message Us",
    href: "https://wa.me/8801700000000",
    note: "Expedited response guaranteed",
    accent: true,
  },
  {
    icon: Mail,
    label: "Electronic Mail",
    value: "concierge@maison.com",
    href: "mailto:concierge@maison.com",
    note: "Responses within 24 hours",
  },
  {
    icon: MapPin,
    label: "Atelier Address",
    value: "Dhaka, Bangladesh",
    href: undefined,
    note: "Complimentary nationwide delivery",
  },
];

export default function ContactPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: T.bg, color: T.ink }}
    >
      <Grain />

      {/* Hero */}
      <section
        className="relative border-b"
        style={{ borderColor: `${T.gold}30` }}
      >
        <div className="container-x py-20 md:py-28 max-w-4xl relative z-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="h-px w-8"
                style={{ background: T.gold, opacity: 0.5 }}
              />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                Concierge & Inquiries
              </p>
            </div>

            <h1
              className="mb-8 leading-[0.92] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              At your{" "}
              <span className="italic font-light" style={{ color: T.wine }}>
                service.
              </span>
            </h1>

            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                color: T.inkSoft,
                lineHeight: 1.75,
              }}
            >
              Questions regarding an acquisition or our collections? Our
              dedicated concierge is available to assist you. Reach us via
              WhatsApp for the most expedited response.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact cards */}
      <section className="container-x py-20 md:py-24 max-w-5xl relative z-10">
        <StaggerReveal
          stagger={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {CONTACTS.map((contact) => {
            const content = (
              <>
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-6 transition-colors duration-500"
                  style={{
                    background: contact.accent ? `${T.gold}15` : `${T.gold}10`,
                    border: `1px solid ${
                      contact.accent ? T.gold : `${T.gold}30`
                    }`,
                  }}
                >
                  <contact.icon
                    className="w-5 h-5 transition-colors duration-500"
                    strokeWidth={1.5}
                    style={{ color: T.gold }}
                  />
                </div>
                <p
                  className="text-[9px] tracking-[0.35em] uppercase mb-2"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {contact.label}
                </p>
                <p
                  className="text-[16px] font-medium mb-2"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {contact.value}
                </p>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {contact.note}
                </p>
              </>
            );

            if (contact.href) {
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={
                    contact.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    contact.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group relative block p-8 rounded-sm border transition-all duration-500 hover:shadow-[0_12px_32px_-16px_rgba(28,22,18,0.15)]"
                  style={{
                    background: contact.accent ? `${T.gold}08` : T.bg,
                    borderColor: contact.accent ? `${T.gold}40` : `${T.gold}25`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${T.gold}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = contact.accent
                      ? `${T.gold}40`
                      : `${T.gold}25`;
                  }}
                >
                  <div
                    className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden
                  />
                  {content}
                </a>
              );
            }

            return (
              <div
                key={contact.label}
                className="group relative block p-8 rounded-sm border transition-all duration-500 hover:border-[#B8935A]/50 hover:shadow-[0_12px_32px_-16px_rgba(28,22,18,0.15)]"
                style={{
                  background: T.bg,
                  borderColor: `${T.gold}25`,
                }}
              >
                <div
                  className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden
                />
                {content}
              </div>
            );
          })}
        </StaggerReveal>
      </section>

      {/* Business hours + social */}
      <section className="container-x pb-20 md:pb-24 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal direction="left">
            <div
              className="relative p-8 rounded-sm border"
              style={{
                background: T.bone,
                borderColor: `${T.gold}25`,
              }}
            >
              <div
                className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-20"
                aria-hidden
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Clock
                    className="w-5 h-5"
                    strokeWidth={1.5}
                    style={{ color: T.gold }}
                  />
                  <h2
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{
                      color: T.gold,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    Hours of Operation
                  </h2>
                </div>
                <ul className="space-y-4">
                  {[
                    { day: "Saturday – Thursday", hours: "9 AM – 9 PM" },
                    { day: "Friday", hours: "2 PM – 9 PM" },
                    { day: "Public Holidays", hours: "WhatsApp Only" },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-baseline"
                    >
                      <span
                        className="text-[13px]"
                        style={{
                          color: T.inkSoft,
                          fontFamily:
                            "var(--font-fraunces), Georgia, serif",
                        }}
                      >
                        {item.day}
                      </span>
                      <span
                        className="text-[13px] font-medium tabular-nums"
                        style={{
                          color: T.ink,
                          fontFamily:
                            "var(--font-fraunces), Georgia, serif",
                        }}
                      >
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <div
              className="relative p-8 rounded-sm border"
              style={{
                background: T.bone,
                borderColor: `${T.gold}25`,
              }}
            >
              <div
                className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-20"
                aria-hidden
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle
                    className="w-5 h-5"
                    strokeWidth={1.5}
                    style={{ color: T.gold }}
                  />
                  <h2
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{
                      color: T.gold,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    Connect With Us
                  </h2>
                </div>
                <div className="flex gap-3 mb-6">
                  {[
                    {
                      href: "https://facebook.com",
                      icon: Facebook,
                      label: "Facebook",
                    },
                    {
                      href: "https://instagram.com",
                      icon: Instagram,
                      label: "Instagram",
                    },
                    {
                      href: "https://wa.me/8801700000000",
                      icon: MessageCircle,
                      label: "WhatsApp",
                    },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-11 h-11 rounded-sm border flex items-center justify-center transition-all duration-300"
                      style={{
                        background: T.bg,
                        borderColor: `${T.gold}30`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = T.gold;
                        e.currentTarget.style.background = `${T.gold}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${T.gold}30`;
                        e.currentTarget.style.background = T.bg;
                      }}
                      aria-label={social.label}
                    >
                      <social.icon
                        className="w-4 h-4 transition-colors duration-300"
                        strokeWidth={1.5}
                        style={{ color: T.inkSoft }}
                      />
                    </a>
                  ))}
                </div>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  Receive exclusive collection previews, private offers, and
                  behind-the-scenes insights from our atelier.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="container-x pb-24 relative z-10">
        <ScrollReveal direction="scale">
          <div
            className="relative overflow-hidden rounded-sm p-10 md:p-16 text-center"
            style={{
              background: T.ink,
              border: `1px solid ${T.gold}30`,
              boxShadow: `0 24px 64px -24px rgba(28,22,18,0.5)`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(60% 80% at 50% 100%, ${T.gold}15, transparent 70%)`,
              }}
            />

            <div
              className="absolute inset-3 pointer-events-none rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
              aria-hidden
            />

            <div className="relative z-10">
              <h2
                className="mb-4 leading-[0.95] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 400,
                  color: T.bone,
                }}
              >
                Seeking{" "}
                <span
                  className="italic font-light"
                  style={{ color: T.goldBright }}
                >
                  immediate guidance?
                </span>
              </h2>
              <p
                className="max-w-lg mx-auto mb-8"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: T.inkSoft,
                }}
              >
                Our comprehensive guide addresses the most frequent inquiries
                regarding delivery protocols, return privileges, and Cash on
                Delivery.
              </p>
              <Link
                href="/faq"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)]"
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
                Consult the FAQ
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden
                >
                  <path
                    d="M1 5 H13 M9 1 L13 5 L9 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}