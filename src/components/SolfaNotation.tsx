'use client'

import { VOICE_PART_COLORS, type VoicePart } from '@/lib/solfa'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SolfaNotationProps {
  lyrics: string
  notations: Record<VoicePart, string[]>
  activeVoicePart?: VoicePart
  onVoicePartClick?: (part: VoicePart) => void
  onPlay?: (index: number) => void
  isPlaying?: boolean
  currentNoteIndex?: number
}

export default function SolfaNotation({
  lyrics,
  notations,
  activeVoicePart,
  onVoicePartClick,
  onPlay,
  isPlaying,
  currentNoteIndex = -1
}: SolfaNotationProps) {
  const words = lyrics.split(/\s+/)
  const voiceParts = Object.keys(notations) as VoicePart[]
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="space-y-6">
      {/* Voice part selector */}
      <div className="flex flex-wrap gap-4">
        {voiceParts.map((part) => (
          <motion.button
            key={part}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onVoicePartClick?.(part)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeVoicePart === part
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            style={{
              borderLeft: `4px solid ${VOICE_PART_COLORS[part]}`
            }}
          >
            {part.charAt(0).toUpperCase() + part.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPlay?.(currentNoteIndex)}
          className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Notation display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          {words.map((word, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                currentNoteIndex === index
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30'
                  : ''
              }`}
            >
              <span className="text-gray-900 dark:text-white min-w-[100px] font-medium">
                {word}
              </span>
              <div className="flex gap-2">
                {voiceParts.map((part) => (
                  <motion.span
                    key={part}
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeVoicePart && activeVoicePart !== part
                        ? 'opacity-30'
                        : ''
                    } ${
                      currentNoteIndex === index
                        ? 'shadow-lg transform scale-105'
                        : ''
                    }`}
                    style={{
                      backgroundColor: `${VOICE_PART_COLORS[part]}20`,
                      color: VOICE_PART_COLORS[part],
                      border: currentNoteIndex === index
                        ? `2px solid ${VOICE_PART_COLORS[part]}`
                        : 'none'
                    }}
                  >
                    {notations[part][index]}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      {currentNoteIndex >= 0 && (
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentNoteIndex + 1) / words.length) * 100}%`
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>
      )}
    </div>
  )
} 