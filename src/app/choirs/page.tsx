'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Music, Mic, Trash, Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRole } from '@/context/RoleProvider'
import Link from 'next/link'

interface Member {
  id: string
  name: string
  email?: string
  voicePart?: 'soprano' | 'alto' | 'tenor' | 'bass'
  joinedAt?: string
}

interface Choir {
  id: string
  name: string
  description?: string
  imageUrl?: string
  members?: Member[]
  songs?: {
    id: string
    title: string
  }[]
}

const placeholderChoirs: Choir[] = [
  {
    id: 'choir-1',
    name: 'Main Choir',
    description: 'The main worship choir of the ministry.',
    imageUrl: '/images/placeholder-choir-1.jpg',
    members: [{ id: 'm1', name: 'Member One' }, { id: 'm2', name: 'Member Two' }],
    songs: [{ id: 's1', title: 'Awesome God' }, { id: 's2', title: 'He Lives' }],
  },
  {
    id: 'choir-2',
    name: 'Youth Alive Choir',
    description: 'Energetic and vibrant youth voices.',
    imageUrl: '/images/placeholder-choir-2.jpg',
    members: [{ id: 'm3', name: 'Youth Member' }],
    songs: [{ id: 's3', title: 'Spirit Chant' }],
  },
  {
     id: 'choir-3',
     name: 'Gospel Groovers',
     description: 'Contemporary gospel sounds.',
     imageUrl: '/images/placeholder-choir-3.jpg',
     members: [],
     songs: [],
  }
]

export default function ChoirsPage() {
  const { role } = useRole()
  const [choirs, setChoirs] = useState<Choir[]>(placeholderChoirs)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-8"
    >
      <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 text-center mb-6">Manage Choirs</h1>

      {isLoading ? (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">Loading choirs...</motion.div>
      ) : error ? (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 py-8">{error}</motion.div>
      ) : choirs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {choirs.map((choir) => (
              <motion.div
                key={choir.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                 <Link href={`/choirs/${choir.id}`} className="block">
                  <div className="aspect-video bg-blue-50 dark:bg-blue-900/50 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center">
                    {choir.imageUrl ? (
                      <Image
                        src={choir.imageUrl}
                        alt={choir.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {choir.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {choir.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{choir.members?.length || 0} members</span>
                    <span>{choir.songs?.length || 0} songs</span>
                  </div>
                 </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Choirs Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first choir.</p>
         </motion.div>
      )}
    </motion.div>
  )
} 