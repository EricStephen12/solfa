'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Song {
  _id: string
  title: string
  lyrics: string
  voiceParts: string[]
  solfaNotation?: Record<string, string>
}

// Sample data for development
const sampleSongs: Record<string, Song> = {
  '1': {
    _id: '1',
    title: 'Amazing Grace',
    lyrics: 'Amazing grace, how sweet the sound...',
    voiceParts: ['soprano', 'alto', 'tenor', 'bass'],
    solfaNotation: {
      soprano: 'do re mi fa sol la ti do',
      alto: 'do re mi fa sol la ti do',
      tenor: 'do re mi fa sol la ti do',
      bass: 'do re mi fa sol la ti do',
    },
  },
  '2': {
    _id: '2',
    title: 'Hallelujah Chorus',
    lyrics: 'Hallelujah! Hallelujah!...',
    voiceParts: ['soprano', 'alto', 'tenor', 'bass'],
    solfaNotation: {
      soprano: 'do re mi fa sol la ti do',
      alto: 'do re mi fa sol la ti do',
      tenor: 'do re mi fa sol la ti do',
      bass: 'do re mi fa sol la ti do',
    },
  },
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDevelopment, setIsDevelopment] = useState(true)

  useEffect(() => {
    if (isDevelopment) {
      // Use sample data in development
      const sampleSong = sampleSongs[params.id]
      if (sampleSong) {
        setSong(sampleSong)
      } else {
        setError('Song not found')
      }
      setLoading(false)
    } else {
      fetchSong()
    }
  }, [params.id, isDevelopment])

  const fetchSong = async () => {
    try {
      const response = await fetch(`/api/songs?id=${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch song')
      const data = await response.json()
      setSong(data)
    } catch (err) {
      setError('Failed to load song')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!song) return

    if (isDevelopment) {
      // Handle update in development mode
      alert('In development mode - changes not saved to database')
      router.push('/songs')
      return
    }

    try {
      const response = await fetch(`/api/songs?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      })
      if (!response.ok) throw new Error('Failed to update song')
      router.push('/songs')
    } catch (err) {
      setError('Failed to update song')
      console.error(err)
    }
  }

  if (loading) return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading song...</p>
      </div>
    </motion.div>
  )

  if (error) return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    </motion.div>
  )

  if (!song) return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl">
        <p className="text-gray-600 dark:text-gray-300 font-medium">Song not found</p>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <AnimatePresence>
          {isDevelopment && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-yellow-50/80 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-xl backdrop-blur-lg"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  🚧 Development Mode: Changes will not be saved to database.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-8 transition-colors duration-200"
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Edit Song
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="space-y-2"
              >
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={song.title}
                  onChange={(e) => setSong({ ...song, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="space-y-2"
              >
                <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lyrics
                </label>
                <textarea
                  id="lyrics"
                  value={song.lyrics}
                  onChange={(e) => setSong({ ...song, lyrics: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                  required
                />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Voice Parts
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['soprano', 'alto', 'tenor', 'bass'].map((part) => (
                    <motion.label
                      key={part}
                      className="flex items-center p-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="checkbox"
                        checked={song.voiceParts.includes(part)}
                        onChange={(e) => {
                          const newParts = e.target.checked
                            ? [...song.voiceParts, part]
                            : song.voiceParts.filter((p) => p !== part)
                          setSong({ ...song, voiceParts: newParts })
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300">
                        {part.charAt(0).toUpperCase() + part.slice(1)}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="flex justify-end"
              >
                <motion.button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 