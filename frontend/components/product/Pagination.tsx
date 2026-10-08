"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  /** Build a /products URL for a given page, preserving all other filters. */
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  // Compute visible pages with ellipsis
  const pages: (number | "…")[] = [];
  const windowSize = 1;
  const showEllipsis = totalPages > 7;

  if (!showEllipsis) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - windowSize);
      i <= Math.min(totalPages - 1, currentPage + windowSize);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <motion.nav
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center justify-center gap-2 md:gap-3"
      aria-label="Pagination"
    >
      {/* Previous */}
      <Link
        href={buildUrl(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`group relative w-10 h-10 md:w-11 md:h-11 rounded-sm flex items-center justify-center transition-all duration-300 ${
          currentPage === 1 ? "opacity-40 pointer-events-none" : ""
        }`}
        style={{
          border: `1px solid ${
            currentPage === 1 ? `${T.gold}20` : `${T.gold}40`
          }`,
          color: currentPage === 1 ? T.inkSoft : T.ink,
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.borderColor = T.gold;
            e.currentTarget.style.background = `${T.gold}15`;
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.borderColor = `${T.gold}40`;
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <svg
          width="12"
          height="8"
          viewBox="0 0 14 10"
          fill="none"
          className="group-hover:-translate-x-0.5 transition-transform duration-300"
        >
          <path
            d="M13 5 H1 M5 1 L1 5 L5 9"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </Link>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-[14px] italic"
            style={{
              color: T.gold,
              fontFamily: "var(--font-fraunces), Georgia, serif",
            }}
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            className="min-w-10 h-10 md:min-w-11 md:h-11 px-3 rounded-sm flex items-center justify-center text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              background: p === currentPage ? T.ink : "transparent",
              color: p === currentPage ? T.goldLeaf : T.inkSoft,
              border: `1px solid ${
                p === currentPage ? T.gold : `${T.gold}30`
              }`,
            }}
            onMouseEnter={(e) => {
              if (p !== currentPage) {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.color = T.ink;
              }
            }}
            onMouseLeave={(e) => {
              if (p !== currentPage) {
                e.currentTarget.style.borderColor = `${T.gold}30`;
                e.currentTarget.style.color = T.inkSoft;
              }
            }}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      <Link
        href={buildUrl(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`group relative w-10 h-10 md:w-11 md:h-11 rounded-sm flex items-center justify-center transition-all duration-300 ${
          currentPage === totalPages ? "opacity-40 pointer-events-none" : ""
        }`}
        style={{
          border: `1px solid ${
            currentPage === totalPages ? `${T.gold}20` : `${T.gold}40`
          }`,
          color: currentPage === totalPages ? T.inkSoft : T.ink,
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.borderColor = T.gold;
            e.currentTarget.style.background = `${T.gold}15`;
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.borderColor = `${T.gold}40`;
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <svg
          width="12"
          height="8"
          viewBox="0 0 14 10"
          fill="none"
          className="group-hover:translate-x-0.5 transition-transform duration-300"
        >
          <path
            d="M1 5 H13 M9 1 L13 5 L9 9"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </Link>
    </motion.nav>
  );
}