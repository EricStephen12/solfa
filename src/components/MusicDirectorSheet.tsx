import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Plus, Trash2, Save, Play, Pause, Upload, Loader2, FileText, Eye, Edit2, Mic, Volume2, Users, User, Pencil } from 'lucide-react'

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
  audioFile?: File
  coverArtFile?: File
  coverArtUrl?: string
  isProcessing?: boolean
}

export default function MusicDirectorSheet() {
  const [song, setSong] = useState<Song>({
    id: '1',
    title: '',
    composer: '',
    sections: [],
    isProcessing: false
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isAiAssisting, setIsAiAssisting] = useState(false)
  const [activeVoicePart, setActiveVoicePart] = useState<VoicePart['type']>('soprano')
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSong(prev => ({ ...prev, isProcessing: true }))

    try {
      // TODO: Implement actual audio processing
      // 1. Upload audio to server
      // 2. Get transcription
      // 3. Generate solfa notation for all voice parts
      // 4. Detect sections automatically

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Placeholder for automatic section detection with voice parts
      const detectedSections: Section[] = [
        {
          id: '1',
          mdInstructions: {
            musicDirection: '',
            choirInstruction: '',
            soundCues: ''
          },
          lyrics: 'Detected lyrics...',
          voiceParts: [
            { type: 'soprano', solfa: 'do re mi fa sol' },
            { type: 'tenor', solfa: 'sol la ti do re' },
            { type: 'alto', solfa: 'mi fa sol la ti' },
            { type: 'bass', solfa: 'do mi sol do mi' }
          ],
          startTime: 0,
          endTime: 30
        }
      ]

      setSong(prev => ({
        ...prev,
        audioFile: file,
        sections: detectedSections,
        isProcessing: false
      }))
    } catch (error) {
      console.error('Error processing audio:', error)
      setSong(prev => ({ ...prev, isProcessing: false }))
    }
  }

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      mdInstructions: {
        musicDirection: '',
        choirInstruction: '',
        soundCues: ''
      },
      lyrics: '',
      voiceParts: [
        { type: 'soprano', solfa: '' },
        { type: 'tenor', solfa: '' },
        { type: 'alto', solfa: '' },
        { type: 'bass', solfa: '' }
      ]
    }

    setSong(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }))
  }

  const updateVoicePart = (sectionId: string, voiceType: VoicePart['type'], solfa: string) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            voiceParts: section.voiceParts.map(part =>
              part.type === voiceType ? { ...part, solfa } : part
            )
          }
        }
        return section
      })
    }))
  }

  const deleteSection = (sectionId: string) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }))
  }

  const handleAiAssist = async (sectionId: string, type: 'lyrics' | 'solfa' | 'cues') => {
    setIsAiAssisting(true)
    try {
      // TODO: Implement AI assistance
      // This would call your AI service to help generate content
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const section = song.sections.find(s => s.id === sectionId)
      if (!section) return

      let suggestion = ''
      switch (type) {
        case 'lyrics':
          suggestion = 'AI generated lyrics suggestion...'
          break
        case 'solfa':
          suggestion = 'do re mi fa sol la ti do'
          break
        case 'cues':
          suggestion = 'AI generated MD cues...'
          break
      }

      // Show suggestion in a modal or inline
      if (confirm(`AI suggestion: ${suggestion}\n\nApply this suggestion?`)) {
        updateSection(sectionId, {
          [type]: suggestion
        })
      }
    } catch (error) {
      console.error('Error getting AI assistance:', error)
    } finally {
      setIsAiAssisting(false)
    }
  }

  const saveSheet = () => {
    // TODO: Implement save functionality
    console.log('Saving sheet:', song)
    // After saving, you would typically navigate to the song page
    // router.push(`/songs/${song.id}`)
  }

  // Cover Art Upload Handler
  const handleCoverArtUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSong(prev => ({ ...prev, coverArtFile: file, coverArtUrl: url }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="w-full px-2 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="flex-1 w-full">
            <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:gap-4 mb-4 w-full">
              {/* Cover Art Upload */}
              <div className="flex flex-col items-center mb-2 xs:mb-0 xs:mr-4">
                <label htmlFor="cover-art-upload" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Art</label>
                <input
                  id="cover-art-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverArtUpload}
                  className="mb-2"
                />
                {song.coverArtUrl && (
                  <img
                    src={song.coverArtUrl}
                    alt="Cover Art Preview"
                    className="w-20 h-20 object-cover rounded-xl border border-gray-300 dark:border-gray-600 shadow"
                  />
                )}
              </div>
              <input
                type="text"
                value={song.title}
                onChange={(e) => setSong(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter song title..."
                className="text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none px-2 py-1 w-full"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <input
                type="text"
                value={song.composer}
                onChange={(e) => setSong(prev => ({ ...prev, composer: e.target.value }))}
                placeholder="Enter composer name..."
                className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none px-2 py-1"
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-4 sm:mt-0 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="p-3 bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isPreviewMode ? <Edit2 className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveSheet}
              className="p-3 bg-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isPreviewMode ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Preview
              </h2>
              <div className="space-y-8">
                {song.sections.map((section, index) => (
                  <div key={section.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Section {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">MD Instructions</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <p className="text-gray-900 dark:text-white mb-2">
                            <span className="font-semibold">Music Direction:</span> {section.mdInstructions.musicDirection}
                          </p>
                          <p className="text-gray-900 dark:text-white mb-2">
                            <span className="font-semibold">Choir Instruction:</span> {section.mdInstructions.choirInstruction}
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            <span className="font-semibold">Sound Cues:</span> {section.mdInstructions.soundCues}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Content</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <p className="text-gray-900 dark:text-white mb-4">{section.lyrics}</p>
                          <div className="space-y-2">
                            {section.voiceParts.map(part => (
                              <div key={part.type} className="flex items-start gap-2">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize min-w-[80px]">
                                  {part.type}:
                                </span>
                                <span className="font-mono text-gray-900 dark:text-white">
                                  {part.solfa}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Audio Upload */}
              <div className="mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Audio Upload
                    </h2>
                    {song.isProcessing && (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Upload Audio File</span>
                      </motion.div>
                    </label>
                    {song.audioFile && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span>{song.audioFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Section Button */}
              <div className="mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addSection}
                  className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Section</span>
                </motion.button>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {song.sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Section {index + 1}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteSection(section.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* MD Instructions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mic className="w-4 h-4 text-gray-500" />
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Music Direction
                          </label>
                        </div>
                        <textarea
                          value={section.mdInstructions.musicDirection}
                          onChange={(e) => updateSection(section.id, {
                            mdInstructions: { ...section.mdInstructions, musicDirection: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder="Enter music direction..."
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Choir Instruction
                          </label>
                        </div>
                        <textarea
                          value={section.mdInstructions.choirInstruction}
                          onChange={(e) => updateSection(section.id, {
                            mdInstructions: { ...section.mdInstructions, choirInstruction: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder="Enter choir instruction..."
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sound Cues
                          </label>
                        </div>
                        <textarea
                          value={section.mdInstructions.soundCues}
                          onChange={(e) => updateSection(section.id, {
                            mdInstructions: { ...section.mdInstructions, soundCues: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder="Enter sound cues..."
                        />
                      </div>
                    </div>

                    {/* Lyrics */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lyrics
                      </label>
                      <textarea
                        value={section.lyrics}
                        onChange={(e) => updateSection(section.id, { lyrics: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Enter lyrics..."
                      />
                    </div>

                    {/* Voice Parts */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Voice Parts
                        </label>
                        <div className="flex gap-2">
                          {['soprano', 'tenor', 'alto', 'bass'].map((type) => (
                            <motion.button
                              key={type}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveVoicePart(type as VoicePart['type'])}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                activeVoicePart === type
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={section.voiceParts.find(part => part.type === activeVoicePart)?.solfa || ''}
                        onChange={(e) => updateVoicePart(section.id, activeVoicePart, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        rows={4}
                        placeholder={`Enter ${activeVoicePart} solfa notation...`}
                      />
                    </div>

                    {/* Time Markers */}
                    {section.startTime !== undefined && section.endTime !== undefined && (
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Start: {section.startTime}s</span>
                        <span>End: {section.endTime}s</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 