'use client'

import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (localStorage) {
      const theme = localStorage.getItem("theme");
      document.documentElement.setAttribute("data-theme", theme || "light");
      setLoading(false);
    }
  }, []);

  return (
    <>
      {
        loading
          ? null
          : <div className="flex min-h-screen bg-primary/5">
            {children}
          </div>
      }
    </>
  )
}
