"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/main');
  }, [router]);

  return null;
}
