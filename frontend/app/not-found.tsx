import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">
          দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি।
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}