'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Volume2, Mic, Users } from 'lucide-react'
// Import supabase client if needed for data fetching, commented out for now
// import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRole } from '@/context/RoleProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define a placeholder Song interface matching potential backend data
interface Song {
  id: string
  title: string
  // Add other song properties as needed by the UI components
  choir?: string
  // ... etc.
}

// Placeholder data to simulate backend response
const placeholderFeaturedSongs: Song[] = [
  { id: '1', title: 'Amazing Grace', choir: 'Main Choir' },
  { id: '2', title: 'Joyful Noise', choir: 'Youth Choir' },
  { id: '3', title: 'Spirit Move', choir: 'Worship Team' },
  { id: '4', title: 'Hallelujah', choir: 'Mass Choir' },
]

export default function SplashScreen() {
  const router = useRouter()

  const features = [
    {
      icon: Music,
      title: 'Song Management',
      description: 'Organize and share your choir\'s repertoire with ease'
    },
    {
      icon: Users,
      title: 'Choir Collaboration',
      description: 'Connect with other choirs and share resources'
    },
    {
      icon: Mic,
      title: 'Audition Management',
      description: 'Streamline your audition process and find new talent'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-blue-800 dark:text-blue-400 mb-6"
          >
            Solfa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-12"
          >
            The Ultimate Platform for Choir Directors
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/auth')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/about')}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl font-semibold border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
