'use client'

import { useParams } from 'next/navigation'
import MusicDirectorSheet from '@/components/MusicDirectorSheet'

export default function MDSheetPage() {
  const params = useParams()
  const songId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MusicDirectorSheet />
    </div>
  )
} 