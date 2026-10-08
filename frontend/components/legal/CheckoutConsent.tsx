"use client";

import { motion } from "framer-motion";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkSoft: "#5C4F42",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
  bone: "#F7F1E3",
};

interface CheckoutConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export function CheckoutConsent({
  checked,
  onChange,
  error,
}: CheckoutConsentProps) {
  return (
    <div>
      <label
        className="relative flex items-start gap-4 p-5 rounded-sm cursor-pointer transition-all duration-300"
        style={{
          background: error ? `${T.wine}08` : checked ? `${T.gold}08` : "transparent",
          border: `1px solid ${error ? `${T.wine}30` : checked ? T.gold : `${T.gold}25`}`,
        }}
      >
        {/* Inner gold hairline (when checked) */}
        {checked && !error && (
          <div
            className="absolute inset-2 pointer-events-none rounded-sm"
            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
            aria-hidden
          />
        )}

        {/* Custom checkbox */}
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className="w-5 h-5 rounded-sm flex items-center justify-center transition-all duration-300"
            style={{
              background: checked ? T.gold : "transparent",
              border: `1px solid ${error ? T.wine : checked ? T.gold : `${T.gold}40`}`,
            }}
          >
            {checked && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
              >
                <path
                  d="M1 5 L4.5 8.5 L11 1.5"
                  stroke={T.ink}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </div>
        </div>

        <span
          className="text-[12px] leading-relaxed relative z-10"
          style={{
            color: error ? T.wine : T.inkSoft,
            fontFamily: "var(--font-fraunces), Georgia, serif",
          }}
        >
          I agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors duration-300 hover:underline"
            style={{ color: T.gold }}
          >
            Terms & Conditions
          </a>
          ,{" "}
          <a
            href="/return-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors duration-300 hover:underline"
            style={{ color: T.gold }}
          >
            Return Policy
          </a>
          , and{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors duration-300 hover:underline"
            style={{ color: T.gold }}
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] mt-2"
          style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          You must accept the terms to proceed with your acquisition.
        </motion.p>
      )}
    </div>
  );
}