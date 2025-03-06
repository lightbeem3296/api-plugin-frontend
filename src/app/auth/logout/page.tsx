"use client";

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="mx-auto flex justify-center items-center h-screen">
      <h2 className="text-2xl font-bold">Logging out...</h2>
    </div>
  );

}
