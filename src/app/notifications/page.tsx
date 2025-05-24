'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Send, Calendar, Users, MessageSquare, X } from 'lucide-react'
import Image from 'next/image'

interface Notification {
  id: string
  type: 'rehearsal' | 'announcement' | 'message'
  title: string
  message: string
  sender: string
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'rehearsal',
      title: 'Sunday Service Rehearsal',
      message: 'New rehearsal scheduled for Sunday Service. Please join the live stream.',
      sender: 'Music Director',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'announcement',
      title: 'New Song Added',
      message: 'Amazing Grace has been added to the repertoire.',
      sender: 'Admin',
      timestamp: '1 day ago',
      read: true
    }
  ])

  const [showCompose, setShowCompose] = useState(false)
  const [newNotification, setNewNotification] = useState({
    type: 'announcement',
    title: '',
    message: ''
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const sendNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: newNotification.type as 'rehearsal' | 'announcement' | 'message',
      title: newNotification.title,
      message: newNotification.message,
      sender: 'You',
      timestamp: 'Just now',
      read: false
    }
    setNotifications([notification, ...notifications])
    setShowCompose(false)
    setNewNotification({ type: 'announcement', title: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <button
            onClick={() => setShowCompose(true)}
            className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Send Notification</span>
          </button>
        </div>

        {/* Compose Modal */}
        {showCompose && (
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
                <h2 className="text-xl font-bold text-white">Send Notification</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="rehearsal">Rehearsal</option>
                    <option value="message">Message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                    placeholder="Enter notification title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20 h-32"
                    placeholder="Enter notification message"
                  />
                </div>
                <button
                  onClick={sendNotification}
                  className="w-full px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {notification.type === 'rehearsal' && <Calendar className="w-6 h-6 text-blue-400" />}
                  {notification.type === 'announcement' && <Bell className="w-6 h-6 text-yellow-400" />}
                  {notification.type === 'message' && <MessageSquare className="w-6 h-6 text-green-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    <span className="text-sm text-gray-400">{notification.timestamp}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{notification.sender}</span>
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