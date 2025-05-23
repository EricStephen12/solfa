'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Shield },
              { id: 'help', label: 'Help & Support', icon: HelpCircle },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === item.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Settings
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Authentication is currently disabled. This feature will be available in a future update.
                </p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notification Settings
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Notification settings will be available in a future update.
                </p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacy Settings
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Privacy settings will be available in a future update.
                </p>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Help & Support
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Help and support features will be available in a future update.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 