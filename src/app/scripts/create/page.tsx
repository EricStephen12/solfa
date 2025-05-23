'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Music, Users, FileText, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import AudioUpload from '@/components/AudioUpload'

interface Song {
  id: string
  title: string
  type: 'director' | 'choir' | 'solfa'
  audioPath?: string
}

type ScriptType = 'director' | 'choir' | 'solfa'
type VoicePart = 'soprano' | 'alto' | 'tenor' | 'bass'

interface Section {
  id: string
  name: string
  startTime: number
  endTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  notes: string
}

export default function CreateScriptPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ScriptType>('director')
  const [notes, setNotes] = useState('')
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [audioPath, setAudioPath] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [voicePart, setVoicePart] = useState<VoicePart>('soprano')
  const [sections, setSections] = useState<Section[]>([])
  const [solfaNotation, setSolfaNotation] = useState('')
  const [performanceInstructions, setPerformanceInstructions] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [availableSongs, setAvailableSongs] = useState<Song[]>([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      setIsLoadingSongs(true)
      const response = await fetch('/api/songs')
      if (!response.ok) throw new Error('Failed to fetch songs')
      const data = await response.json()
      setAvailableSongs(data)
    } catch (err) {
      setError('Failed to load songs')
      console.error(err)
    } finally {
      setIsLoadingSongs(false)
    }
  }

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

      // Now send the file to the transcription endpoint
      const transcribeForm = new FormData()
      transcribeForm.append('file', file)
      const transcriptRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: transcribeForm,
      })
      if (transcriptRes.ok) {
        const transcriptData = await transcriptRes.json()
        setNotes(transcriptData.transcript)
      }
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
      // TODO: Implement API call to create script with all fields
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

  const addSection = () => {
    setSections(prev => [...prev, {
      id: Date.now().toString(),
      name: `Section ${prev.length + 1}`,
      startTime: 0,
      endTime: 0,
      difficulty: 'medium',
      notes: ''
    }])
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('director')}
              className={`p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                type === 'director'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Music className="w-6 h-6" />
              <div className="text-left">
                <h3 className="font-semibold">Director Script</h3>
                <p className="text-sm opacity-80">For music directors</p>
              </div>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('choir')}
              className={`p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                type === 'choir'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-6 h-6" />
              <div className="text-left">
                <h3 className="font-semibold">Choir Script</h3>
                <p className="text-sm opacity-80">For choir members</p>
              </div>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('solfa')}
              className={`p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                type === 'solfa'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-6 h-6" />
              <div className="text-left">
                <h3 className="font-semibold">Solfa Script</h3>
                <p className="text-sm opacity-80">For solfa notation</p>
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

          {/* Voice Part Selection (for choir scripts) */}
          {type === 'choir' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Part
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['soprano', 'alto', 'tenor', 'bass'] as VoicePart[]).map((part) => (
                  <motion.button
                    key={part}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVoicePart(part)}
                    className={`p-3 rounded-lg text-center ${
                      voicePart === part
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Level */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <motion.button
                  key={level}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDifficultyLevel(level)}
                  className={`p-3 rounded-lg text-center ${
                    difficultyLevel === level
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </motion.button>
              ))}
            </div>
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

          {/* Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sections
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addSection}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              >
                Add Section
              </motion.button>
            </div>
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => {
                      setSections(prev =>
                        prev.map(s =>
                          s.id === section.id ? { ...s, name: e.target.value } : s
                        )
                      )
                    }}
                    className="w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
                    placeholder="Section name"
                  />
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input
                      type="number"
                      value={section.startTime}
                      onChange={(e) => {
                        setSections(prev =>
                          prev.map(s =>
                            s.id === section.id ? { ...s, startTime: Number(e.target.value) } : s
                          )
                        )
                      }}
                      className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
                      placeholder="Start time (seconds)"
                    />
                    <input
                      type="number"
                      value={section.endTime}
                      onChange={(e) => {
                        setSections(prev =>
                          prev.map(s =>
                            s.id === section.id ? { ...s, endTime: Number(e.target.value) } : s
                          )
                        )
                      }}
                      className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
                      placeholder="End time (seconds)"
                    />
                  </div>
                  <select
                    value={section.difficulty}
                    onChange={(e) => {
                      setSections(prev =>
                        prev.map(s =>
                          s.id === section.id ? { ...s, difficulty: e.target.value as 'easy' | 'medium' | 'hard' } : s
                        )
                      )
                    }}
                    className="w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <textarea
                    value={section.notes}
                    onChange={(e) => {
                      setSections(prev =>
                        prev.map(s =>
                          s.id === section.id ? { ...s, notes: e.target.value } : s
                        )
                      )
                    }}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
                    placeholder="Section notes"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Solfa Notation (for solfa scripts) */}
          {type === 'solfa' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <label htmlFor="solfa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solfa Notation
              </label>
              <textarea
                id="solfa"
                value={solfaNotation}
                onChange={(e) => setSolfaNotation(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter solfa notation (e.g., do re mi fa sol la ti do)"
              />
            </div>
          )}

          {/* Performance Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Performance Instructions
            </label>
            <textarea
              id="instructions"
              value={performanceInstructions}
              onChange={(e) => setPerformanceInstructions(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add performance instructions, dynamics, tempo changes, etc."
            />
          </div>

          {/* Notes Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              General Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes or instructions"
            />
          </div>

          {/* Song Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Select Songs
            </label>
            {isLoadingSongs ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading songs...</span>
              </div>
            ) : availableSongs.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No songs available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create a song first to add it to your script
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/songs/create')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Create New Song
                </motion.button>
              </div>
            ) : (
              <div className="space-y-2">
                {availableSongs.map((song) => (
                  <motion.button
                    key={song.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSong(song.id)}
                    className={`w-full p-3 text-left rounded-lg ${
                      selectedSongs.includes(song.id)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Music className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm opacity-80">{song.type}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Script'}
          </motion.button>

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
        </motion.form>
      </div>
    </div>
  )
} 