"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { adminApi } from "@/lib/api";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface FormState {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  images: string[];
  costPrice: string;
  sellingPrice: string;
  discountPrice: string;
  tags: string;
  status: "active" | "draft" | "archived";
  isFeatured: boolean;
}

const initial: FormState = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  shortDescription: "",
  images: [""],
  costPrice: "",
  sellingPrice: "",
  discountPrice: "",
  tags: "",
  status: "active",
  isFeatured: false,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof FormState, value: any) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-slug when name changes
      if (key === "name" && !f.slug) next.slug = slugify(value);
      return next;
    });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const updateImage = (i: number, value: string) => {
    setForm((f) => {
      const images = [...f.images];
      images[i] = value;
      return { ...f, images };
    });
  };

  const addImage = () => {
    setForm((f) => ({ ...f, images: [...f.images, ""] }));
  };

  const removeImage = (i: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name required";
    if (!form.slug.trim()) errs.slug = "Slug required";
    if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = "Only lowercase, numbers, hyphens";
    if (!form.sku.trim()) errs.sku = "SKU required";
    if (!form.description.trim()) errs.description = "Description required";
    if (!form.costPrice || isNaN(Number(form.costPrice))) errs.costPrice = "Valid cost required";
    if (!form.sellingPrice || isNaN(Number(form.sellingPrice)))
      errs.sellingPrice = "Valid price required";
    if (Number(form.sellingPrice) < Number(form.costPrice))
      errs.sellingPrice = "Selling price must be ≥ cost";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        sku: form.sku.trim().toUpperCase(),
        description: form.description.trim(),
        shortDescription: form.shortDescription.trim() || undefined,
        images: form.images.filter((i) => i.trim()),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        status: form.status,
        isFeatured: form.isFeatured,
      };
      await adminApi.createProduct(payload);
      router.push("/admin/products");
    } catch (err: any) {
      setErrors({ submit: err?.message || "Failed to create product" });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2">
          Create
        </p>
        <h1
          className="text-gray-900"
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
          }}
        >
          New product
        </h1>
      </div>

      <motion.form
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
        >
          <h2 className="text-sm font-semibold text-gray-900">Basic info</h2>

          <Field
            label="Product name *"
            value={form.name}
            onChange={(v) => update("name", v)}
            error={errors.name}
            placeholder="Wireless Car Vacuum Cleaner"
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="Slug *"
              value={form.slug}
              onChange={(v) => update("slug", v)}
              error={errors.slug}
              placeholder="wireless-car-vacuum-cleaner"
              mono
            />
            <Field
              label="SKU *"
              value={form.sku}
              onChange={(v) => update("sku", v)}
              error={errors.sku}
              placeholder="CARVAC-001"
              mono
            />
          </div>

          <Field
            label="Short description"
            value={form.shortDescription}
            onChange={(v) => update("shortDescription", v)}
            placeholder="120W cordless vacuum with 6000Pa suction"
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Full description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              placeholder="Detailed product description..."
              className={`input-ltx resize-none ${
                errors.description ? "error" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.description}
              </p>
            )}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
        >
          <h2 className="text-sm font-semibold text-gray-900">Pricing (৳)</h2>

          <div className="grid sm:grid-cols-3 gap-5">
            <Field
              label="Cost price *"
              type="number"
              value={form.costPrice}
              onChange={(v) => update("costPrice", v)}
              error={errors.costPrice}
              placeholder="650"
            />
            <Field
              label="Selling price *"
              type="number"
              value={form.sellingPrice}
              onChange={(v) => update("sellingPrice", v)}
              error={errors.sellingPrice}
              placeholder="1299"
            />
            <Field
              label="Discount price"
              type="number"
              value={form.discountPrice}
              onChange={(v) => update("discountPrice", v)}
              placeholder="999"
            />
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-900">Images</h2>
          <p className="text-xs text-gray-500">
            Full URLs. First image is used as the thumbnail.
          </p>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="input-ltx flex-1"
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center flex-shrink-0"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs font-medium hover:border-gray-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add another image
          </button>
        </motion.div>

        {/* Meta */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Tags & status
          </h2>

          <Field
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={(v) => update("tags", v)}
            placeholder="car, vacuum, gadget"
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="input-ltx"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => update("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">Featured product</span>
              </label>
            </div>
          </div>
        </motion.div>

        {errors.submit && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <motion.div
          variants={fadeUp}
          className="flex gap-3"
        >
          <Link
            href="/admin/products"
            className="px-6 py-3.5 rounded-full border border-gray-200 text-gray-900 font-medium hover:border-gray-900 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors text-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create product</>
            )}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-ltx ${error ? "error" : ""}`}
        style={mono ? { fontFamily: "monospace" } : undefined}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}