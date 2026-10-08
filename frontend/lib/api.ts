/* ═══════════════════════════════════════════════════════
   BD STORE — API CLIENT
   ═══════════════════════════════════════════════════════ */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ═══════════════════════════════════════════════════════
   URL RESOLVER
   ═══════════════════════════════════════════════════════
   With NEXT_PUBLIC_API_URL set to an absolute URL, both
   client and server can use it directly. If someone sets
   it to a relative path ("/api"), the client can still use
   it (browser resolves against origin) but the server
   cannot — so we fall back to BACKEND_URL and throw loudly
   if neither works.
*/
function resolveUrl(path: string): string {
  const base = API_URL;

  // Absolute base — works everywhere
  if (base.startsWith("http")) {
    return `${base}${path}`;
  }

  // Relative base — client can handle it
  if (typeof window !== "undefined") {
    return `${base}${path}`;
  }

  // Server + relative base → need BACKEND_URL
  const backend = process.env.BACKEND_URL;
  if (!backend || !backend.startsWith("http")) {
    throw new Error(
      `Cannot resolve URL "${path}": NEXT_PUBLIC_API_URL="${base}" is relative and BACKEND_URL is not set to an absolute URL. ` +
        `Fix .env.local (set NEXT_PUBLIC_API_URL=http://localhost:5000/api or BACKEND_URL=http://localhost:5000/api).`
    );
  }
  const stripped = base.replace(/^\/api/, "");
  return `${backend}${stripped}${path}`;
}

/* ═══════════════════════════════════════════════════════
   GENERIC REQUEST
   ═══════════════════════════════════════════════════════ */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = resolveUrl(path);

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server error (${res.status})`);
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }

  return json.data as T;
}

/* ═══════════════════════════════════════════════════════
   ADMIN AUTH
   ═══════════════════════════════════════════════════════ */
export const adminAuth = {
  isLoggedIn: (): boolean => {
    if (typeof window === "undefined") return false;
    if (document.cookie.includes("bd_admin_hint=1")) return true;
    return localStorage.getItem("bd_admin_hint") === "1";
  },

  setHint: () => {
    if (typeof window === "undefined") return;
    const maxAge = 7 * 24 * 60 * 60;
    const secure = location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `bd_admin_hint=1; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;

    if (!document.cookie.includes("bd_admin_hint=1")) {
      document.cookie = `bd_admin_hint=1; path=/; max-age=${maxAge}`;
    }

    try {
      localStorage.setItem("bd_admin_hint", "1");
    } catch {}
  },

  clearHint: () => {
    if (typeof window === "undefined") return;
    document.cookie = "bd_admin_hint=; path=/; max-age=0; SameSite=Lax";
    try {
      localStorage.removeItem("bd_admin_hint");
    } catch {}
  },
};

/* ═══════════════════════════════════════════════════════
   AUTHENTICATED REQUEST
   ═══════════════════════════════════════════════════════ */
