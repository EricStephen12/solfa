"use client";

import { usePathname } from "next/navigation";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <>{children}</>
} 