import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Timer, Music } from 'lucide-react'
import { VoicePart } from '@/lib/solfa'

interface PracticeModeProps {
  notations: Record<VoicePart, string[]>
  activeVoicePart: VoicePart
  onNoteHighlight: (index: number) => void
  songs?: Array<{
    id: string
    title: string
    type: 'director' | 'choir' | 'solfa'
    audioPath?: string
  }>
}

export default function PracticeMode({
  notations,
  activeVoicePart,
  onNoteHighlight,
  songs = []
}: PracticeModeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)
  const [startSection, setStartSection] = useState(0)
  const [endSection, setEndSection] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [practiceTime, setPracticeTime] = useState(0)
  const [selectedVoicePart, setSelectedVoicePart] = useState<VoicePart>(activeVoicePart)
  const [selectedSong, setSelectedSong] = useState<string | null>(null)
  const [currentExercise, setCurrentExercise] = useState<'warmup' | 'range' | 'breathing' | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const audioContextRef = useRef<AudioContext | null>(null)

  // Warm-up exercises
  const warmupExercises = [
    { name: 'Lip Trills', duration: 60, description: 'Practice lip trills on different pitches' },
    { name: 'Humming', duration: 60, description: 'Hum through your vocal range' },
    { name: 'Sirens', duration: 60, description: 'Glide through your range like a siren' }
  ]

  // Breathing exercises
  const breathingExercises = [
    { name: 'Deep Breathing', duration: 120, description: 'Inhale for 4 counts, hold for 4, exhale for 4' },
    { name: 'Rib Expansion', duration: 90, description: 'Focus on expanding ribs while breathing' },
    { name: 'Support Practice', duration: 120, description: 'Practice breath support with sustained notes' }
  ]

  // Vocal range exercises
  const rangeExercises = [
    { name: 'Ascending Scales', description: 'Practice ascending scales in your range' },
    { name: 'Descending Scales', description: 'Practice descending scales in your range' },
    { name: 'Arpeggios', description: 'Practice arpeggios through your range' }
  ]

  const startPracticeTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setPracticeTime(prev => prev + 1)
    }, 1000)
  }

  const stopPracticeTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    setSelectedVoicePart(activeVoicePart)
  }, [activeVoicePart])

  return (
    <div className="space-y-6">
      {/* Song Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Song</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song) => (
            <motion.button
              key={song.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSong(song.id)}
              className={`p-4 rounded-lg text-left ${
                selectedSong === song.id
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
      </div>

      {/* Voice Part Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voice Part</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['soprano', 'alto', 'tenor', 'bass'] as VoicePart[]).map((part) => (
            <motion.button
              key={part}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedVoicePart(part)}
              className={`p-3 rounded-lg text-center ${
                selectedVoicePart === part
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {part.charAt(0).toUpperCase() + part.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Practice Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practice Mode</h3>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{formatTime(practiceTime)}</span>
          </div>
        </div>

        {/* Tempo Control */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tempo: {tempo} BPM
          </label>
          <input
            type="range"
            min="40"
            max="208"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Section Looping */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section Looping
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0"
              value={startSection}
              onChange={(e) => setStartSection(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-600 dark:text-gray-400">to</span>
            <input
              type="number"
              min="0"
              value={endSection}
              onChange={(e) => setEndSection(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`px-3 py-1 rounded ${
                isLooping
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isLooping ? 'Looping' : 'Loop'}
            </button>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPlaying(!isPlaying)
              if (!isPlaying) {
                startPracticeTimer()
              } else {
                stopPracticeTimer()
              }
            }}
            className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exercises</h3>
        
        {/* Warm-up Exercises */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Warm-up Exercises</h4>
          <div className="space-y-2">
            {warmupExercises.map((exercise, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentExercise('warmup')}
                className="w-full p-3 text-left rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Breathing Exercises */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Breathing Exercises</h4>
          <div className="space-y-2">
            {breathingExercises.map((exercise, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentExercise('breathing')}
                className="w-full p-3 text-left rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Vocal Range Exercises */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Vocal Range Exercises</h4>
          <div className="space-y-2">
            {rangeExercises.map((exercise, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentExercise('range')}
                className="w-full p-3 text-left rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 