'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, Mic, Users, MessageSquare, Settings, X, Volume2, VolumeX, Share2, MoreVertical, Layout, Maximize2, Minimize2, Heart, Gift, Crown, Flag, UserPlus, UserMinus, Check, XCircle, Mic2, UserCheck, Send } from 'lucide-react'

interface Participant {
  id: string
  name: string
  role: string
  isMuted: boolean
  isVideoOff: boolean
  isSpeaking: boolean
  isDirector: boolean
  isModerator: boolean
  isSubscriber: boolean
  status: 'active' | 'pending' | 'rejected'
  isInvitedToSpeak: boolean
  isRequestingToSpeak: boolean
}

interface DirectorRequest {
  id: string
  name: string
  role: string
  timestamp: number
  reason: string
}

interface ChatMessage {
  id: number
  user: string
  message: string
  isModerator: boolean
  isSubscriber: boolean
  timestamp: number
}

interface StreamPageProps {
  params: {
    id: string
  }
}

const StreamPage: React.FC<StreamPageProps> = ({ params }) => {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Music Director',
      isMuted: false,
      isVideoOff: false,
      isSpeaking: true,
      isDirector: true,
      isModerator: true,
      isSubscriber: true,
      status: 'active',
      isInvitedToSpeak: false,
      isRequestingToSpeak: false
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Vocalist',
      isMuted: true,
      isVideoOff: false,
      isSpeaking: false,
      isDirector: false,
      isModerator: true,
      isSubscriber: true,
      status: 'active',
      isInvitedToSpeak: false,
      isRequestingToSpeak: false
    }
  ])

  const [directorRequests, setDirectorRequests] = useState<DirectorRequest[]>([
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Guitarist',
      timestamp: Date.now() - 1000 * 60 * 5,
      reason: 'Initial request'
    }
  ])

  const [viewers, setViewers] = useState(1234)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showDirectorRequests, setShowDirectorRequests] = useState(false)
  const [layout, setLayout] = useState<'main' | 'grid'>('main')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, user: 'User1', message: 'Hello everyone!', isModerator: true, isSubscriber: true, timestamp: Date.now() - 1000 * 60 * 5 },
    { id: 2, user: 'User2', message: 'Excited for the rehearsal!', isModerator: false, isSubscriber: true, timestamp: Date.now() - 1000 * 60 * 3 }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [speakRequestReason, setSpeakRequestReason] = useState('')
  const [showSpeakRequestModal, setShowSpeakRequestModal] = useState(false)

  const handleDirectorRequest = (requestId: string, accept: boolean) => {
    const request = directorRequests.find(r => r.id === requestId)
    if (!request) return

    if (accept) {
      const newDirector: Participant = {
        id: request.id,
        name: request.name,
        role: request.role,
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
        isDirector: true,
        isModerator: false,
        isSubscriber: true,
        status: 'active',
        isInvitedToSpeak: false,
        isRequestingToSpeak: false
      }
      setParticipants([...participants, newDirector])
    }

    setDirectorRequests(directorRequests.filter(r => r.id !== requestId))
  }

  const inviteToSpeak = (participantId: string) => {
    setParticipants(participants.map(p => 
      p.id === participantId ? { ...p, isInvitedToSpeak: true } : p
    ))
  }

  const acceptSpeakingInvite = () => {
    setParticipants(participants.map(p => 
      p.id === 'current-user-id' ? { ...p, isSpeaking: true, isInvitedToSpeak: false } : p
    ))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const requestToSpeak = () => {
    setShowSpeakRequestModal(true)
  }

  const submitSpeakRequest = () => {
    if (speakRequestReason.trim()) {
      const newRequest: DirectorRequest = {
        id: Date.now().toString(),
        name: 'Current User',
        role: 'Member',
        timestamp: Date.now(),
        reason: speakRequestReason
      }
      setDirectorRequests([...directorRequests, newRequest])
      setShowSpeakRequestModal(false)
      setSpeakRequestReason('')
    }
  }

  const sendMessage = (message: string) => {
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        user: 'You',
        message,
        isModerator: false,
        isSubscriber: true,
        timestamp: Date.now()
      }])
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen flex-col md:flex-row overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between p-2 sm:p-4 bg-black/50 backdrop-blur-lg border-b border-gray-800">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">Sunday Service Rehearsal</h1>
              <span className="px-2 py-1 bg-red-500 text-white text-xs sm:text-sm rounded whitespace-nowrap">LIVE</span>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>{viewers.toLocaleString()} watching</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowDirectorRequests(!showDirectorRequests)}
                className="p-2 text-gray-400 hover:text-white relative"
              >
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                {directorRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {directorRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 p-2 sm:p-4 overflow-auto">
            {layout === 'main' ? (
              <div className="h-full flex flex-col gap-2 sm:gap-4">
                {/* Main Speaker */}
                <div className="relative flex-1 bg-gray-900 rounded-xl overflow-hidden min-h-[200px] sm:min-h-[300px]">
                  {participants.find(p => p.isSpeaking)?.isVideoOff ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-700 mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                          <span className="text-2xl sm:text-4xl text-white">
                            {participants.find(p => p.isSpeaking)?.name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-lg sm:text-2xl text-white font-medium mb-1 sm:mb-2">
                          {participants.find(p => p.isSpeaking)?.name}
                        </p>
                        <p className="text-sm sm:text-base text-gray-400">{participants.find(p => p.isSpeaking)?.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gray-800" />
                  )}
                  {participants.find(p => p.isSpeaking)?.isMuted && (
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 rounded-full p-1 sm:p-2">
                      <VolumeX className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Directors Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {participants.filter(p => p.isDirector && !p.isSpeaking).map((participant) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video"
                    >
                      {participant.isVideoOff ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <div className="text-center p-2">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-700 mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                              <span className="text-sm sm:text-xl text-white">
                                {participant.name.charAt(0)}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-white font-medium">{participant.name}</p>
                            <p className="text-xs sm:text-sm text-gray-400">{participant.role}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gray-800" />
                      )}
                      {participant.isMuted && (
                        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-black/50 rounded-full p-1">
                          <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                      {participant.isInvitedToSpeak && (
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-blue-500 rounded-full px-1 sm:px-2 py-0.5 sm:py-1">
                          <span className="text-[10px] sm:text-xs text-white">Invited to Speak</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {participants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video"
                  >
                    {participant.isVideoOff ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center p-2">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-700 mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                            <span className="text-sm sm:text-xl text-white">
                              {participant.name.charAt(0)}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-white font-medium">{participant.name}</p>
                          <p className="text-xs sm:text-sm text-gray-400">{participant.role}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gray-800" />
                    )}
                    {participant.isMuted && (
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-black/50 rounded-full p-1">
                        <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-2 sm:p-4 bg-black/50 backdrop-blur-lg border-t border-gray-800">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleMute}
                  className={`p-2 sm:p-3 rounded-full ${
                    isMuted ? 'bg-red-500' : 'bg-white/10'
                  } text-white hover:bg-white/20 transition-colors`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-2 sm:p-3 rounded-full ${
                    isVideoOff ? 'bg-red-500' : 'bg-white/10'
                  } text-white hover:bg-white/20 transition-colors`}
                >
                  {isVideoOff ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
                <button
                  className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setLayout(layout === 'main' ? 'grid' : 'main')}
                  className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Layout className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
                <button
                  className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebars */}
        {(showChat || showParticipants || showDirectorRequests || showSettings) && (
          <div className="fixed inset-0 md:relative md:w-80 flex flex-col md:flex-row">
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 md:hidden"
              onClick={() => {
                setShowChat(false)
                setShowParticipants(false)
                setShowDirectorRequests(false)
                setShowSettings(false)
              }}
            />

            {/* Sidebar content */}
            <div className="fixed right-0 top-0 bottom-0 w-[280px] md:w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    {showChat && 'Live Chat'}
                    {showParticipants && 'Participants'}
                    {showDirectorRequests && 'Director Requests'}
                    {showSettings && 'Settings'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowChat(false)
                      setShowParticipants(false)
                      setShowDirectorRequests(false)
                      setShowSettings(false)
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {showChat && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 p-4 space-y-4">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            {msg.isModerator ? (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            ) : msg.isSubscriber ? (
                              <Heart className="w-4 h-4 text-red-400" />
                            ) : null}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{msg.user}</span>
                              {msg.isModerator && (
                                <span className="px-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">MOD</span>
                              )}
                            </div>
                            <p className="text-gray-300">{msg.message}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Send a message..."
                          className="flex-1 px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newMessage.trim()) {
                              sendMessage(newMessage)
                            }
                          }}
                        />
                        <button 
                          onClick={() => sendMessage(newMessage)}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showParticipants && (
                  <div className="p-4 space-y-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg text-white">
                            {participant.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{participant.name}</p>
                            {participant.isDirector && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                            {participant.isModerator && (
                              <span className="px-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">MOD</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{participant.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {participant.isMuted && <VolumeX className="w-4 h-4 text-gray-400" />}
                          {participant.isVideoOff && <Video className="w-4 h-4 text-gray-400" />}
                          {participant.isDirector && !participant.isSpeaking && (
                            <button
                              onClick={() => inviteToSpeak(participant.id)}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Mic2 className="w-4 h-4" />
                            </button>
                          )}
                          {participant.isDirector && (
                            <button
                              onClick={() => {
                                setParticipants(participants.filter(p => p.id !== participant.id))
                              }}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showDirectorRequests && (
                  <div className="p-4 space-y-4">
                    {directorRequests.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No pending requests
                      </div>
                    ) : (
                      directorRequests.map((request) => (
                        <div key={request.id} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-lg text-white">
                                {request.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{request.name}</p>
                              <p className="text-sm text-gray-400">{request.role}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{request.reason}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDirectorRequest(request.id, true)}
                              className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleDirectorRequest(request.id, false)}
                              className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {showSettings && (
                  <div className="p-4 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Audio Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">Microphone</span>
                          <select className="bg-white/5 border border-gray-800 rounded-lg px-3 py-1 text-white">
                            <option>Default Microphone</option>
                            <option>Microphone 2</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">Speaker</span>
                          <select className="bg-white/5 border border-gray-800 rounded-lg px-3 py-1 text-white">
                            <option>Default Speaker</option>
                            <option>Speaker 2</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Video Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">Camera</span>
                          <select className="bg-white/5 border border-gray-800 rounded-lg px-3 py-1 text-white">
                            <option>Default Camera</option>
                            <option>Camera 2</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">Resolution</span>
                          <select className="bg-white/5 border border-gray-800 rounded-lg px-3 py-1 text-white">
                            <option>720p</option>
                            <option>1080p</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Appearance</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">Theme</span>
                          <select className="bg-white/5 border border-gray-800 rounded-lg px-3 py-1 text-white">
                            <option>Dark</option>
                            <option>Light</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Request to Speak Modal */}
        {showSpeakRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-[90%] max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Request to Speak</h3>
              <textarea
                value={speakRequestReason}
                onChange={(e) => setSpeakRequestReason(e.target.value)}
                placeholder="Why do you want to speak?"
                className="w-full h-32 px-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white/20 mb-4"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSpeakRequestModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSpeakRequest}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request to Speak Button for Non-Directors */}
        {!participants.find(p => p.id === 'current-user-id')?.isDirector && (
          <button
            onClick={requestToSpeak}
            className="fixed bottom-24 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Mic2 className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

export default StreamPage 