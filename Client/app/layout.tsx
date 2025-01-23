import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/toaster"
// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // icons: [{ rel: 'icon', url: '/logo.ico', type: 'image/x-icon' }],
  title: 'RBAC DEMO',
  description: 'A comprehensive system for managing hospitals and ICU beds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" />
      </head>
      <body >
        {/* className={inter.className} */}
        <Toaster />
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

