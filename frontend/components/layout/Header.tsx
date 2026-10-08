"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartButton } from "./CartButton";

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

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/track", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname === "/") return null;
  if (pathname?.startsWith("/admin")) return null;
  if (!mounted) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-[400] w-full"
      style={{
        background: scrolled ? `${T.bone}E6` : `${T.bone}00`,
        backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: `1px solid ${scrolled ? `${T.gold}30` : "transparent"}`,
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-none">
            <span
              className="text-xl font-semibold tracking-tight"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              BD
            </span>
          </div>
          <div className="flex flex-col leading-none pt-0.5">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-medium"
              style={{ color: T.ink }}
            >
              Maison
            </span>
            <span
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{ color: T.inkSoft }}
            >
              Est. 2026
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="group relative py-1">
                <span
                  className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
                  style={{
                    color: isActive ? T.gold : T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {l.label}
                </span>
                {/* Active underline */}
                <span
                  className="absolute bottom-0 left-1/2 h-px transition-all duration-500 ease-out"
                  style={{
                    width: isActive ? "100%" : "0%",
                    transform: isActive ? "translateX(-50%)" : "translateX(-50%)",
                    backgroundColor: T.gold,
                  }}
                />
                {/* Hover underline expands from center */}
                <span
                  className="absolute bottom-0 left-1/2 h-px w-0 group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out"
                  style={{ backgroundColor: T.gold }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <CartButton />

          <motion.button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden relative w-9 h-9 rounded-sm flex items-center justify-center transition-colors"
            style={{
              border: `1px solid ${T.gold}40`,
              background: open ? `${T.ink}10` : "transparent",
            }}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <X className="w-4 h-4" style={{ color: T.ink }} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu className="w-4 h-4" style={{ color: T.ink }} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: `${T.bone}F5`,
              backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${T.gold}30`,
            }}
          >
            <nav className="container-x py-6 space-y-1">
              {NAV_LINKS.map((l, i) => {
                const isActive = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3.5 group"
                      style={{ borderBottom: `1px dashed ${T.gold}30` }}
                    >
                      <span
                        className="text-[11px] tracking-[0.3em] uppercase transition-colors duration-300"
                        style={{
                          color: isActive ? T.gold : T.ink,
                          fontFamily: "var(--font-fraunces), Georgia, serif",
                        }}
                      >
                        {l.label}
                      </span>
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 14 10"
                        fill="none"
                        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                        style={{ color: T.gold }}
                      >
                        <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}