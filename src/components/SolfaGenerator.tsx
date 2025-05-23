'use client'

import { useState } from 'react'
import { generateSolfaFromLyrics, type VoicePart } from '@/lib/solfa'
import { motion } from 'framer-motion'
import { Music, Loader2, Play, Pause, Volume2, VolumeX, FileText } from 'lucide-react'

interface SolfaGeneratorProps {
  onNotationGenerated: (notations: Record<VoicePart, string[]>) => void;
  mode?: 'notation' | 'script';
}

export default function SolfaGenerator({ onNotationGenerated, mode = 'notation' }: SolfaGeneratorProps) {
  const [lyrics, setLyrics] = useState('')
  const [key, setKey] = useState('C')
  const [tempo, setTempo] = useState(120)
  const [style, setStyle] = useState('traditional')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [scriptNotes, setScriptNotes] = useState('')
  const [sections, setSections] = useState<{ name: string; description: string; timing: string }[]>([])

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      setError('Please enter lyrics')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const notations = await generateSolfaFromLyrics(lyrics, {
        key,
        tempo,
        style,
        difficulty
      })
      onNotationGenerated(notations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate notation')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddSection = () => {
    setSections([...sections, { name: '', description: '', timing: '' }])
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'notation' ? 'Generate Solfa Notation' : 'Music Director Script'}
          </h2>
          {mode === 'notation' && (
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </motion.button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lyrics
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your lyrics here..."
            />
          </div>

          {mode === 'notation' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key
                  </label>
                  <select
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tempo (BPM)
                  </label>
                  <input
                    type="number"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    min="40"
                    max="208"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="traditional">Traditional</option>
                    <option value="modern">Modern</option>
                    <option value="gospel">Gospel</option>
                    <option value="classical">Classical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {mode === 'script' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Director's Notes
                </label>
                <textarea
                  value={scriptNotes}
                  onChange={(e) => setScriptNotes(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter director's notes..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sections
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddSection}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Add Section
                  </motion.button>
                </div>
                
                {sections.map((section, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[index].name = e.target.value
                        setSections(newSections)
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Section name..."
                    />
                    <input
                      type="text"
                      value={section.description}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[index].description = e.target.value
                        setSections(newSections)
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Description..."
                    />
                    <input
                      type="text"
                      value={section.timing}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[index].timing = e.target.value
                        setSections(newSections)
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Timing..."
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {mode === 'notation' ? <Music size={20} /> : <FileText size={20} />}
                <span>{mode === 'notation' ? 'Generate Notation' : 'Save Script'}</span>
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
} 