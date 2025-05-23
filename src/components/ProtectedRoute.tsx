'use client'

import { useRole } from '@/context/RoleProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProtectedRoute({
  children,
  requireDirector = true,
}: {
  children: React.ReactNode
  requireDirector?: boolean
}) {
  const { isDirector } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (requireDirector && !isDirector) {
      router.push('/')
    }
  }, [isDirector, requireDirector, router])

  if (requireDirector && !isDirector) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only accessible to choir directors.
          </p>
        </div>
      </motion.div>
    )
  }

  return <>{children}</>
} 