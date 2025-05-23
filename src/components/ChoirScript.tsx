'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { generateSolfaFromLyrics, type VoicePart } from '@/lib/solfa'
import { VOICE_PART_COLORS } from '@/lib/solfa'

interface ChoirSong {
  id: string;
  title: string;
  lyrics: string;
  solfaNotation: Record<VoicePart, string[]>;
  audioUrl?: string;
}

export default function ChoirScript() {
  const [songs, setSongs] = useState<ChoirSong[]>([])
  const [currentSong, setCurrentSong] = useState<ChoirSong>({
    id: '',
    title: '',
    lyrics: '',
    solfaNotation: {
      soprano: [],
      alto: [],
      tenor: [],
      bass: []
    }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentVoicePart, setCurrentVoicePart] = useState<VoicePart>('soprano')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSolfa = async () => {
    if (!currentSong.lyrics.trim()) {
      alert('Please enter lyrics first')
      return
    }

    setIsGenerating(true)
    try {
      const notation = await generateSolfaFromLyrics(currentSong.lyrics)
      setCurrentSong({
        ...currentSong,
        solfaNotation: notation
      })
    } catch (error) {
      console.error('Error generating solfa notation:', error)
      alert('Failed to generate solfa notation')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveSong = () => {
    if (!currentSong.title.trim()) {
      alert('Please enter a title for the song')
      return
    }

    if (currentSong.id) {
      setSongs(songs.map(s => 
        s.id === currentSong.id ? currentSong : s
      ))
    } else {
      setSongs([...songs, { ...currentSong, id: Date.now().toString() }])
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Choir Script
          </h2>
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
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={currentSong.title}
              onChange={(e) => setCurrentSong({ ...currentSong, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter song title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lyrics
            </label>
            <textarea
              value={currentSong.lyrics}
              onChange={(e) => setCurrentSong({ ...currentSong, lyrics: e.target.value })}
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter song lyrics..."
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {Object.keys(VOICE_PART_COLORS).map((part) => (
                <motion.button
                  key={part}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentVoicePart(part as VoicePart)}
                  className={`px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    currentVoicePart === part
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {part.charAt(0).toUpperCase() + part.slice(1)}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateSolfa}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Music size={20} />
                  <span>Generate Solfa</span>
                </div>
              )}
            </motion.button>
          </div>

          {currentSong.solfaNotation[currentVoicePart].length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {currentVoicePart.charAt(0).toUpperCase() + currentVoicePart.slice(1)} Part
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentSong.solfaNotation[currentVoicePart].map((note, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    style={{
                      borderLeft: `4px solid ${VOICE_PART_COLORS[currentVoicePart]}`
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {note}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveSong}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Song
            </motion.button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Saved Songs
        </h3>
        <div className="space-y-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              onClick={() => setCurrentSong(song)}
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {song.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {Object.keys(song.solfaNotation).length} voice parts
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 