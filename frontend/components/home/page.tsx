import Link from "next/link";
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Banknote,
  Star,
  Quote,
  Package,
  Users,
  TrendingUp,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatBDT, getProductPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types";
import Hero from "@/components/home/LTXScene";

export const dynamic = "force-dynamic";

const TRUST_BADGES = [
  { icon: Truck, title: "Fast Delivery", subtitle: "2-4 days across BD" },
  { icon: Banknote, title: "Cash on Delivery", subtitle: "Pay when you receive" },
  { icon: Shield, title: "Quality Checked", subtitle: "Verified products" },
  { icon: RotateCcw, title: "7-Day Returns", subtitle: "No questions asked" },
];

const MARQUEE_ITEMS = [
  "Free delivery over ৳2000",
  "Cash on Delivery",
  "7-day easy returns",
  "Quality checked",
  "Fast shipping",
  "Trusted by 10,000+ customers",
  "Made in Bangladesh",
];

const STATS = [
  { icon: Package, value: "10,000+", label: "Orders delivered" },
  { icon: Users, value: "8,500+", label: "Happy customers" },
  { icon: TrendingUp, value: "4.8/5", label: "Average rating" },
  { icon: CheckCircle2, value: "99%", label: "On-time delivery" },
];

const TESTIMONIALS = [
  {
    name: "Rahim Ahmed",
    location: "Dhaka",
    quote:
      "Ordered a wireless vacuum, arrived in 2 days. Quality was exactly as described. COD made it super easy.",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    location: "Chattogram",
    quote:
      "Amazing service. They called before delivery to confirm timing. Product was packed really well.",
    rating: 5,
  },
  {
    name: "Karim Hossain",
    location: "Sylhet",
    quote:
      "First time ordering online. The 7-day return policy gave me confidence. Highly recommend BD Store.",
    rating: 5,
  },
];

