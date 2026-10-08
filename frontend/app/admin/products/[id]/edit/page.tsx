"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, X, Trash2 } from "lucide-react";
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<FormState>({
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    adminApi
      .getProduct(id)
      .then((p: any) => {
        setForm({
          name: p.name || "",
          slug: p.slug || "",
          sku: p.sku || "",
          description: p.description || "",
          shortDescription: p.shortDescription || "",
          images:
            Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : [""],
          costPrice: p.costPrice != null ? String(p.costPrice) : "",
          sellingPrice: p.sellingPrice != null ? String(p.sellingPrice) : "",
          discountPrice:
            p.discountPrice != null ? String(p.discountPrice) : "",
          tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
          status: p.status || "active",
          isFeatured: !!p.isFeatured,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key: keyof FormState, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
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
    if (!/^[a-z0-9-]+$/.test(form.slug))
      errs.slug = "Only lowercase, numbers, hyphens";
    if (!form.sku.trim()) errs.sku = "SKU required";
    if (!form.description.trim()) errs.description = "Description required";
    if (!form.costPrice || isNaN(Number(form.costPrice)))
      errs.costPrice = "Valid cost required";
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
      await adminApi.updateProduct(id, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        sku: form.sku.trim().toUpperCase(),
        description: form.description.trim(),
        shortDescription: form.shortDescription.trim() || undefined,
        images: form.images.filter((i) => i.trim()),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        status: form.status,
        isFeatured: form.isFeatured,
      });
      router.push("/admin/products");
    } catch (err: any) {
      setErrors({ submit: err?.message || "Failed to update" });
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteProduct(id);
      router.push("/admin/products");
    } catch (err: any) {
      setErrors({ submit: err?.message || "Failed to delete" });
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2">
            Edit
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
            {form.name || "Product"}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
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
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="Slug *"
              value={form.slug}
              onChange={(v) => update("slug", v)}
              error={errors.slug}
              mono
            />
            <Field
              label="SKU *"
              value={form.sku}
              onChange={(v) => update("sku", v)}
              error={errors.sku}
              mono
            />
          </div>

          <Field
            label="Short description"
            value={form.shortDescription}
            onChange={(v) => update("shortDescription", v)}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Full description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
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
            />
            <Field
              label="Selling price *"
              type="number"
              value={form.sellingPrice}
              onChange={(v) => update("sellingPrice", v)}
              error={errors.sellingPrice}
            />
            <Field
              label="Discount price"
              type="number"
              value={form.discountPrice}
              onChange={(v) => update("discountPrice", v)}
            />
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-900">Images</h2>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="https://..."
                className="input-ltx flex-1"
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center flex-shrink-0"
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
            Add image
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
                <span className="text-sm text-gray-700">
                  Featured product
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {errors.submit && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <motion.div variants={fadeUp} className="flex gap-3">
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
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </motion.div>
      </motion.form>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => !deleting && setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-3xl bg-white border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete product?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              This cannot be undone. Existing orders will keep a snapshot of
              the product.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="flex-1 px-5 py-3 rounded-full border border-gray-200 text-gray-900 font-medium hover:border-gray-900 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60 transition-colors text-sm"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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