'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Music, Save } from 'lucide-react'
import { generateVoicePartNotations, VoicePart } from '@/lib/solfa'
import SolfaNotation from '@/components/SolfaNotation'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function CreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [voiceParts, setVoiceParts] = useState<VoicePart[]>([])
  const [activeVoicePart, setActiveVoicePart] = useState<VoicePart | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !lyrics || voiceParts.length === 0) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const solfaNotation = generateVoicePartNotations(lyrics, voiceParts)
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          lyrics,
          voiceParts,
          solfaNotation,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to create song')
      }

      router.push('/songs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create song')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoicePartChange = (part: VoicePart) => {
    setVoiceParts((prev) =>
      prev.includes(part)
        ? prev.filter((p) => p !== part)
        : [...prev, part]
    )
  }

  const notations = lyrics
    ? generateVoicePartNotations(lyrics, voiceParts)
    : {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
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
              Create New Song
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Enter song title..."
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
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                  required
                  placeholder="Enter song lyrics..."
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
                        checked={voiceParts.includes(part as VoicePart)}
                        onChange={() => handleVoicePartChange(part as VoicePart)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300">
                        {part.charAt(0).toUpperCase() + part.slice(1)}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-800 dark:text-red-200"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="flex justify-end"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create Song
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>

          {lyrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Preview
              </h2>
              <SolfaNotation
                lyrics={lyrics}
                notations={notations}
                activeVoicePart={activeVoicePart}
                onVoicePartClick={setActiveVoicePart}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 