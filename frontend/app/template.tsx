"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageEnter } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Skip the transition for admin routes — they use their own shell
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageEnter}
    >
      {children}
    </motion.div>
  );
}