/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     Proxy /api/* to the backend
     ═══════════════════════════════════════════════════════
     Frontend runs on:  http://localhost:3000
     Backend runs on:   http://localhost:5000
     
     When the browser calls /api/admin/auth/login on :3000,
     Next.js forwards it to :5000/api/admin/auth/login.
     
     Cookies become first-party (localhost:3000), so they
     survive cross-port navigation without SameSite tricks.
  */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;