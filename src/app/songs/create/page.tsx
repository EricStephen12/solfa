'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Music, Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import AudioUpload from '@/components/AudioUpload'
import SolfaNotation from '@/components/SolfaNotation'

interface VoicePart {
  soprano: string[]
  alto: string[]
  tenor: string[]
  bass: string[]
}

export default function CreateSongPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [audioPath, setAudioPath] = useState<string>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [notations, setNotations] = useState<VoicePart>({
    soprano: [],
    alto: [],
    tenor: [],
    bass: []
  })
  const [activeVoicePart, setActiveVoicePart] = useState<keyof VoicePart>('soprano')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1)

  const handleAudioUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload audio')
      }

      const data = await response.json()
      setAudioPath(data.path)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload audio')
    }
  }

  const generateSolfaNotation = async () => {
    if (!lyrics.trim()) {
      setError('Please enter lyrics first')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      // TODO: Implement actual solfa notation generation
      // This is a placeholder that generates random notations
      const words = lyrics.split(/\s+/)
      const newNotations: VoicePart = {
        soprano: words.map(() => 'do'),
        alto: words.map(() => 'mi'),
        tenor: words.map(() => 'sol'),
        bass: words.map(() => 'do')
      }
      setNotations(newNotations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate solfa notation')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlay = (index: number) => {
    setIsPlaying(!isPlaying)
    setCurrentNoteIndex(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Song
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Song Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter song title"
            />
          </div>

          {/* Lyrics Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lyrics
            </label>
            <textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter song lyrics (one word per line for better notation)"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateSolfaNotation}
              disabled={isGenerating}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Music className="w-5 h-5" />
              <span>{isGenerating ? 'Generating...' : 'Generate Solfa Notation'}</span>
            </motion.button>
          </div>

          {/* Audio Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Audio Recording
            </label>
            <AudioUpload
              onUpload={handleAudioUpload}
              currentAudio={audioPath}
              onDelete={() => setAudioPath(undefined)}
            />
          </div>

          {/* Solfa Notation Display */}
          {Object.keys(notations).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Solfa Notation
              </h3>
              <SolfaNotation
                lyrics={lyrics}
                notations={notations}
                activeVoicePart={activeVoicePart}
                onVoicePartClick={setActiveVoicePart}
                onPlay={handlePlay}
                isPlaying={isPlaying}
                currentNoteIndex={currentNoteIndex}
              />
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Save Song
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
} 