async function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = resolveUrl(path);

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    adminAuth.clearHint();
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/admin/login")
    ) {
      window.location.href = "/admin/login?reason=expired";
    }
    throw new Error("Session expired. Please login again.");
  }

  if (res.status === 423) {
    throw new Error("Account temporarily locked. Try again in 15 minutes.");
  }

  if (res.status === 429) {
    throw new Error("Too many requests. Please slow down.");
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server error (${res.status})`);
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }

  return json.data as T;
}

/* ═══════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════ */
export const api = {
  health: () => request<{ status: string }>("/health"),

  getSettings: () => request<Record<string, any>>("/settings"),

  getCategories: () => request<any[]>("/categories"),

  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
    sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  }) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
      });
    }
    const query = qs.toString();
    return request<any>(`/products${query ? `?${query}` : ""}`);
  },

  getProduct: (slug: string) => request<any>(`/products/${slug}`),

  createOrder: (body: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    district: string;
    area?: string;
    address: string;
    note?: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: "COD";
  }) =>
    request<any>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  trackOrder: (invoice: string, phone: string) =>
    request<{ order: any; history: any[] }>(
      `/orders/track?invoice=${encodeURIComponent(
        invoice
      )}&phone=${encodeURIComponent(phone)}`
    ),

  lookupCustomer: (phone: string) =>
    request<{ name: string; email?: string; address?: any } | null>(
      "/customers/lookup",
      {
        method: "POST",
        body: JSON.stringify({ phone }),
      }
    ),

  /* ═══════════════════════════════════════════════════════
     REVIEWS
     ═══════════════════════════════════════════════════════ */
  getProductReviews: (
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      sort?: "newest" | "helpful" | "rating_high" | "rating_low";
    }
  ) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qs.append(k, String(v));
      });
    }
    const query = qs.toString();
    return request<{
      items: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      summary: {
        average: number;
        total: number;
        distribution: {
          5: number;
          4: number;
          3: number;
          2: number;
          1: number;
        };
      };
    }>(`/reviews/product/${productId}${query ? `?${query}` : ""}`);
  },

  getReviewSummary: (productId: string) =>
    request<{ average: number; total: number }>(
      `/reviews/product/${productId}/summary`
    ),

  createReview: (data: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }) =>
    request<any>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markReviewHelpful: (reviewId: string) =>
    request<any>(`/reviews/${reviewId}/helpful`, { method: "POST" }),
};

/* ═══════════════════════════════════════════════════════
   ADMIN API
   ═══════════════════════════════════════════════════════ */
export const adminApi = {
  /* ── Auth ─────────────────────────────────────────── */
  login: async (
    email: string,
    password: string
  ): Promise<
    | { token: string; admin: any }
    | { requires2FA: true; tempToken: string; email: string }
  > => {
    const url = resolveUrl("/admin/auth/login");
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let json: any;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Server error (${res.status})`);
    }

    if (res.status === 423) {
      throw new Error("Account temporarily locked. Try again in 15 minutes.");
    }

    if (res.status === 429) {
      throw new Error(
        "Too many login attempts. Please try again after 15 minutes."
      );
    }

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Login failed");
    }

    if (json.data.requires2FA) {
      return json.data;
    }

    adminAuth.setHint();
    return json.data;
  },

  verify2FA: async (
    tempToken: string,
    code: string
  ): Promise<{ token: string; admin: any }> => {
    const url = resolveUrl("/admin/auth/verify-2fa");
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tempToken, code }),
    });

    let json: any;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Server error (${res.status})`);
    }

    if (res.status === 429) {
      throw new Error("Too many attempts. Please try again later.");
    }

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Invalid 2FA code");
    }

    adminAuth.setHint();
    return json.data;
  },

  logout: async () => {
    try {
      const url = resolveUrl("/admin/auth/logout");
      await fetch(url, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      adminAuth.clearHint();
    }
  },

  me: () => authRequest<any>("/admin/auth/me"),

  /* ── 2FA ──────────────────────────────────────────── */
  setup2FA: () =>
    authRequest<{ secret: string; qrCode: string; otpauthUrl: string }>(
      "/admin/auth/2fa/setup",
      { method: "POST" }
    ),

  enable2FA: (secret: string, token: string) =>
    authRequest<{ backupCodes: string[] }>("/admin/auth/2fa/enable", {
      method: "POST",
      body: JSON.stringify({ secret, token }),
    }),

  disable2FA: (password: string, token: string) =>
    authRequest<null>("/admin/auth/2fa/disable", {
      method: "POST",
      body: JSON.stringify({ password, token }),
    }),

  /* ── Sessions ─────────────────────────────────────── */
  listSessions: () =>
    authRequest<
      {
        _id: string;
        ip?: string;
        userAgent?: string;
        lastUsedAt: string;
        expiresAt: string;
        createdAt: string;
      }[]
    >("/admin/auth/sessions"),

  revokeSession: (sessionId: string) =>
    authRequest<null>(`/admin/auth/sessions/${sessionId}`, {
      method: "DELETE",
    }),

  revokeAllSessions: () =>
    authRequest<null>("/admin/auth/sessions/revoke-all", {
      method: "POST",
    }),

  /* ── Orders ───────────────────────────────────────── */
  listOrders: (params?: Record<string, string | number>) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return authRequest<any>(`/admin/orders${qs}`);
  },

  getOrder: (id: string) => authRequest<any>(`/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string, note?: string) =>
    authRequest<any>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),

  /* ── Products ─────────────────────────────────────── */
  listProducts: (params?: Record<string, string | number>) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return authRequest<any>(`/admin/products${qs}`);
  },

  getProduct: (id: string) => authRequest<any>(`/admin/products/${id}`),

  createProduct: (data: any) =>
    authRequest<any>("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    authRequest<any>(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    authRequest<any>(`/admin/products/${id}`, { method: "DELETE" }),

  /* ── Categories ───────────────────────────────────── */
  listCategories: () => authRequest<any[]>("/admin/categories"),
  createCategory: (data: any) =>
    authRequest<any>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: any) =>
    authRequest<any>(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    authRequest<any>(`/admin/categories/${id}`, { method: "DELETE" }),

  /* ── Inventory ────────────────────────────────────── */
  listInventory: () => authRequest<any[]>("/admin/inventory"),
  listInventoryTransactions: (productId?: string) =>
    authRequest<any[]>(
      `/admin/inventory/transactions${
        productId ? `?productId=${productId}` : ""
      }`
    ),
  addStock: (productId: string, quantity: number, note?: string) =>
    authRequest<any>("/admin/inventory/add-stock", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, note }),
    }),

  /* ── Shipments ────────────────────────────────────── */
  createShipment: (orderId: string) =>
    authRequest<any>("/admin/shipments/create", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),
  refreshShipment: (orderId: string) =>
    authRequest<any>(`/admin/shipments/refresh/${orderId}`),
  getBalance: () =>
    authRequest<{ balance: number }>("/admin/shipments/balance"),
  createReturn: (orderId: string, reason?: string) =>
    authRequest<any>("/admin/shipments/returns", {
      method: "POST",
      body: JSON.stringify({ orderId, reason }),
    }),

  /* ── Customers ────────────────────────────────────── */
  listCustomers: () => authRequest<any[]>("/admin/customers"),
  getCustomer: (id: string) => authRequest<any>(`/admin/customers/${id}`),
  updateCustomer: (id: string, data: any) =>
    authRequest<any>(`/admin/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /* ── Settings ─────────────────────────────────────── */
  getSettings: () => authRequest<Record<string, any>>("/admin/settings"),
  updateSettings: (data: Record<string, any>) =>
    authRequest<Record<string, any>>("/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /* ── Audit ────────────────────────────────────────── */
  listAuditLogs: (params?: Record<string, string | number>) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return authRequest<any>(`/admin/audit${qs}`);
  },

  /* ── Reviews ──────────────────────────────────────── */
  listReviews: (params?: Record<string, string | number>) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return authRequest<any>(`/admin/reviews${qs}`);
  },

  updateReview: (id: string, data: { isApproved?: boolean }) =>
    authRequest<any>(`/admin/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteReview: (id: string) =>
    authRequest<any>(`/admin/reviews/${id}`, { method: "DELETE" }),
};

/* ═══════════════════════════════════════════════════════
   LEGACY EXPORT
   ═══════════════════════════════════════════════════════ */
export const adminToken = {
  get: (): string | null => null,
  set: (_token: string) => adminAuth.setHint(),
  clear: () => adminAuth.clearHint(),
};