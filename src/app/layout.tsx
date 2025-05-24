'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import SplashScreen from '@/components/SplashScreen'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/context/ThemeProvider'
import { RoleProvider } from '@/context/RoleProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show splash screen for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        {isLoading ? (
          <SplashScreen />
        ) : (
        <ThemeProvider>
          <RoleProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <Navigation />
              {/* Main Content */}
              <div className="md:pl-64">
                <main className="py-6 px-1 sm:px-6 lg:px-8 w-full max-w-full">
                  {children}
                </main>
              </div>
            </div>
          </RoleProvider>
        </ThemeProvider>
        )}
      </body>
    </html>
  )
}
 