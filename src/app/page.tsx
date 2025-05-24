'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Volume2, Mic, Users, BookOpen, Calendar, Bell, Settings, Clock, FileText, ChevronRight, ChevronLeft, User, Video, MapPin } from 'lucide-react'
// Import supabase client if needed for data fetching, commented out for now
// import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRole } from '@/context/RoleProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define interfaces for our data
interface Song {
  id: string
  title: string
  artist: string
  coverArt: string
  duration: string
  type: 'song' | 'playlist' | 'album'
}

interface Rehearsal {
  id: string
  title: string
  date: string
  time: string
  participants: number
  image: string
  type: 'live' | 'recording'
  description: string
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  type: 'praise-night' | 'concert' | 'special-event'
  image: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

// Placeholder data
const featuredContent: Song[] = [
  { id: '1', title: 'Amazing Grace', artist: 'Main Choir', coverArt: '/images/praise 1.jpg', duration: '4:30', type: 'song' },
  { id: '2', title: 'Joyful Noise', artist: 'Youth Choir', coverArt: '/images/praise 2.jpg', duration: '3:45', type: 'song' },
  { id: '3', title: 'Spirit Move', artist: 'Worship Team', coverArt: '/images/praise 3.jpg', duration: '5:15', type: 'song' },
  { id: '4', title: 'Hallelujah', artist: 'Mass Choir', coverArt: '/images/praise 1.jpg', duration: '6:00', type: 'song' },
]

const upcomingRehearsals: Rehearsal[] = [
  { id: '1', title: 'Sunday Service Rehearsal', date: 'May 25, 2024', time: '10:00 AM', participants: 12, image: '/images/praise 2.jpg', type: 'live', description: 'This is a live rehearsal' },
  { id: '2', title: 'Youth Choir Practice', date: 'May 26, 2024', time: '2:00 PM', participants: 8, image: '/images/praise 3.jpg', type: 'recording', description: 'This is a recording rehearsal' },
  { id: '3', title: 'Mass Choir Rehearsal', date: 'May 27, 2024', time: '6:00 PM', participants: 15, image: '/images/praise 1.jpg', type: 'live', description: 'This is a live rehearsal' },
]

// Update placeholder events data
const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Night of Worship',
    date: 'May 25, 2024',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Join us for an evening of powerful worship and praise',
    type: 'praise-night',
    image: '/images/praise 1.jpg',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Youth Praise Concert',
    date: 'May 26, 2024',
    time: '6:00 PM',
    location: 'Youth Center',
    description: 'Special youth-led worship night with guest artists',
    type: 'concert',
    image: '/images/praise 2.jpg',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Gospel Music Festival',
    date: 'May 27, 2024',
    time: '5:00 PM',
    location: 'Church Grounds',
    description: 'Annual gospel music festival featuring multiple choirs and artists',
    type: 'special-event',
    image: '/images/praise 3.jpg',
    status: 'upcoming'
  }
]

export default function Home() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentRehearsalIndex, setCurrentRehearsalIndex] = useState(0)

  // Add state for current song
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  // Handle play button click
  const handlePlayClick = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSong(song)
    setIsPlaying(true)
    router.push(`/songs/${song.id}?autoplay=true`)
  }

  // Carousel controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % upcomingRehearsals.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + upcomingRehearsals.length) % upcomingRehearsals.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Profile Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors">
              <Image
                src="/images/profile.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome back,</h2>
              <p className="text-gray-400">Ready for rehearsal?</p>
            </div>
          </div>
          <Link href="/notifications" className="p-2 text-gray-400 hover:text-white">
            <Bell className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Songs</h2>
          <Link href="/songs" className="text-gray-400 hover:text-white flex items-center">
            See All <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => router.push(`/songs/${item.id}`)}
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <Image
                  src={item.coverArt}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  <p className="text-gray-300 text-sm truncate">{item.artist}</p>
                </div>
                <button
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  onClick={(e) => handlePlayClick(item, e)}
                >
                  {isPlaying && currentSong?.id === item.id ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Rehearsals */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Rehearsals</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentRehearsalIndex(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentRehearsalIndex(prev => Math.min(upcomingRehearsals.length - 1, prev + 1))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <motion.div
            key={currentRehearsalIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/5 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{upcomingRehearsals[currentRehearsalIndex].title}</h3>
                <div className="flex items-center gap-4 text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{upcomingRehearsals[currentRehearsalIndex].date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{upcomingRehearsals[currentRehearsalIndex].time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{upcomingRehearsals[currentRehearsalIndex].participants} participants</span>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">{upcomingRehearsals[currentRehearsalIndex].description}</p>
                <Link
                  href={`/rehearsals/${upcomingRehearsals[currentRehearsalIndex].id}/stream`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Join Rehearsal
                </Link>
              </div>
              <div className="flex items-center gap-2">
                {upcomingRehearsals[currentRehearsalIndex].type === 'live' && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Live</span>
                )}
                {upcomingRehearsals[currentRehearsalIndex].type === 'recording' && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Recording</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="mb-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          <Link href="/md-sheet" className="text-gray-400 hover:text-white flex items-center">
            Manage Events <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 rounded-xl overflow-hidden group"
            >
              <div className="relative aspect-video">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    event.type === 'praise-night' ? 'bg-purple-500/20 text-purple-400' :
                    event.type === 'concert' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {event.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <p className="text-gray-400">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
