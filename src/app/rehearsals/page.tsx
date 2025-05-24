'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Video, Mic, Plus, X, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'

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

export default function RehearsalsPage() {
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
    },
    {
      id: '2',
      title: 'Choir Practice',
      date: '2024-03-25',
      time: '7:00 PM',
      type: 'audio',
      status: 'scheduled',
      participants: 8,
      description: 'Vocal practice session'
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
    // Here you would typically start the live stream
    window.location.href = `/rehearsals/${id}/stream`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Rehearsals</h1>
          <button
            onClick={() => setShowSchedule(true)}
            className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Rehearsal</span>
          </button>
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

        {/* Rehearsals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rehearsals.map((rehearsal) => (
            <motion.div
              key={rehearsal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold mb-1">{rehearsal.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{rehearsal.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{rehearsal.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{rehearsal.description}</p>
              <div className="flex items-center justify-between">
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
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    Start
                  </button>
                )}
                {rehearsal.status === 'live' && (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                    Live
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 