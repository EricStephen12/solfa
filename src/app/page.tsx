'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Volume2, Mic, Users, BookOpen, Calendar, Bell, Settings, Clock, FileText } from 'lucide-react'
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

export default function Home() {
  const router = useRouter()

  const features = [
    {
      name: 'Create Songs',
      description: 'Compose and arrange songs with our intuitive editor',
      icon: Music
    },
    {
      name: 'Collaborate',
      description: 'Work together with other musicians in real-time',
      icon: Users
    },
    {
      name: 'Learn',
      description: 'Access tutorials and resources to improve your skills',
      icon: BookOpen
    }
  ]

  const upcomingRehearsals = [
    { id: 1, title: 'Choir Practice', date: 'May 25, 2024', time: '10:00 AM', participants: 12 },
    { id: 2, title: 'Voice Training', date: 'May 26, 2024', time: '2:00 PM', participants: 8 },
  ]

  const quickActions = [
    { icon: <Music className="w-6 h-6" />, title: 'Start Session', href: '/rehearsal/new' },
    { icon: <Users className="w-6 h-6" />, title: 'Join Session', href: '/rehearsal/join' },
    { icon: <FileText className="w-6 h-6" />, title: 'View Library', href: '/library' },
    { icon: <Mic className="w-6 h-6" />, title: 'Record', href: '/record' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section with Background Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl h-[400px]"
      >
        <Image
          src="https://images.app.goo.gl/rGPJe2bq6xzcjP8z5"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Solfa</h1>
          <p className="text-xl opacity-90 max-w-2xl">Your all-in-one platform for musical collaboration and rehearsal</p>
        </div>
      </motion.div>

      {/* Quick Actions with Background Image */}
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src="https://images.app.goo.gl/y4e2jJ8TAVk3z3uJ6"
          alt="Quick Actions Background"
          width={1200}
          height={400}
          className="object-cover w-full h-[300px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href} className="block p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
                  <div className="flex flex-col items-center text-center text-white">
                    {action.icon}
                    <span className="mt-2 font-medium">{action.title}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Rehearsals with Background Image */}
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src="https://images.app.goo.gl/gRUz81qznf9QLuWD8"
          alt="Rehearsals Background"
          width={1200}
          height={400}
          className="object-cover w-full h-[400px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Upcoming Rehearsals
            </h2>
            <Link href="/rehearsals" className="text-white hover:text-blue-200">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingRehearsals.map((rehearsal) => (
              <motion.div
                key={rehearsal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white"
              >
                <div>
                  <h3 className="font-medium">{rehearsal.title}</h3>
                  <p className="text-sm opacity-80">
                    {rehearsal.date} at {rehearsal.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{rehearsal.participants}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div>
                <p className="font-medium">New rehearsal scheduled</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Sessions
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div>
                <p className="font-medium">Choir Practice</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Completed 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
