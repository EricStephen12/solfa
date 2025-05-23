'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Music, FileText, Send, Users, Search, ArrowLeft } from 'lucide-react'
import { useRole } from '@/context/RoleProvider'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  type: 'text' | 'song' | 'script'
  attachments?: {
    type: 'song' | 'script'
    title: string
    url: string
  }[]
  choirId: string // Add choirId to messages
}

interface Choir {
  id: string
  name: string
  members: number
  lastActive: string
}

// Placeholder data
const placeholderChoirs: Choir[] = [
  { id: 'main-choir', name: 'Main Choir', members: 45, lastActive: '2024-03-15T10:30:00Z' },
  { id: 'youth-choir', name: 'Youth Choir', members: 30, lastActive: '2024-03-14T15:45:00Z' },
  { id: 'gospel-groovers', name: 'Gospel Groovers', members: 25, lastActive: '2024-03-13T09:15:00Z' }
]

const placeholderMessages: Message[] = [
  {
    id: '1',
    sender: 'Main Choir',
    content: 'We just finished recording our new arrangement of "Joyful Praise". Check it out!',
    timestamp: '2024-03-15T10:30:00Z',
    type: 'song',
    attachments: [{
      type: 'song',
      title: 'Joyful Praise - New Arrangement',
      url: '/songs/joyful-praise'
    }],
    choirId: 'main-choir'
  },
  {
    id: '2',
    sender: 'Youth Choir',
    content: 'Here\'s our script for the upcoming Easter performance.',
    timestamp: '2024-03-14T15:45:00Z',
    type: 'script',
    attachments: [{
      type: 'script',
      title: 'Easter Performance Script',
      url: '/scripts/easter-2024'
    }],
    choirId: 'youth-choir'
  },
   {
    id: '3',
    sender: 'Main Choir',
    content: 'Simple test message.',
    timestamp: '2024-03-15T11:00:00Z',
    type: 'text',
    choirId: 'main-choir'
  },
]

export default function CollaborationPage() {
  const { role } = useRole()
  const [messages, setMessages] = useState<Message[]>(placeholderMessages)
  const [newMessage, setNewMessage] = useState('')
  const [selectedChoirId, setSelectedChoirId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'messages' | 'choirs'>('choirs') // Start on choirs tab

  const selectedChoir = selectedChoirId ? placeholderChoirs.find(choir => choir.id === selectedChoirId) : null

  // Filter messages based on selected choir
  const filteredMessages = selectedChoirId
    ? messages.filter(message => message.choirId === selectedChoirId)
    : messages; // Show all messages if no choir is selected (optional, could change to show nothing)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChoirId) return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You', // Replace with actual user name later
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      choirId: selectedChoirId
    }

    setMessages(prev => [message, ...prev])
    setNewMessage('')
  }

  const handleShareSong = () => {
    if (!selectedChoirId) return
    // Placeholder for song sharing functionality to the selected choir
    console.log('Share song clicked for choir:', selectedChoirId)
  }

  const handleShareScript = () => {
     if (!selectedChoirId) return
    // Placeholder for script sharing functionality to the selected choir
    console.log('Share script clicked for choir:', selectedChoirId)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 text-center">Choir Collaboration</h1>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <input
          type="text"
          placeholder={activeTab === 'choirs' ? "Search choirs..." : "Search messages..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </motion.div>

      {/* Main content area with conditional rendering */}
      <AnimatePresence mode="wait">
        {selectedChoir ? (
          /* Display messages for the selected choir */
          <motion.div
            key="selected-choir-messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedChoirId(null)} // Back button
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">{selectedChoir.name}</h2>
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedChoir.name}...`}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
                {role === 'director' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareSong}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Music className="w-5 h-5" />
                  </motion.button>
                )}
                {role === 'director' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareScript}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Messages List for Selected Choir */}
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout // Enable layout animations
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {message.type === 'text' ? (
                        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      ) : message.type === 'song' ? (
                        <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      ) : ( // script
                        <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {message.sender}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {message.content}
                      </p>
                      {message.attachments && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.url}
                              className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              {attachment.type === 'song' ? (
                                <Music className="w-4 h-4 mr-2" />
                              ) : (
                                <FileText className="w-4 h-4 mr-2" />
                              )}
                              {attachment.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Display list of choirs or all messages based on activeTab */
          <motion.div
            key="choirs-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Tabs for switching between choirs list and all messages */}
            <div className="col-span-full flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'messages' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                All Messages (Experimental)
              </button>
              <button
                onClick={() => setActiveTab('choirs')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'choirs' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Choirs
              </button>
            </div>

            {activeTab === 'choirs' && (
              /* Display list of choirs */
              placeholderChoirs.filter(choir => 
                choir.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((choir) => (
                <motion.div
                  key={choir.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                  onClick={() => setSelectedChoirId(choir.id)} // Select choir on click
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {choir.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {choir.members} members
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Last active: {new Date(choir.lastActive).toLocaleString()}
                  </div>
                </motion.div>
              ))
            )}

            {activeTab === 'messages' && (
              /* Display all messages */
              <motion.div
                key="all-messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 col-span-full"
              >
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">All Messages (Experimental)</h2>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout // Enable layout animations
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {message.type === 'text' ? (
                          <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        ) : message.type === 'song' ? (
                          <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        ) : ( // script
                          <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {message.sender}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                          {message.content}
                        </p>
                        {message.attachments && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <a
                                key={index}
                                href={attachment.url}
                                className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                {attachment.type === 'song' ? (
                                  <Music className="w-4 h-4 mr-2" />
                                ) : (
                                  <FileText className="w-4 h-4 mr-2" />
                                )}
                                {attachment.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 