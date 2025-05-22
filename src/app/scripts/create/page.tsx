'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Music, Users, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import AudioUpload from '@/components/AudioUpload'

interface Song {
  id: string
  title: string
}

export default function CreateScriptPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'director' | 'choir'>('director')
  const [notes, setNotes] = useState('')
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [audioPath, setAudioPath] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Sample songs - will be replaced with real data
  const availableSongs: Song[] = [
    { id: '1', title: 'Amazing Grace' },
    { id: '2', title: 'Hallelujah Chorus' },
    { id: '3', title: 'Joy to the World' },
  ]

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || selectedSongs.length === 0) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // TODO: Implement API call to create script with audio path
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      router.push('/scripts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create script')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSong = (songId: string) => {
    setSelectedSongs(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    )
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
            Create New Script
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Script Type Selection */}
          <div className="flex space-x-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('director')}
              className={`flex-1 p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                type === 'director'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Music className="w-6 h-6" />
              <div className="text-left">
                <h3 className="font-semibold">Director Script</h3>
                <p className="text-sm opacity-80">For music directors and conductors</p>
              </div>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('choir')}
              className={`flex-1 p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                type === 'choir'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-6 h-6" />
              <div className="text-left">
                <h3 className="font-semibold">Choir Script</h3>
                <p className="text-sm opacity-80">For choir members and performers</p>
              </div>
            </motion.button>
          </div>

          {/* Title Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Script Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter script title"
            />
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

          {/* Notes Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any notes or instructions"
            />
          </div>

          {/* Song Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Songs
            </h3>
            <div className="space-y-3">
              {availableSongs.map((song) => (
                <motion.div
                  key={song.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleSong(song.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedSongs.includes(song.id)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5" />
                    <span>{song.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

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
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Script'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
} 