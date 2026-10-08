import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Shield, Truck, RotateCcw, Banknote } from "lucide-react";
import { api } from "@/lib/api";
import { formatBDT, getProductPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductActions } from "./ProductActions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Product | null = null;

  try {
    product = await api.getProduct(params.slug);
  } catch {
    product = null;
  }

  if (!product) notFound();

  const price = getProductPrice(product);
  const original = product.sellingPrice;
  const discount = getDiscountPercent(product);
  const stock = product.stock?.available ?? 0;
  const categoryName = typeof product.category === "object" && product.category ? product.category.name : "";

  return (
    <div className="container-x py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-cyan-deep">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-cyan-deep">Products</Link>
        {categoryName && (<><ChevronRight className="w-4 h-4" /><span className="text-gray-700">{categoryName}</span></>)}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="aspect-square rounded-3xl bg-gray-50 overflow-hidden border border-gray-100 mb-4">
            <img src={product.images?.[0] || "https://placehold.co/800x800?text=Product"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {categoryName && <p className="text-sm font-semibold text-cyan-deep uppercase tracking-wider mb-2">{categoryName}</p>}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl md:text-4xl font-bold text-cyan-deep">{formatBDT(price)}</span>
            {discount > 0 && (<>
              <span className="text-xl text-gray-400 line-through">{formatBDT(original)}</span>
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">-{discount}%</span>
            </>)}
          </div>

          {product.shortDescription && <p className="text-gray-600 leading-relaxed mb-6">{product.shortDescription}</p>}

          <div className="mb-6">
            {stock > 0 ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" />In Stock ({stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500" />Out of Stock
              </span>
            )}
          </div>

          <ProductActions product={product} />

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
            {[
              { icon: Banknote, label: "Cash on Delivery" },
              { icon: Truck, label: "Fast Delivery" },
              { icon: Shield, label: "Quality Checked" },
              { icon: RotateCcw, label: "7-Day Returns" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-gray-600">
                <b.icon className="w-4 h-4 text-cyan-deep" />{b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 pt-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
        <div className="max-w-3xl">
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </div>
        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden max-w-2xl">
              {product.specifications.map((spec, i) => (
                <div key={i} className={`grid grid-cols-2 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <span className="font-semibold text-gray-700">{spec.key}</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
