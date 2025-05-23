'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, FileText } from 'lucide-react'
import SolfaGenerator from '@/components/SolfaGenerator'
import { type VoicePart } from '@/lib/solfa'

type ScriptView = 'director' | 'choir'

export default function ScriptPage() {
  const [currentView, setCurrentView] = useState<ScriptView>('director')
  const [savedNotations, setSavedNotations] = useState<Record<VoicePart, string[]>>({
    soprano: [],
    alto: [],
    tenor: [],
    bass: []
  })

  const handleNotationGenerated = (notations: Record<VoicePart, string[]>) => {
    setSavedNotations(notations)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Music Scripts
          </h1>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('director')}
              className={`px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 ${
                currentView === 'director'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FileText size={20} />
              <span>Director Script</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('choir')}
              className={`px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 ${
                currentView === 'choir'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Music size={20} />
              <span>Choir Script</span>
            </motion.button>
          </div>
        </div>

        <SolfaGenerator
          mode={currentView === 'director' ? 'script' : 'notation'}
          onNotationGenerated={handleNotationGenerated}
        />
      </div>
    </div>
  )
} 