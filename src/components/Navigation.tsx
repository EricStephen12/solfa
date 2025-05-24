'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Music, Users, Mic, User, Menu, X, MessageSquare, FileText, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Songs', href: '/songs', icon: Music },
  { name: 'MD Sheets', href: '/md-sheet', icon: FileText },
  { name: 'Collaboration', href: '/collaboration', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-lg shadow-lg md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold text-white">
                LMM Live Production Rehearsal Sheet
              </h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/95 backdrop-blur-lg">
          <h1 className="text-xl font-bold text-white">
            LMM Live Production Rehearsal Sheet
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-black/95 backdrop-blur-lg border-r border-gray-800">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-white">
              LMM Live Production Rehearsal Sheet
            </h1>
          </div>
          <div className="px-4 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>
          <nav className="flex-1 px-4 mt-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800 z-[49]">
        <nav className="flex justify-around items-center h-16">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
} 