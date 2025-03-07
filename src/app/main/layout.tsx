'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex max-w-7xl mx-auto min-h-screen bg-base-200">
        <main className="flex-1 w-full z-10">
          <Navbar/>
          <div className='rounded-md px-4 mt-4 overflow-auto'>
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
