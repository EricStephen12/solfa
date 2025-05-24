'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Music, Play, Pause, Volume2 } from 'lucide-react'
// Import supabase client if needed for data fetching, commented out for now
// import { supabase } from '@/lib/supabase'

// Define a placeholder Song interface
interface Song {
  id: string
  title: string
  description: string
  creator: string
  audioUrl?: string
  lyrics?: string
  notations?: {
    soprano: string[]
    alto: string[]
    tenor: string[]
    bass: string[]
  }
}

// Define placeholder data
const placeholderSongs: Song[] = [
  {
    id: '1',
    title: 'Joyful Praise',
    description: 'A vibrant celebration of joy and gratitude',
    creator: 'John Doe',
    audioUrl: '/audio/joyful-praise.mp3',
    lyrics: 'Joyful praise we sing to You\nLifting up our hearts anew\nGrateful for Your love so true\nWe worship You',
    notations: {
      soprano: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do'],
      alto: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do'],
      tenor: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do'],
      bass: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do']
    }
  },
  {
    id: '2',
    title: 'Peaceful Waters',
    description: 'A calming melody about finding peace in God',
    creator: 'Jane Smith',
    audioUrl: '/audio/peaceful-waters.mp3',
    lyrics: 'Like peaceful waters flowing\nYour love surrounds my soul\nIn Your presence I am whole\nI find my rest in You',
    notations: {
      soprano: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do'],
      alto: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do'],
      tenor: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do'],
      bass: ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do']
    }
  }
]

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>(placeholderSongs)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [activeVoicePart, setActiveVoicePart] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano')
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isLoading, setIsLoading] = useState(false) // Manage loading state
  const [error, setError] = useState<string | null>(null) // Manage error state

  // Effect to load songs - currently uses placeholder, can be updated for Supabase
  /*
  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('songs') // Assuming 'songs' is the correct table name
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setSongs(data || []);
        // Optionally set the first song as currentSong if data exists
        // if (data && data.length > 0) {
        //   setCurrentSong(data[0]);
        // }
      } catch (err) {
        console.error('Error loading songs:', err);
        setError('Failed to load songs.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);
  */

  // Filter songs based on search query
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.creator.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update current time
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0)
      })
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0)
      })
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative max-w-2xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search songs..."
          className="w-full px-6 py-4 pl-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300 hover:shadow-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
      </motion.div>

      {/* Current Song Player */}
      <AnimatePresence mode="wait">
      {currentSong ? (
        <motion.div
            key={currentSong.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Album Art */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
              >
                <Music className="w-24 h-24 text-blue-600 dark:text-blue-400" />
              </motion.div>

              {/* Song Info and Controls */}
              <div className="flex-1 w-full">
                <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-2">
                {currentSong.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Created by {currentSong.creator}
              </p>

              {/* Audio Controls */}
                <div className="space-y-6">
              <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </motion.button>
                <div className="flex-1">
                  {/* Progress Bar */}
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentTime / duration) * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = parseFloat(e.target.value);
                      }
                      setCurrentTime(parseFloat(e.target.value));
                    }}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 accent-blue-600"
                  />
            </div>
          </div>

          {/* Voice Part Selector */}
                  <div className="flex flex-wrap gap-2">
                    {(['soprano', 'alto', 'tenor', 'bass'] as const).map((part) => (
                      <motion.button
                key={part}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                onClick={() => setActiveVoicePart(part)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                  activeVoicePart === part
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {part.charAt(0).toUpperCase() + part.slice(1)}
                      </motion.button>
            ))}
          </div>

          {/* Solfa Notation Display */}
          {currentSong.notations?.[activeVoicePart] && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
                      className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-x-auto font-mono text-xl leading-relaxed"
             >
                      {currentSong.notations[activeVoicePart].map((note: string, index: number) => (
                        <motion.span
                   key={index}
                          initial={{ scale: 1 }}
                          animate={{ 
                            scale: index === currentNoteIndex ? 1.2 : 1,
                            backgroundColor: index === currentNoteIndex ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                          }}
                          className={`inline-block px-2 py-1 mx-1 rounded-lg transition-all duration-300 ${
                     index === currentNoteIndex
                              ? 'text-blue-900 dark:text-blue-100'
                       : 'text-gray-700 dark:text-gray-300'
                   }`}
                 >
                   {note}
                        </motion.span>
               ))}
             </motion.div>
          )}
         
          {/* Lyrics Display */}
          {currentSong.lyrics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
                      className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl"
            >
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Lyrics</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {currentSong.lyrics}
                      </p>
            </motion.div>
          )}
                </div>
              </div>
          </div>
        </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg"
          >
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Select a song to start practicing!
            </p>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Songs Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400">All Songs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
            {filteredSongs.map((song: Song, index: number) => (
                <motion.div
                  key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                  whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                >
                <div className="p-6">
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl mb-4 flex items-center justify-center">
                    <Music className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {song.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {song.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        By {song.creator}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentSong(song)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Play
                    </motion.button>
                  </div>
                </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
      </motion.section>

      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  )
} 