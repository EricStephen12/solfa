"use client";
import AppAuthGate from "@/components/AppAuthGate";
import OfflineIndicator from "@/components/OfflineIndicator";
import { usePathname } from "next/navigation";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";
  return (
    <>
      <OfflineIndicator />
      {isAuthPage ? <>{children}</> : <AppAuthGate>{children}</AppAuthGate>}
    </>
  );
} 