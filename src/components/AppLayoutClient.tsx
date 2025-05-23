"use client";

import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleProvider";
import { motion } from "framer-motion";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDirector } = useRole();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
} 