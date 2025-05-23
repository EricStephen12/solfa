'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRole } from '@/context/RoleProvider'
import { FileUp, Music, Users, Send, Mic } from 'lucide-react'

export default function CreateSongPage() {
  const { role, isLoading: roleLoading } = useRole()
  const [title, setTitle] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [lyrics, setLyrics] = useState('')
  const [solfaNotation, setSolfaNotation] = useState('') // This will eventually be generated/edited
  const [selectedChoirs, setSelectedChoirs] = useState<string[]>([]) // Store choir IDs
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')

  // Placeholder choir data - replace with fetched data later
  const placeholderChoirs = [
    { id: 'choir-1', name: 'Main Choir' },
    { id: 'choir-2', name: 'Youth Choir' },
    { id: 'choir-3', name: 'Worship Team' },
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0])
    }
  }

  const handleChoirSelect = (choirId: string) => {
    setSelectedChoirs(prev =>
      prev.includes(choirId) ? prev.filter(id => id !== choirId) : [...prev, choirId]
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Placeholder submission logic - replace with Supabase upload and insert
    setIsSubmitting(true)
    setSubmitStatus('loading')
    console.log('Submitting Song:', { title, audioFile, lyrics, solfaNotation, selectedChoirs })

    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate success or error
    const success = Math.random() > 0.2; // 80% chance of success
    if (success) {
      setSubmitStatus('success')
      // Reset form
      setTitle('')
      setAudioFile(null)
      setLyrics('')
      setSolfaNotation('')
      setSelectedChoirs([])
    } else {
      setSubmitStatus('error')
    }
    setIsSubmitting(false)
  }

  // Show loading or access denied based on role
  if (roleLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-12">
        Loading role information...
      </motion.div>
    )
  }

  if (role !== 'director') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 dark:text-red-400 py-12">
        Access Denied. Only directors can create songs.
      </motion.div>
    )
  }

  // Render form for directors
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 py-8"
    >
      <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 text-center">Create New Song</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gold-300">
        {/* Song Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Song Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Audio Upload */}
        <div>
          <label htmlFor="audio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audio File (MP3, WAV, etc.)</label>
          <div className="flex items-center space-x-4">
            <label htmlFor="audio-upload" className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-flex items-center">
              <FileUp className="w-5 h-5 mr-2" />
              Choose File
            </label>
            <input
              type="file"
              id="audio-upload"
              accept="audio/*"
              onChange={handleFileChange}
              required
              className="hidden"
            />
            {audioFile && <span className="text-sm text-gray-500 dark:text-gray-400">{audioFile.name}</span>}
          </div>
        </div>

        {/* Lyrics */}
        <div>
          <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lyrics</label>
          <textarea
            id="lyrics"
            rows={6}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            placeholder="Enter lyrics here..."
          />
        </div>

        {/* Solfa Notation Input/Generation (Placeholder) */}
        <div>
          <label htmlFor="solfa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Solfa Notation (Manual Input for now)</label>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">AI Generation Coming Soon</p>
          <textarea
            id="solfa"
            rows={4}
            value={solfaNotation}
            onChange={(e) => setSolfaNotation(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono"
            placeholder="Enter solfa notation here (e.g., Soprano: d r m f s)\n(Ensure format matches expected structure for playback sync)"
          />
        </div>

        {/* Assign to Choirs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign to Choirs</label>
          <div className="flex flex-wrap gap-3">
            {placeholderChoirs.map(choir => (
              <motion.button
                key={choir.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoirSelect(choir.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedChoirs.includes(choir.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {choir.name}
              </motion.button>
            ))}
          </div>
           {placeholderChoirs.length === 0 && (
             <p className="text-sm text-gray-500 dark:text-gray-400">No choirs available to assign to.</p>
           )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 bg-gold-500 text-blue-900 rounded-lg font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || submitStatus === 'success'}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : submitStatus === 'success' ? (
            'Submitted Successfully!'
          ) : submitStatus === 'error' ? (
             'Submission Failed'
          ) : (
            'Create Song'
          )}
        </motion.button>

        {/* Submission Status Message */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-600 dark:text-green-400 mt-4"
            >
              Song created successfully!
            </motion.p>
          )}
           {submitStatus === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-red-600 dark:text-red-400 mt-4"
            >
              Failed to create song. Please try again.
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
} 