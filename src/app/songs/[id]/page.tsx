'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Music, Users, Share2, Heart, MessageSquare, Bookmark, Play, Pause, Mic, Volume2 } from 'lucide-react'

interface VoicePart {
  type: 'soprano' | 'tenor' | 'alto' | 'bass'
  solfa: string
}

interface Section {
  id: string
  mdInstructions: {
    musicDirection: string
    choirInstruction: string
    soundCues: string
  }
  lyrics: string
  voiceParts: VoicePart[]
  startTime?: number
  endTime?: number
}

interface Song {
  id: string
  title: string
  composer: string
  sections: Section[]
  audioPath?: string
  likes: number
  comments: number
  shares: number
  bookmarks: number
}

export default function SongPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeVoicePart, setActiveVoicePart] = useState<VoicePart['type']>('soprano')
  const [song] = useState<Song>({
    id: params.id,
    title: 'I See the Glory',
    composer: 'John Doe',
    sections: [
      {
        id: '1',
        mdInstructions: {
          musicDirection: 'Start softly, build up gradually',
          choirInstruction: 'Sopranos lead, others follow',
          soundCues: 'Add reverb for chorus'
        },
        lyrics: 'I see the glory of the Lord...',
        voiceParts: [
          { type: 'soprano', solfa: 'do re mi fa sol' },
          { type: 'tenor', solfa: 'sol la ti do re' },
          { type: 'alto', solfa: 'mi fa sol la ti' },
          { type: 'bass', solfa: 'do mi sol do mi' }
        ]
      }
    ],
    likes: 42,
    comments: 12,
    shares: 8,
    bookmarks: 5
  })

  const handleCollaborate = () => {
    router.push(`/collaboration?songId=${song.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {song.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Composed by {song.composer}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCollaborate}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              <span>Collaborate</span>
            </motion.button>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Heart className="w-5 h-5 text-red-500" />
            <span>{song.likes}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span>{song.comments}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Share2 className="w-5 h-5 text-green-500" />
            <span>{song.shares}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Bookmark className="w-5 h-5 text-yellow-500" />
            <span>{song.bookmarks}</span>
          </motion.button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {song.sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Section {index + 1}
              </h2>

              {/* MD Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Music Direction</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{section.mdInstructions.musicDirection}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Choir Instruction</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{section.mdInstructions.choirInstruction}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sound Cues</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{section.mdInstructions.soundCues}</p>
                </div>
              </div>

              {/* Lyrics and Solfa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lyrics</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{section.lyrics}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Solfa Notation</h3>
                    <div className="flex gap-2">
                      {['soprano', 'tenor', 'alto', 'bass'].map((type) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveVoicePart(type as VoicePart['type'])}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            activeVoicePart === type
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="font-mono text-gray-700 dark:text-gray-300">
                      {section.voiceParts.find(part => part.type === activeVoicePart)?.solfa}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 