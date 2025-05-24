'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Music, Users, Share2, Heart, MessageSquare, Bookmark, Play, Pause, Mic, Volume2, X } from 'lucide-react'

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
  const searchParams = useSearchParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeVoicePart, setActiveVoicePart] = useState<VoicePart['type']>('soprano')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentKaraokeIndex, setCurrentKaraokeIndex] = useState(0)
  const solfaRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Example karaoke data for solfa (replace with real timing data)
  const solfaKaraoke = [
    { text: 'do', start: 0, end: 1 },
    { text: 're', start: 1, end: 2 },
    { text: 'mi', start: 2, end: 3 },
    { text: 'fa', start: 3, end: 4 },
    { text: 'sol', start: 4, end: 5 },
    { text: 'la', start: 5, end: 6 },
    { text: 'ti', start: 6, end: 7 },
    { text: 'do', start: 7, end: 8 },
  ]

  // Handle autoplay
  useEffect(() => {
    const autoplay = searchParams.get('autoplay')
    if (autoplay === 'true') {
      setIsPlaying(true)
      if (audioRef.current) {
        audioRef.current.play()
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (audioRef.current) {
      const onTimeUpdate = () => {
        const time = audioRef.current!.currentTime
        const idx = solfaKaraoke.findIndex(
          (word, i) =>
            time >= word.start && (i === solfaKaraoke.length - 1 || time < solfaKaraoke[i + 1].start)
        )
        if (idx !== -1 && idx !== currentKaraokeIndex) {
          setCurrentKaraokeIndex(idx)
          solfaRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        }
      }
      audioRef.current.addEventListener('timeupdate', onTimeUpdate)
      return () => audioRef.current?.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [solfaKaraoke, currentKaraokeIndex])

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
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 animate-gradient-x overflow-hidden">
      {/* Animated Aura Blobs */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 opacity-30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl animate-pulse-slower" />
      </div>
      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white shadow-lg z-50"
        aria-label="Close Player"
      >
        <X className="w-7 h-7" />
      </button>
      {/* Player Card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto my-8 px-2 sm:px-0 bg-white/30 dark:bg-gray-900/40 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-2xl p-6 sm:p-10 flex flex-col gap-8 items-center">
        {/* Cover Art */}
        <div className="w-40 h-40 rounded-2xl shadow-2xl bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center mb-4 border-4 border-white/30">
          <Music className="w-20 h-20 text-blue-500 drop-shadow-lg" />
        </div>
        {/* Title & Artist */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">{song.title}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-2">Composed by {song.composer}</p>
        {/* Audio Controls */}
        <div className="flex flex-col items-center w-full gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:scale-105 transition-all duration-300 mb-2"
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
          </button>
          {/* Progress bar and volume can be added here */}
        </div>
        {/* Engagement Stats */}
        <div className="grid grid-cols-4 gap-4 w-full mb-2">
          <div className="flex flex-col items-center">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{song.likes}</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{song.comments}</span>
          </div>
          <div className="flex flex-col items-center">
            <Share2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{song.shares}</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{song.bookmarks}</span>
          </div>
        </div>
        {/* Sections (Solfa & Lyrics) */}
        <div className="w-full space-y-8">
          {song.sections.map((section, index) => (
            <div key={section.id} className="w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Section {index + 1}</h2>
              {/* MD Instructions */}
              <div className="mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Music Director Instructions</div>
                  {section.mdInstructions.musicDirection && (
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Music Direction:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{section.mdInstructions.musicDirection}</span>
                    </div>
                  )}
                  {section.mdInstructions.choirInstruction && (
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Choir Instruction:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{section.mdInstructions.choirInstruction}</span>
                    </div>
                  )}
                  {section.mdInstructions.soundCues && (
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Sound Cues:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{section.mdInstructions.soundCues}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Voice Part Tabs */}
              <div className="flex justify-center gap-2 mb-4">
                {['soprano', 'tenor', 'alto', 'bass'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveVoicePart(type as VoicePart['type'])}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeVoicePart === type ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              {/* Solfa Notation */}
              <div className="flex flex-wrap justify-center gap-2 bg-gray-100/70 dark:bg-gray-800/70 rounded-xl p-4 mb-4 shadow-inner overflow-x-auto">
                {solfaKaraoke.map((word, idx) => (
                  <span
                    key={idx}
                    ref={el => (solfaRefs.current[idx] = el)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 text-lg font-semibold shadow text-blue-700 dark:text-blue-300 ${
                      idx === currentKaraokeIndex ? 'bg-blue-600 text-white scale-110 shadow-lg' : ''
                    }`}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
              {/* Lyrics */}
              <div className="bg-gray-100/70 dark:bg-gray-800/70 rounded-xl p-4 shadow-inner">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lyrics</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-center">{section.lyrics}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Hidden audio element for karaoke sync */}
      <audio ref={audioRef} src={song.audioPath || ''} />
    </div>
  )
} 