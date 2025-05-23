import { Inter } from 'next/font/google'
import { RoleProvider } from '@/context/RoleProvider'
import { ThemeProvider } from '@/context/ThemeProvider'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <RoleProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navigation />
              {/* Main Content */}
              <div className="md:pl-64">
                <main className="py-6 px-4 sm:px-6 lg:px-8">
                  {children}
                </main>
              </div>
            </div>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
 