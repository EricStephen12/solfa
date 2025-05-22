'use client'

import { useState } from 'react'

interface StoryboardProps {
  songId: string
  onSave: (storyboard: StoryboardData) => void
}

export interface StoryboardData {
  id: string
  songId: string
  sections: StoryboardSection[]
  createdAt: string
  updatedAt: string
}

interface StoryboardSection {
  id: string
  title: string
  description: string
  startTime: number
  endTime: number
  notes: string
}

export default function Storyboard({ songId, onSave }: StoryboardProps) {
  const [sections, setSections] = useState<StoryboardSection[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentSection, setCurrentSection] = useState<Partial<StoryboardSection>>({})

  const addSection = () => {
    if (!currentSection.title) return

    const newSection: StoryboardSection = {
      id: Date.now().toString(),
      title: currentSection.title,
      description: currentSection.description || '',
      startTime: currentSection.startTime || 0,
      endTime: currentSection.endTime || 0,
      notes: currentSection.notes || ''
    }

    setSections([...sections, newSection])
    setCurrentSection({})
    setIsEditing(false)
  }

  const updateSection = (id: string, updates: Partial<StoryboardSection>) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    ))
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id))
  }

  const handleSave = () => {
    const storyboard: StoryboardData = {
      id: Date.now().toString(),
      songId,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    onSave(storyboard)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Performance Storyboard</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Section
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Section</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={currentSection.title || ''}
                onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={currentSection.description || ''}
                onChange={(e) => setCurrentSection({ ...currentSection, description: e.target.value })}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time (seconds)
                </label>
                <input
                  type="number"
                  id="startTime"
                  value={currentSection.startTime || 0}
                  onChange={(e) => setCurrentSection({ ...currentSection, startTime: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time (seconds)
                </label>
                <input
                  type="number"
                  id="endTime"
                  value={currentSection.endTime || 0}
                  onChange={(e) => setCurrentSection({ ...currentSection, endTime: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                value={currentSection.notes || ''}
                onChange={(e) => setCurrentSection({ ...currentSection, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setCurrentSection({})
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={addSection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
              </div>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-red-600 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Start Time:</span>
                <span className="ml-2 text-sm text-gray-500">{section.startTime}s</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">End Time:</span>
                <span className="ml-2 text-sm text-gray-500">{section.endTime}s</span>
              </div>
            </div>

            {section.notes && (
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700">Notes:</span>
                <p className="mt-1 text-sm text-gray-500">{section.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {sections.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Storyboard
          </button>
        </div>
      )}
    </div>
  )
} 