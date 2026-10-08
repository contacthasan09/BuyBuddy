"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/types";
import { fadeUp, EASE } from "@/lib/motion";
import { CategoryChip } from "@/components/product/CategoryChip";

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

const SORTS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
] as const;

interface ProductFiltersProps {
  categories: Category[];
  currentSearch: string;
  currentCategory: string;
  currentSort: "newest" | "price_asc" | "price_desc" | "name_asc";
  total: number;
}

export function ProductFilters({
  categories,
  currentSearch,
  currentCategory,
  currentSort,
  total,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateParam = (
    key: string,
    value: string | null,
    resetPage = true
  ) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (resetPage) params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", searchInput.trim() || null);
  };

  const clearSearch = () => {
    setSearchInput("");
    updateParam("search", null);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-30 w-full"
      style={{
        background: `${T.bone}E6`,
        backdropFilter: "blur(16px) saturate(140%)",
        borderBottom: `1px solid ${T.gold}30`,
      }}
    >
      <div className="container-x py-4 md:py-5">
        {/* ── Row 1: Search + Sort ── */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
          {/* Search */}
          <form onSubmit={onSubmit} className="flex-1 relative">
            <Search 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
              style={{ color: T.gold }} 
              strokeWidth={1.5} 
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search the collection..."
              className="w-full pl-10 pr-10 py-3 rounded-sm outline-none transition-all duration-300"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: "transparent",
                border: `1px solid ${T.gold}40`,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = T.gold;
                e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${T.gold}40`;
                e.target.style.boxShadow = "none";
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm flex items-center justify-center transition-colors"
                style={{ color: T.inkSoft }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.wine)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${T.inkSoft}`)}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </form>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal
              className="w-4 h-4 flex-shrink-0 hidden md:block"
              strokeWidth={1.5}
              style={{ color: T.gold }}
            />
            <div className="relative flex-1 md:flex-none">
              <select
                value={currentSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full md:w-auto appearance-none px-4 py-3 rounded-sm outline-none cursor-pointer transition-all duration-300 pr-9"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  background: "transparent",
                  border: `1px solid ${T.gold}40`,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = T.gold;
                  e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${T.gold}40`;
                  e.target.style.boxShadow = "none";
                }}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#F7F1E3] text-[#1C1612]">
                    {s.label}
                  </option>
                ))}
              </select>
              {/* Custom chevron */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1 L5 5 L9 1" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Category chips ── */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
            <CategoryChip
              label="All"
              active={!currentCategory}
              onClick={() => updateParam("category", null)}
            />
            {categories.map((cat) => (
              <CategoryChip
                key={cat._id}
                label={cat.name}
                active={currentCategory === cat._id}
                onClick={() => updateParam("category", cat._id)}
              />
            ))}
          </div>
        )}

        {/* ── Row 3: Active filter summary + count ── */}
        {(currentSearch || currentCategory) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE.expo }}
            className="flex flex-wrap items-center gap-3 mt-4"
          >
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {total} piece{total !== 1 ? "s" : ""} found
            </span>
            
            {currentSearch && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
                style={{
                  background: T.bg,
                  border: `1px solid ${T.gold}30`,
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Search: {currentSearch}
                <button
                  onClick={clearSearch}
                  className="hover:text-[color:var(--wine)] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" strokeWidth={1.5} />
                </button>
              </span>
            )}
            
            {currentCategory && (
              <button
                onClick={() => updateParam("category", null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors"
                style={{
                  background: T.bg,
                  border: `1px solid ${T.gold}30`,
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.wine;
                  e.currentTarget.style.color = T.wine;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${T.gold}30`;
                  e.currentTarget.style.color = T.ink;
                }}
              >
                Category
                <X className="w-3 h-3" strokeWidth={1.5} />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Loading bar */}
      {isPending && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: EASE.expo }}
          className="h-0.5 origin-left"
          style={{ background: T.gold }}
        />
      )}
    </motion.div>
  );
}