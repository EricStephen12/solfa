'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Bell, Lock, Music, Mic } from 'lucide-react'
// import { supabase } from '@/lib/supabase' // Removed Supabase import
import { useRole } from '@/context/RoleProvider'
import Image from 'next/image'

interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: 'director' | 'member'
  preferences: {
    notifications: boolean
    darkMode: boolean
    autoPlay: boolean
  }
  stats: {
    songsLearned: number
    auditionsSubmitted: number
    feedbackReceived: number
  }
}

// Placeholder data for the profile
const placeholderProfile: UserProfile = {
  id: '1',
  name: 'Director John Doe',
  email: 'john.doe@example.com',
  avatarUrl: '/images/placeholder-avatar.jpg', // Placeholder avatar image
  role: 'director',
  preferences: {
    notifications: true,
    darkMode: false,
    autoPlay: true,
  },
  stats: {
    songsLearned: 50,
    auditionsSubmitted: 12,
    feedbackReceived: 35,
  },
}

export default function ProfilePage() {
  const { role } = useRole()
  // Initialize with placeholder data
  const [profile, setProfile] = useState<UserProfile>(placeholderProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>(placeholderProfile)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'stats'>('profile')

  // Removed useEffect for loading profile from Supabase
  /*
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setEditedProfile(data)
      }
    }

    loadProfile()
  }, [])
  */

  // Placeholder save function - does not interact with backend
  const handleSaveProfile = () => {
    // Simulate saving locally for UI demonstration
    setProfile(prev => prev ? { ...prev, ...editedProfile as UserProfile } : editedProfile as UserProfile);
    setIsEditing(false);
    console.log('Simulating profile save:', editedProfile);
  };

  // Placeholder avatar change function - does not interact with backend storage
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    // Simulate local avatar change for UI demonstration
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
    console.log('Simulating avatar change');
  };

  // Removed loading state check
  // if (!profile) { return (...) }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              {/* Use editedProfile for display when editing, otherwise use profile */}
              {(isEditing ? editedProfile.avatarUrl : profile.avatarUrl) ? (
                <Image
                  src={isEditing ? editedProfile.avatarUrl! : profile.avatarUrl!}
                  alt={isEditing ? editedProfile.name || '' : profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Settings className="w-4 h-4" />
              </label>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {/* Use editedProfile for display when editing, otherwise use profile */}
                  {isEditing ? editedProfile.name : profile.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {/* Use editedProfile for display when editing, otherwise use profile */}
                  {isEditing ? editedProfile.email : profile.email}
                </p>
                <div className="mt-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {/* Use editedProfile for display when editing, otherwise use profile */}
                    {isEditing ? editedProfile.role : profile.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {(['profile', 'settings', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editedProfile.name || ''}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editedProfile.email || ''}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
              />
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive updates about your auditions and feedback
                  </p>
                </div>
              </div>
              {/* Use editedProfile for checkbox state */}
              <input
                type="checkbox"
                checked={editedProfile.preferences?.notifications || false}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  preferences: {
                    ...(prev.preferences || {}),
                    notifications: e.target.checked
                  }
                }))}
                disabled={!isEditing}
                className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch to a darker theme
                  </p>
                </div>
              </div>
              {/* Use editedProfile for checkbox state */}
              <input
                type="checkbox"
                checked={editedProfile.preferences?.darkMode || false}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  preferences: {
                    ...(prev.preferences || {}),
                    darkMode: e.target.checked
                  }
                }))}
                disabled={!isEditing}
                className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Music className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Auto-play Songs
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically play the next song in a list
                  </p>
                </div>
              </div>
              {/* Use editedProfile for checkbox state */}
              <input
                type="checkbox"
                checked={editedProfile.preferences?.autoPlay || false}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  preferences: {
                    ...(prev.preferences || {}),
                    autoPlay: e.target.checked
                  }
                }))}
                disabled={!isEditing}
                className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Songs Learned</p>
                  {/* Use profile for stats display */}
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{profile.stats.songsLearned}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Auditions Submitted</p>
                  {/* Use profile for stats display */}
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{profile.stats.auditionsSubmitted}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Feedback Received</p>
                  {/* Use profile for stats display */}
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{profile.stats.feedbackReceived}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 