import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const product = await api.getProduct(params.slug);
    return {
      title: product?.name || "Product",
      description:
        product?.shortDescription || product?.description?.slice(0, 160),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  let product: Product | null = null;

  try {
    product = await api.getProduct(params.slug);
  } catch {
    product = null;
  }

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}