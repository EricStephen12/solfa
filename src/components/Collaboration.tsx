import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Share2, Users, ThumbsUp, Flag } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  type: 'comment' | 'feedback' | 'suggestion'
  likes: number
}

interface CollaborationProps {
  scriptId: string
  onShare?: (url: string) => void
}

export default function Collaboration({ scriptId, onShare }: CollaborationProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<'comment' | 'feedback' | 'suggestion'>('comment')
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Subscribe to real-time comments
    const subscription = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `script_id=eq.${scriptId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => [...prev, payload.new as Comment])
        } else if (payload.eventType === 'UPDATE') {
          setComments(prev => prev.map(comment => 
            comment.id === payload.new.id ? payload.new as Comment : comment
          ))
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => prev.filter(comment => comment.id !== payload.old.id))
        }
      })
      .subscribe()

    // Load initial comments
    loadComments()

    return () => {
      subscription.unsubscribe()
    }
  }, [scriptId])

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('script_id', scriptId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error loading comments:', error)
      return
    }

    setComments(data as Comment[])
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    const userName = userData.user?.user_metadata?.full_name || 'Anonymous'

    const comment: Omit<Comment, 'id'> = {
      userId,
      userName,
      content: newComment,
      timestamp: new Date().toISOString(),
      type: commentType,
      likes: 0
    }

    const { error } = await supabase
      .from('comments')
      .insert([{ ...comment, script_id: scriptId }])

    if (error) {
      console.error('Error adding comment:', error)
      return
    }

    setNewComment('')
  }

  const handleLike = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .update({ likes: comments.find(c => c.id === commentId)!.likes + 1 })
      .eq('id', commentId)

    if (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    const url = `${window.location.origin}/scripts/${scriptId}`
    setShareUrl(url)
    onShare?.(url)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collaboration</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Comment Input */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => setCommentType('comment')}
              className={`px-3 py-1 rounded-full text-sm ${
                commentType === 'comment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Comment
            </button>
            <button
              onClick={() => setCommentType('feedback')}
              className={`px-3 py-1 rounded-full text-sm ${
                commentType === 'feedback'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => setCommentType('suggestion')}
              className={`px-3 py-1 rounded-full text-sm ${
                commentType === 'suggestion'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Suggestion
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddComment}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Post
            </motion.button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.userName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  comment.type === 'comment'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : comment.type === 'feedback'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {comment.type.charAt(0).toUpperCase() + comment.type.slice(1)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{comment.likes}</span>
                </motion.button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {isSharing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Script
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Copy
              </motion.button>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSharing(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 