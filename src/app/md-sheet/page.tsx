'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Music, User, Calendar, Clock, Users, Video, Mic, X, Trash2, MapPin, ChevronRight, ChevronLeft, Bell, Settings } from 'lucide-react'
import Image from 'next/image'

interface MDSheet {
  id: string
  title: string
  composer: string
  lastModified: string
  sectionCount: number
}

interface Rehearsal {
  id: string
  title: string
  date: string
  time: string
  type: 'video' | 'audio'
  status: 'scheduled' | 'live' | 'completed'
  participants: number
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

export default function MDSheetListPage() {
  const router = useRouter()
  const [sheets, setSheets] = useState<MDSheet[]>([
    {
      id: '1',
      title: 'I See the Glory',
      composer: 'John Doe',
      lastModified: '2024-03-20',
      sectionCount: 5
    },
    {
      id: '2',
      title: 'Amazing Grace',
      composer: 'Jane Smith',
      lastModified: '2024-03-19',
      sectionCount: 3
    }
  ])

  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([
    {
      id: '1',
      title: 'Sunday Service Rehearsal',
      date: '2024-03-24',
      time: '10:00 AM',
      type: 'video',
      status: 'scheduled',
      participants: 12,
      description: 'Full band rehearsal for Sunday service'
    }
  ])

  const [events, setEvents] = useState<Event[]>([
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
  ])

  const [showSchedule, setShowSchedule] = useState(false)
  const [newRehearsal, setNewRehearsal] = useState({
    title: '',
    date: '',
    time: '',
    type: 'video',
    description: ''
  })

  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const createNewSheet = () => {
    const newId = Date.now().toString()
    router.push(`/md-sheet/${newId}`)
  }

  const editSheet = (id: string) => {
    router.push(`/md-sheet/${id}`)
  }

  const scheduleRehearsal = () => {
    const rehearsal: Rehearsal = {
      id: Date.now().toString(),
      ...newRehearsal,
      status: 'scheduled',
      participants: 0
    }
    setRehearsals([rehearsal, ...rehearsals])
    setShowSchedule(false)
    setNewRehearsal({
      title: '',
      date: '',
      time: '',
      type: 'video',
      description: ''
    })
  }

  const startRehearsal = (id: string) => {
    setRehearsals(rehearsals.map(rehearsal =>
      rehearsal.id === id ? { ...rehearsal, status: 'live' } : rehearsal
    ))
    window.location.href = `/rehearsals/${id}/stream`
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Music Director Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowSchedule(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Schedule Rehearsal</span>
            </button>
            <button
              onClick={createNewSheet}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Sheet</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MD Sheets Section */}
          <div className="lg:col-span-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Music Sheets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {sheets.map((sheet) => (
                <motion.div
                  key={sheet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-500/20 rounded-lg">
                        <Music className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate">{sheet.title}</h3>
                        <p className="text-gray-400 truncate">{sheet.composer}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => editSheet(sheet.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="truncate">Last modified: {sheet.lastModified}</span>
                    <span className="flex-shrink-0 ml-2">{sheet.sectionCount} sections</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Rehearsals Section */}
          <div className="lg:col-span-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Upcoming Rehearsals</h2>
            <div className="space-y-4">
              {rehearsals.map((rehearsal) => (
                <motion.div
                  key={rehearsal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 truncate">{rehearsal.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{rehearsal.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{rehearsal.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 text-gray-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{rehearsal.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        {rehearsal.type === 'video' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                        <span>{rehearsal.type === 'video' ? 'Video' : 'Audio'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{rehearsal.participants}</span>
                      </div>
                    </div>
                    {rehearsal.status === 'scheduled' && (
                      <button
                        onClick={() => startRehearsal(rehearsal.id)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Start
                      </button>
                    )}
                    {rehearsal.status === 'live' && (
                      <span className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm">
                        Live
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Events Management Section */}
          <div className="lg:col-span-12">
            <section className="bg-white/5 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Events Management</h2>
                <button
                  onClick={handleAddEvent}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Event
                </button>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 aspect-video md:aspect-square">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 truncate">{event.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 line-clamp-2">{event.description}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              event.type === 'praise-night' ? 'bg-purple-500/20 text-purple-400' :
                              event.type === 'concert' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {event.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Schedule Modal */}
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Schedule Rehearsal</h2>
                <button
                  onClick={() => setShowSchedule(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={newRehearsal.title}
                    onChange={(e) => setNewRehearsal({ ...newRehearsal, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                    placeholder="Enter rehearsal title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={newRehearsal.date}
                      onChange={(e) => setNewRehearsal({ ...newRehearsal, date: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <input
                      type="time"
                      value={newRehearsal.time}
                      onChange={(e) => setNewRehearsal({ ...newRehearsal, time: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    value={newRehearsal.type}
                    onChange={(e) => setNewRehearsal({ ...newRehearsal, type: e.target.value as 'video' | 'audio' })}
                    className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="video">Video Stream</option>
                    <option value="audio">Audio Stream</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={newRehearsal.description}
                    onChange={(e) => setNewRehearsal({ ...newRehearsal, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20 h-32"
                    placeholder="Enter rehearsal description"
                  />
                </div>
                <button
                  onClick={scheduleRehearsal}
                  className="w-full px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingEvent?.title}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingEvent?.date}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingEvent?.time}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingEvent?.location}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    defaultValue={editingEvent?.description}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingEvent?.type}
                  >
                    <option value="praise-night">Praise Night</option>
                    <option value="concert">Concert</option>
                    <option value="special-event">Special Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingEvent ? 'Save Changes' : 'Add Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}