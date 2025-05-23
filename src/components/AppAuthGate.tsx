"use client";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppAuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/auth");
    }
  }, [user, router]);

  if (user === null) return null; // or a loading spinner

  return <>{children}</>;
} 