export default async function HomePage() {
  let products: Product[] = [];
  let categories: any[] = [];

  try {
    const [productsRes, catsRes] = await Promise.all([
      api.getProducts({ limit: 8, sort: "newest" }),
      api.getCategories(),
    ]);
    products = productsRes?.items || [];
    categories = Array.isArray(catsRes) ? catsRes : [];
  } catch (err) {
    console.error("Failed to load home data:", err);
  }

  const featured = products[0];
  const featuredImage =
    featured?.images?.[0] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80&auto=format&fit=crop";

  return (
    <div className="bg-white">
      {/* 1. HERO */}
      <Hero />

      {/* 2. MARQUEE */}
      <MarqueeStrip />

      {/* 3. TRUST BADGES */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-x py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <badge.icon
                    className="w-5 h-5 text-gray-900"
                    strokeWidth={1.6}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">
                    {badge.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES */}
      {categories.length > 0 && (
        <section className="container-x py-16 md:py-20">
          <SectionHeader
            eyebrow="Browse"
            title="Shop by category"
            subtitle="Find exactly what you need"
            href="/products"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10">
            {categories.slice(0, 4).map((cat, i) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-900 transition-all"
                style={{
                  background: [
                    "linear-gradient(135deg, #f4f6f8 0%, #e5e9ee 100%)",
                    "linear-gradient(135deg, #f9f4f0 0%, #ede4dc 100%)",
                    "linear-gradient(135deg, #f0f4f8 0%, #dde6f0 100%)",
                    "linear-gradient(135deg, #f6f4f9 0%, #e8e4f0 100%)",
                  ][i % 4],
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500">
                    {String(i + 1).padStart(2, "0")} / Category
                  </span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Shop now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. NEW ARRIVALS */}
      <section className="bg-gray-50/50 py-16 md:py-20">
        <div className="container-x">
          <SectionHeader
            eyebrow="Fresh drop"
            title="New arrivals"
            subtitle="The latest additions to our store"
            href="/products?sort=newest"
          />

          {products.length === 0 ? (
            <EmptyProducts />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. ⭐ FEATURED COLLECTION */}
      {featured && (
        <section className="relative w-full min-h-[520px] md:min-h-[620px] overflow-hidden bg-black">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${featuredImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                "radial-gradient(70% 90% at 15% 50%, rgba(62,200,228,0.16), transparent 65%)",
            }}
          />

          <div className="relative z-10 container-x py-16 md:py-24 flex items-center min-h-[520px] md:min-h-[620px]">
            <div className="max-w-xl text-white">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-5">
                Featured product
              </p>
              <h2 className="text-3xl md:text-6xl font-semibold tracking-tight leading-[1.03] mb-6">
                {featured.name}
              </h2>
              {featured.shortDescription && (
                <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg mb-10">
                  {featured.shortDescription}
                </p>
              )}
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {formatBDT(getProductPrice(featured))}
                </span>
                {getDiscountPercent(featured) > 0 && (
                  <span className="text-lg text-white/50 line-through">
                    {formatBDT(featured.sellingPrice)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/product/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-gray-900 font-medium tracking-tight hover:bg-gray-100 transition-colors"
                >
                  Buy now — COD
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white font-medium tracking-tight hover:border-white/60 hover:bg-white/5 transition-all"
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. STATS */}
      <section className="container-x py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <stat.icon
                  className="w-5 h-5 text-gray-900"
                  strokeWidth={1.6}
                />
              </div>
              <p className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-[11px] md:text-xs text-gray-500 tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="bg-gray-900 text-white py-16 md:py-20">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/60 mb-3">
              Simple process
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-white/60">
              Order in three steps. No account. No online payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Choose product",
                desc: "Browse the catalog and pick what you love.",
              },
              {
                step: "02",
                title: "Place order",
                desc: "Enter name, phone, address. Takes 30 seconds.",
              },
              {
                step: "03",
                title: "Pay on delivery",
                desc: "Cash when the courier hands over your package.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl md:text-7xl font-serif italic text-white/15 mb-6 leading-none">
                  {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="container-x py-16 md:py-20">
        <SectionHeader
          eyebrow="What customers say"
          title="Loved by thousands"
          subtitle="Real reviews from real buyers"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-7 rounded-3xl border border-gray-100 bg-white flex flex-col"
            >
              <Quote
                className="w-6 h-6 text-gray-300 mb-4"
                strokeWidth={1.5}
              />
              <p className="text-gray-700 leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-gray-900 text-gray-900"
                  />
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="container-x pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-[32px] bg-gray-900 text-white p-10 md:p-20 text-center">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 100%, rgba(62,200,228,0.18), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/50 mb-4">
              Ready when you are
            </p>
            <h2 className="text-3xl md:text-6xl font-semibold tracking-tight mb-6 max-w-3xl mx-auto leading-[1.05]">
              Order in 30 seconds.
              <br />
              <span className="font-serif italic text-white/80">
                Pay when it arrives.
              </span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-10">
              Fast delivery across all 64 districts of Bangladesh.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors tracking-tight"
            >
              Start shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Section header ─────────────────────────── */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-3">
          {eyebrow}
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-500 mt-3 text-base">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors whitespace-nowrap flex-shrink-0"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

/* ── Marquee strip ──────────────────────────── */
function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section className="bg-gray-900 text-white py-3.5 overflow-hidden border-y border-gray-800">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-white/70 flex items-center gap-12"
          >
            {item}
            <span className="text-white/25" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 45s linear infinite;
          will-change: transform;
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (max-width: 640px) {
          .marquee-track {
            animation-duration: 22s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ── Empty products ─────────────────────────── */
function EmptyProducts() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 mt-10">
      <Package
        className="w-12 h-12 text-gray-300 mx-auto mb-4"
        strokeWidth={1.5}
      />
      <p className="text-gray-500">No products yet. Check back soon!</p>
    </div>
  );
}

/* ── Product card ───────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const price = getProductPrice(product);
  const original = product.sellingPrice;
  const discount = getDiscountPercent(product);
  const stock = product.stock?.available ?? 0;
  const image =
    product.images?.[0] || "https://placehold.co/600x600?text=Product";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-900 transition-all duration-300"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[11px] font-semibold tracking-wider">
            −{discount}%
          </span>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
              Sold out
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] text-sm md:text-[15px] tracking-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            {formatBDT(price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatBDT(original)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}