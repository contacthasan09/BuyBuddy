"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="container-x pt-6 pb-4" aria-label="Breadcrumb">
      <ol
        className="flex items-center gap-2 text-xs text-gray-500 flex-wrap"
        style={{
          fontFamily: "var(--font-instrument), system-ui, sans-serif",
        }}
      >
        <li>
          <Link href="/" className="hover:text-cyan-700 transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-cyan-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 truncate max-w-[200px]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}