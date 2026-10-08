import { connectDB } from "../src/config/database";
import { Product } from "../src/modules/products/product.model";
import { Category } from "../src/modules/categories/category.model";
import { Inventory } from "../src/modules/inventory/inventory.model";
import mongoose from "mongoose";

async function run() {
  await connectDB();

  // ═══════════════════════════════════════════════════════
  // CATEGORIES — 4 real categories for the LTXScene slots
  // ═══════════════════════════════════════════════════════
  const categoriesData = [
    {
      name: "Gadgets",
      slug: "gadgets",
      description: "Smart electronics and everyday tech essentials",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&auto=format&fit=crop",
      isActive: true,
    },
    {
      name: "Home",
      slug: "home",
      description: "Quality pieces to upgrade your everyday space",
      image:
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80&auto=format&fit=crop",
      isActive: true,
    },
    {
      name: "Clothing",
      slug: "clothing",
      description: "Everyday wear, thoughtfully made",
      image:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80&auto=format&fit=crop",
      isActive: true,
    },
    {
      name: "Beauty",
      slug: "beauty",
      description: "Skincare and self-care, curated",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop",
      isActive: true,
    },
  ];

  const categories: Record<string, any> = {};
  for (const c of categoriesData) {
    const cat = await Category.findOneAndUpdate(
      { slug: c.slug },
      c,
      { upsert: true, new: true }
    );
    categories[c.slug] = cat;
    console.log(`✓ Category: ${cat.name}`);
  }

  // ═══════════════════════════════════════════════════════
  // PRODUCTS — 11 items across 4 categories
  // Images: Unsplash + Cloudinary (all network URLs)
  // ═══════════════════════════════════════════════════════
  const products = [
    // ── GADGETS ───────────────────────────────────────────
    {
      name: "Wireless Car Vacuum Cleaner",
      slug: "wireless-car-vacuum-cleaner",
      sku: "CARVAC-001",
      description:
        "Powerful 120W cordless vacuum with 6000Pa suction. Perfect for car interiors, home, and office. Rechargeable 6000mAh battery, HEPA filter, multiple nozzles included.",
      shortDescription: "120W cordless vacuum with 6000Pa suction",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["gadgets"]._id,
      costPrice: 650,
      sellingPrice: 1299,
      discountPrice: 999,
      tags: ["car", "vacuum", "gadget", "cordless"],
      status: "active" as const,
      isFeatured: true,
      specifications: [
        { key: "Suction", value: "6000Pa" },
        { key: "Power", value: "120W" },
        { key: "Battery", value: "6000mAh" },
        { key: "Charging", value: "USB-C" },
      ],
    },
    {
      name: "Bluetooth Wireless Earbuds Pro",
      slug: "bluetooth-wireless-earbuds-pro",
      sku: "BUDS-001",
      description:
        "Premium wireless earbuds with active noise cancellation, 30-hour battery life, and IPX5 water resistance. Perfect for workouts, calls, and music on the go.",
      shortDescription: "ANC earbuds · 30-hour battery · IPX5",
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["gadgets"]._id,
      costPrice: 850,
      sellingPrice: 1799,
      discountPrice: 1399,
      tags: ["earbuds", "audio", "bluetooth", "gadget"],
      status: "active" as const,
      isFeatured: true,
      specifications: [
        { key: "Battery", value: "30 hours" },
        { key: "ANC", value: "Active noise cancellation" },
        { key: "Rating", value: "IPX5" },
      ],
    },
    {
      name: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      sku: "WATCH-001",
      description:
        "Fitness tracker with heart rate monitor, SpO2, sleep tracking, and 14-day battery. Waterproof, with full-color AMOLED display.",
      shortDescription: "AMOLED · Heart rate · 14-day battery",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["gadgets"]._id,
      costPrice: 1450,
      sellingPrice: 2899,
      discountPrice: 2299,
      tags: ["watch", "fitness", "smart", "gadget"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Display", value: "1.4in AMOLED" },
        { key: "Battery", value: "14 days" },
        { key: "Water", value: "IP68" },
      ],
    },

    // ── HOME ──────────────────────────────────────────────
    {
      name: "LED Rechargeable Table Lamp",
      slug: "led-rechargeable-table-lamp",
      sku: "LAMP-001",
      description:
        "Touch-controlled LED table lamp with 3 brightness levels. Rechargeable, USB-C, perfect for study, bedroom, and reading.",
      shortDescription: "Touch-control · USB-C rechargeable",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["home"]._id,
      costPrice: 350,
      sellingPrice: 799,
      discountPrice: 649,
      tags: ["lamp", "led", "home", "lighting"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Brightness", value: "3 levels" },
        { key: "Charging", value: "USB-C" },
        { key: "Battery", value: "4000mAh" },
      ],
    },
    {
      name: "Minimal Ceramic Mug Set",
      slug: "minimal-ceramic-mug-set",
      sku: "MUG-001",
      description:
        "Set of 4 handcrafted ceramic mugs with a matte finish. Dishwasher and microwave safe. Perfect for coffee, tea, and hot chocolate.",
      shortDescription: "Set of 4 · Matte finish · Dishwasher safe",
      images: [
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["home"]._id,
      costPrice: 480,
      sellingPrice: 1099,
      tags: ["mug", "ceramic", "home", "kitchen"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Quantity", value: "4 mugs" },
        { key: "Capacity", value: "350ml each" },
      ],
    },
    {
      name: "Woven Storage Basket",
      slug: "woven-storage-basket",
      sku: "BASKET-001",
      description:
        "Handwoven natural jute storage basket. Perfect for organizing blankets, toys, laundry, or as a decorative planter cover.",
      shortDescription: "Natural jute · Multi-purpose storage",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["home"]._id,
      costPrice: 320,
      sellingPrice: 749,
      tags: ["basket", "jute", "home", "storage"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Material", value: "Natural jute" },
        { key: "Size", value: "35cm × 30cm" },
      ],
    },

    // ── CLOTHING ──────────────────────────────────────────
    {
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-tshirt",
      sku: "TSHIRT-001",
      description:
        "100% organic cotton t-shirt with a modern fit. Breathable, pre-shrunk, and available in multiple colors. Made in Bangladesh.",
      shortDescription: "100% organic cotton · Modern fit",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["clothing"]._id,
      costPrice: 280,
      sellingPrice: 699,
      discountPrice: 549,
      tags: ["tshirt", "cotton", "clothing", "essential"],
      status: "active" as const,
      isFeatured: true,
      specifications: [
        { key: "Material", value: "100% organic cotton" },
        { key: "Fit", value: "Modern / Regular" },
        { key: "Origin", value: "Made in Bangladesh" },
      ],
    },
    {
      name: "Canvas Tote Bag",
      slug: "canvas-tote-bag",
      sku: "TOTE-001",
      description:
        "Heavy-duty canvas tote bag with reinforced handles. Perfect for groceries, books, or everyday carry. Machine washable.",
      shortDescription: "Heavy canvas · Reinforced handles",
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["clothing"]._id,
      costPrice: 220,
      sellingPrice: 599,
      tags: ["bag", "tote", "canvas", "clothing"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Material", value: "12oz canvas" },
        { key: "Size", value: "40cm × 38cm" },
      ],
    },
    {
      name: "Merino Wool Scarf",
      slug: "merino-wool-scarf",
      sku: "SCARF-001",
      description:
        "Soft 100% merino wool scarf in a timeless weave. Warm without bulk, breathable, and naturally odor-resistant.",
      shortDescription: "100% merino wool · Warm & breathable",
      images: [
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["clothing"]._id,
      costPrice: 850,
      sellingPrice: 1899,
      discountPrice: 1499,
      tags: ["scarf", "wool", "winter", "clothing"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Material", value: "100% merino wool" },
        { key: "Size", value: "180cm × 35cm" },
      ],
    },

    // ── BEAUTY ────────────────────────────────────────────
    {
      name: "Vitamin C Brightening Serum",
      slug: "vitamin-c-brightening-serum",
      sku: "SERUM-001",
      description:
        "20% vitamin C serum with hyaluronic acid. Brightens dull skin, fades dark spots, and boosts collagen. Suitable for all skin types.",
      shortDescription: "20% Vitamin C · Hyaluronic acid",
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["beauty"]._id,
      costPrice: 620,
      sellingPrice: 1399,
      discountPrice: 1099,
      tags: ["serum", "vitamin-c", "skincare", "beauty"],
      status: "active" as const,
      isFeatured: true,
      specifications: [
        { key: "Volume", value: "30ml" },
        { key: "Active", value: "20% Vitamin C" },
        { key: "Type", value: "All skin types" },
      ],
    },
    {
      name: "Nourishing Body Lotion",
      slug: "nourishing-body-lotion",
      sku: "LOTION-001",
      description:
        "Rich, fast-absorbing body lotion with shea butter and vitamin E. Locks in moisture for 24 hours without feeling greasy.",
      shortDescription: "Shea butter · 24-hour moisture",
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=80&auto=format&fit=crop",
      ],
      category: categories["beauty"]._id,
      costPrice: 420,
      sellingPrice: 899,
      tags: ["lotion", "body", "moisture", "beauty"],
      status: "active" as const,
      isFeatured: false,
      specifications: [
        { key: "Volume", value: "250ml" },
        { key: "Key ingredient", value: "Shea butter" },
      ],
    },
  ];

  for (const p of products) {
    const product = await Product.findOneAndUpdate(
      { sku: p.sku },
      p,
      { upsert: true, new: true }
    );

    await Inventory.findOneAndUpdate(
      { product: product._id },
      {
        product: product._id,
        physical: 50,
        reserved: 0,
        available: 50,
        lowStockThreshold: 5,
      },
      { upsert: true }
    );

    console.log(`✓ Product: ${product.name} (stock: 50)`);
  }

  console.log("");
  console.log("✅ Seed complete");
  console.log(`   Categories: ${Object.keys(categories).length}`);
  console.log(`   Products: ${products.length}`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});