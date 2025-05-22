'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Plus, List, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from './ui/Toaster'
import { motion } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      toast('App installed successfully!', 'success')
    } else {
      toast('App installation declined', 'info')
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/songs/create', icon: Plus, label: 'Create' },
    { path: '/songs', icon: List, label: 'Songs' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <motion.div
                key={item.path}
                whileTap={{ scale: 0.9 }}
                className="relative flex-1 flex items-center justify-center h-full"
              >
                <Link
                  href={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                    active
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
                  }`}
                >
                  <div className={`relative ${active ? 'transform -translate-y-1' : ''}`}>
                    <Icon className="w-6 h-6" />
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 