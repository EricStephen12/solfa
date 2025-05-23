'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Music, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Choir {
  id: string
  name: string
  description: string
  director_id: string
  created_at: string
}

interface ChoirMember {
  id: string
  choir_id: string
  user_id: string
  role: 'director' | 'member'
  voice_part: 'soprano' | 'alto' | 'tenor' | 'bass'
  joined_at: string
  user?: {
    email: string
  }
}

export default function ChoirManagement() {
  const [choirs, setChoirs] = useState<Choir[]>([])
  const [members, setMembers] = useState<Record<string, ChoirMember[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newChoirName, setNewChoirName] = useState('')
  const [newChoirDescription, setNewChoirDescription] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [selectedChoir, setSelectedChoir] = useState<string | null>(null)

  useEffect(() => {
    loadChoirs()
  }, [])

  const loadChoirs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load all choirs
      const { data: choirsData, error: choirsError } = await supabase
        .from('choirs')
        .select('*')

      if (choirsError) throw choirsError

      setChoirs(choirsData || [])

      // Load members for each choir
      const membersData: Record<string, ChoirMember[]> = {}
      for (const choir of choirsData || []) {
        const { data: choirMembers, error: membersError } = await supabase
          .from('choir_members')
          .select('*, user:users(email)')
          .eq('choir_id', choir.id)

        if (membersError) throw membersError
        membersData[choir.id] = choirMembers || []
      }

      setMembers(membersData)
    } catch (err) {
      console.error('Error loading choirs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load choirs')
    } finally {
      setIsLoading(false)
    }
  }

  const createChoir = async () => {
    try {
      if (!newChoirName.trim()) {
        alert('Please enter a choir name')
        return
      }

      const { data: choir, error: choirError } = await supabase
        .from('choirs')
        .insert({
          name: newChoirName,
          description: newChoirDescription,
          director_id: 'temp-director' // Temporary ID until auth is implemented
        })
        .select()
        .single()

      if (choirError) throw choirError

      // Add director as a member
      const { error: memberError } = await supabase
        .from('choir_members')
        .insert({
          choir_id: choir.id,
          user_id: 'temp-director', // Temporary ID until auth is implemented
          role: 'director',
          voice_part: 'soprano' // Default, can be changed later
        })

      if (memberError) throw memberError

      setNewChoirName('')
      setNewChoirDescription('')
      await loadChoirs()
    } catch (err) {
      console.error('Error creating choir:', err)
      alert(err instanceof Error ? err.message : 'Failed to create choir')
    }
  }

  const addMember = async () => {
    try {
      if (!selectedChoir || !newMemberEmail.trim()) {
        alert('Please select a choir and enter member email')
        return
      }

      // Add member to choir with temporary user ID
      const { error: memberError } = await supabase
        .from('choir_members')
        .insert({
          choir_id: selectedChoir,
          user_id: `temp-${newMemberEmail}`, // Temporary ID until auth is implemented
          role: 'member',
          voice_part: 'soprano' // Default, can be changed later
        })

      if (memberError) throw memberError

      setNewMemberEmail('')
      await loadChoirs()
    } catch (err) {
      console.error('Error adding member:', err)
      alert(err instanceof Error ? err.message : 'Failed to add member')
    }
  }

  const removeMember = async (choirId: string, memberId: string) => {
    try {
      const { error } = await supabase
        .from('choir_members')
        .delete()
        .eq('choir_id', choirId)
        .eq('id', memberId)

      if (error) throw error

      await loadChoirs()
    } catch (err) {
      console.error('Error removing member:', err)
      alert(err instanceof Error ? err.message : 'Failed to remove member')
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New Choir */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Create New Choir
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Choir Name
            </label>
            <input
              type="text"
              value={newChoirName}
              onChange={(e) => setNewChoirName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter choir name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newChoirDescription}
              onChange={(e) => setNewChoirDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter choir description"
              rows={3}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createChoir}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Create Choir
          </motion.button>
        </div>
      </div>

      {/* Choirs List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Choirs
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : choirs.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Choirs Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first choir to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {choirs.map((choir) => (
              <div
                key={choir.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {choir.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {choir.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {members[choir.id]?.length || 0} members
                  </span>
                </div>

                {/* Add Member Form */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter member email"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedChoir(choir.id)
                        addMember()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      <UserPlus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  {members[choir.id]?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.user?.email || 'Member'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.role} • {member.voice_part}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeMember(choir.id, member.id)}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 