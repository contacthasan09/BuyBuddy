import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Fraunces } from "next/font/google";
import "./globals.css";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { CartDrawerProvider } from "@/components/providers/CartDrawerProvider";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { WhatsAppFloat } from "@/components/engagement/WhatsAppFloat";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: {
    default: "BD Store — Quality products, delivered across Bangladesh",
    template: "%s | BD Store",
  },
  description:
    "Shop quality products with Cash on Delivery across Bangladesh.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020204",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white">
        <ReadingProgress />
        <MotionProvider>
          <ToastProvider>
            <CartProvider>
              <CartDrawerProvider>
                <AnnouncementBar />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <BackToTop />
                <WhatsAppFloat />
                <CookieConsent />
              </CartDrawerProvider>
            </CartProvider>
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}