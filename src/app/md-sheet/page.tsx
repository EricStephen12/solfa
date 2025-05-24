'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Music, User, Calendar } from 'lucide-react'

interface MDSheet {
  id: string
  title: string
  composer: string
  lastModified: string
  sectionCount: number
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

  const createNewSheet = () => {
    const newId = Date.now().toString()
    router.push(`/md-sheet/${newId}`)
  }

  const editSheet = (id: string) => {
    router.push(`/md-sheet/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-[95%] mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Musical Director Sheets
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createNewSheet}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
          >
            <Plus className="w-6 h-6" />
            <span>Create New Sheet</span>
          </motion.button>
        </div>

        {/* MD Sheets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sheets.map((sheet) => (
            <motion.div
              key={sheet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {sheet.title}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editSheet(sheet.id)}
                  className="flex-shrink-0 p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                >
                  <Edit2 className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate text-lg">{sheet.composer}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate text-lg">Last modified: {sheet.lastModified}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-base text-gray-500 dark:text-gray-400">
                    {sheet.sectionCount} sections
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}