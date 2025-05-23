'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Pause, Volume2, Search } from 'lucide-react'
// Import supabase client if needed for data fetching, commented out for now
// import { supabase } from '@/lib/supabase'

// Define a placeholder Song interface
interface Song {
  id: string
  title: string
  choir?: string
  audioUrl?: string // Placeholder
  lyrics?: string // Placeholder
  notations?: { // Placeholder structure for solfa notation
    soprano: string[]
    alto: string[]
    tenor: string[]
    bass: string[]
  }
}

// Placeholder data
const placeholderSongs: Song[] = [
  {
    id: 'song-1',
    title: 'Joyful Praise',
    choir: 'Main Choir',
    audioUrl: '/audio/placeholder-praise.mp3', // Placeholder audio file path
    lyrics: "Joyful praise to the King!\nLift your voices and sing!\nHis love forever reigns!\nIn joyful praise we bring!",
    notations: {
      soprano: ['d', 'r', 'm', 'f', 's', 'l', 't', 'd'+'\'', 's', 'f', 'm', 'r', 'd'],
      alto: ['s,', 't,', 'd', 'r', 'm', 'f', 's', 'f', 'm', 'r', 'd', 't,', 's,'],
      tenor: ['m,', 'f,', 's,', 'l,', 't,', 'd', 'r', 'd', 't,', 'l,', 's,', 'f,', 'm,'],
      bass: ['d,', 'r,', 'm,', 'f,', 's,', 'l,', 't,', 'd', 't,', 'l,', 's,', 'f,', 'm,'],
    },
  },
  {
    id: 'song-2',
    title: 'Spirit Filled Worship',
    choir: 'Worship Team',
    audioUrl: '/audio/placeholder-worship.mp3', // Placeholder
    lyrics: "Spirit of God fill this place\nMove in power and grace\nLet your glory descend\nAs our hearts ascend",
    notations: {
      soprano: ['m', 'f', 's', 's', 'l', 's', 'f', 'm'],
      alto: ['d', 'r', 'm', 'm', 'f', 'm', 'r', 'd'],
      tenor: ['s,', 't,', 'd', 'd', 'r', 'd', 't,', 's,'],
      bass: ['d,', 'r,', 'm,', 'm,', 'f,', 'm,', 'r,', 'd,'],
    },
  },
  // Add more placeholder songs as needed
];

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>(placeholderSongs) // Use placeholder data
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeVoicePart, setActiveVoicePart] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano')
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1) // For solfa highlighting

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

  // Effect to handle audio playback and update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        // Basic placeholder logic for solfa highlighting based on time
        // Replace with actual sync logic later
        const noteDuration = duration / (currentSong?.notations?.[activeVoicePart]?.length || 1);
        setCurrentNoteIndex(Math.floor(audio.currentTime / noteDuration));
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      if (isPlaying) {
        audio.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audio.pause();
      }

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [isPlaying, currentSong, volume, duration, activeVoicePart]); // Add dependencies

  // Effect to load new audio when currentSong changes
  useEffect(() => {
    if (currentSong?.audioUrl && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      setCurrentNoteIndex(-1);
    } else if (audioRef.current) {
      audioRef.current.src = '';
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setCurrentNoteIndex(-1);
    }
  }, [currentSong]);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.choir?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 py-8">
      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <input
          type="text"
          placeholder="Search songs or choirs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </motion.div>

      {/* Current Song Player */}
      <AnimatePresence mode="wait">
      {currentSong ? (
        <motion.div
          key={currentSong.id} // Key for exit/enter animations
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gold-300"
        >
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4">Now Playing</h2>
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Music className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {currentSong.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {currentSong.choir}
              </p>
              {/* Audio Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-gold-500 text-blue-900 rounded-full hover:bg-gold-600 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <div className="flex-1">
                  {/* Progress Bar */}
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
                    className="w-full accent-gold-500"
                  />
                  {/* Time Display */}
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                    className="w-20 accent-gold-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Voice Part Selector */}
          <div className="mt-6 flex space-x-4 overflow-x-auto pb-2">
            {currentSong.notations && (['soprano', 'alto', 'tenor', 'bass'] as const).map((part) => (
              <button
                key={part}
                onClick={() => setActiveVoicePart(part)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex-shrink-0 ${
                  activeVoicePart === part
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {part.charAt(0).toUpperCase() + part.slice(1)}
              </button>
            ))}
          </div>

          {/* Solfa Notation Display */}
          {currentSong.notations?.[activeVoicePart] && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-x-auto font-mono text-lg leading-relaxed"
             >
               {currentSong.notations[activeVoicePart].map((note, index) => (
                 <span
                   key={index}
                   className={`inline-block px-1 py-0.5 transition-colors ${
                     index === currentNoteIndex
                       ? 'bg-gold-400 text-blue-900 rounded' // Highlight color
                       : 'text-gray-700 dark:text-gray-300'
                   }`}
                 >
                   {note}
                 </span>
               ))}
             </motion.div>
          )}
         
          {/* Lyrics Display */}
          {currentSong.lyrics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl whitespace-pre-line text-gray-700 dark:text-gray-300"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Lyrics</h3>
              {currentSong.lyrics}
            </motion.div>
          )}

          {/* Pitch Visualizer Placeholder */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-xl text-center text-blue-800 dark:text-blue-300">
            Pitch Visualizer Placeholder (Coming Soon)
          </div>

        </motion.div>
      ) : isLoading ? (
        <motion.div key="loading-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">Loading song player...</motion.div>
      ) : error ? (
        <motion.div key="error-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 py-8">{error}</motion.div>
      ) : (
         <motion.div key="no-song-selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">Select a song to start practicing!</motion.div>
      )}
      </AnimatePresence>

      {/* Songs Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }} // Adjust delay based on elements above
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">All Songs</h2>
        {isLoading ? (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400">Loading songs list...</motion.div>
        ) : error ? (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500">{error}</motion.div>
        ) : filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredSongs.map((song) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                  onClick={() => setCurrentSong(song)}
                >
                  <div className="aspect-square bg-blue-50 dark:bg-blue-900/50 rounded-lg mb-4 flex items-center justify-center">
                    {/* Placeholder image or icon for song */}
                    <Music className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {song.choir}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
         ) : ( // No songs found after filtering or initial load
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400">No songs found matching your search.</motion.div>
         )}
      </motion.section>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} />
    </div>
  );
} 