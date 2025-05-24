'use client'

import { motion } from 'framer-motion'
import { User, Music, FileText, MessageSquare, Star, Award, Heart, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PublicProfileStats {
  songsCreated: number
  scriptsCreated: number
  collaborations: number
  followers: number
  following: number
  likes: number
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  // Placeholder data - will be replaced with actual data from the backend
  const stats: PublicProfileStats = {
    songsCreated: 12,
    scriptsCreated: 8,
    collaborations: 24,
    followers: 156,
    following: 89,
    likes: 342
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Profile Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-50" />
              <img
                src="/placeholder-avatar.jpg"
                alt="Profile"
                className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
              />
            </div>
            <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {params.username}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Music Director & Arranger
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Public Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Music className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Created a new song</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Star, title: 'Top Contributor', description: 'Created 10+ songs' },
                  { icon: Award, title: 'Collaboration Master', description: '20+ successful collaborations' },
                  { icon: Heart, title: 'Community Favorite', description: 'Received 100+ likes' },
                  { icon: Users, title: 'Team Player', description: 'Worked with 5+ teams' }
                ].map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white">
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - CTA for Directors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            {/* Director CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
              <h2 className="text-2xl font-bold mb-4">Are you a Music Director?</h2>
              <p className="text-blue-100 mb-6">
                Join our community of music directors and get access to exclusive features:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <Music className="w-4 h-4" />
                  </div>
                  <span>Create and manage your song library</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Generate solfa notation automatically</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Collaborate with other directors</span>
                </li>
              </ul>
              <Link href="/signup" className="block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { icon: Music, label: 'View Songs', href: '/songs' },
                  { icon: FileText, label: 'View Scripts', href: '/scripts' },
                  { icon: MessageSquare, label: 'Start Discussion', href: '/collaboration' }
                ].map((link, i) => (
                  <Link key={i} href={link.href}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </motion.button>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 