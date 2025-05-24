'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Music, FileText, Send, Search, ArrowLeft, ArrowUp, ArrowDown, ThumbsUp, ThumbsDown, Share2, Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  category: string
  votes: number
  likes: number
  dislikes: number
  shares: number
  bookmarks: number
  views: number
  comments: Comment[]
  attachments?: {
    type: 'song' | 'script'
    title: string
    url: string
  }[]
  userInteractions?: {
    hasLiked: boolean
    hasDisliked: boolean
    hasBookmarked: boolean
  }
}

interface Comment {
  id: string
  content: string
  author: string
  timestamp: string
  votes: number
  likes: number
  dislikes: number
  replies: Comment[]
  userInteractions?: {
    hasLiked: boolean
    hasDisliked: boolean
  }
}

// Placeholder data with tracking
const placeholderPosts: Post[] = [
  {
    id: '1',
    title: 'New arrangement of "Joyful Praise" - Feedback needed!',
    content: 'I just finished a new arrangement of "Joyful Praise". Would love to get some feedback on the harmonies and transitions.',
    author: 'John Doe',
    timestamp: '2024-03-15T10:30:00Z',
    category: 'Arrangements',
    votes: 15,
    likes: 12,
    dislikes: 3,
    shares: 5,
    bookmarks: 8,
    views: 156,
    userInteractions: {
      hasLiked: false,
      hasDisliked: false,
      hasBookmarked: false
    },
    comments: [
      {
        id: 'c1',
        content: 'The transition to the bridge is really smooth! Maybe consider adding a key change in the final chorus?',
        author: 'Jane Smith',
        timestamp: '2024-03-15T11:00:00Z',
        votes: 8,
        likes: 6,
        dislikes: 2,
        replies: [],
        userInteractions: {
          hasLiked: false,
          hasDisliked: false
        }
      }
    ],
    attachments: [{
      type: 'song',
      title: 'Joyful Praise - New Arrangement',
      url: '/songs'
    }]
  },
  {
    id: '2',
    title: 'Tips for improving solfa notation accuracy',
    content: 'I\'ve been working on my solfa notation skills. Here are some techniques that helped me improve my accuracy...',
    author: 'Mike Johnson',
    timestamp: '2024-03-14T15:45:00Z',
    category: 'Solfa Notation',
    votes: 23,
    comments: [],
    attachments: [{
      type: 'script',
      title: 'Practice Exercises',
      url: '/songs'
    }]
  }
]

export default function CollaborationPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(placeholderPosts)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top' | 'trending'>('hot')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState('')

  // Track post views
  useEffect(() => {
    const trackView = (postId: string) => {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, views: post.views + 1 } : post
      ))
    }

    // Track view when post is selected
    if (selectedPost) {
      trackView(selectedPost.id)
    }
  }, [selectedPost])

  // Handle post interactions
  const handlePostInteraction = (postId: string, type: 'like' | 'dislike' | 'bookmark' | 'share') => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post

      const interactions = post.userInteractions || {
        hasLiked: false,
        hasDisliked: false,
        hasBookmarked: false
      }

      switch (type) {
        case 'like':
          return {
            ...post,
            likes: interactions.hasLiked ? post.likes - 1 : post.likes + 1,
            dislikes: interactions.hasDisliked ? post.dislikes - 1 : post.dislikes,
            userInteractions: {
              ...interactions,
              hasLiked: !interactions.hasLiked,
              hasDisliked: false
            }
          }
        case 'dislike':
          return {
            ...post,
            dislikes: interactions.hasDisliked ? post.dislikes - 1 : post.dislikes + 1,
            likes: interactions.hasLiked ? post.likes - 1 : post.likes,
            userInteractions: {
              ...interactions,
              hasDisliked: !interactions.hasDisliked,
              hasLiked: false
            }
          }
        case 'bookmark':
          return {
            ...post,
            bookmarks: interactions.hasBookmarked ? post.bookmarks - 1 : post.bookmarks + 1,
            userInteractions: {
              ...interactions,
              hasBookmarked: !interactions.hasBookmarked
            }
          }
        case 'share':
          return {
            ...post,
            shares: post.shares + 1
          }
        default:
          return post
      }
    }))
  }

  // Handle comment interactions
  const handleCommentInteraction = (postId: string, commentId: string, type: 'like' | 'dislike') => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post

      const updatedComments = post.comments.map(comment => {
        if (comment.id !== commentId) return comment

        const interactions = comment.userInteractions || {
          hasLiked: false,
          hasDisliked: false
        }

        if (type === 'like') {
          return {
            ...comment,
            likes: interactions.hasLiked ? comment.likes - 1 : comment.likes + 1,
            dislikes: interactions.hasDisliked ? comment.dislikes - 1 : comment.dislikes,
            userInteractions: {
              hasLiked: !interactions.hasLiked,
              hasDisliked: false
            }
          }
        } else {
          return {
            ...comment,
            dislikes: interactions.hasDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
            likes: interactions.hasLiked ? comment.likes - 1 : comment.likes,
            userInteractions: {
              hasDisliked: !interactions.hasDisliked,
              hasLiked: false
            }
          }
        }
      })

      return { ...post, comments: updatedComments }
    }))
  }

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'hot':
          return b.votes - a.votes
        case 'new':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case 'top':
          return b.votes - a.votes
        case 'trending':
          return b.views - a.views
        default:
          return 0
      }
    })

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      ...newPost,
      author: 'You', // Replace with actual user name later
      timestamp: new Date().toISOString(),
      votes: 0,
      likes: 0,
      dislikes: 0,
      shares: 0,
      bookmarks: 0,
      views: 0,
      comments: []
    }

    setPosts(prev => [post, ...prev])
    setNewPost({ title: '', content: '', category: 'General' })
  }

  const handleVote = (postId: string, increment: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, votes: post.votes + increment } : post
    ))
  }

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'You', // Replace with actual user name later
      timestamp: new Date().toISOString(),
      votes: 0,
      likes: 0,
      dislikes: 0,
      replies: []
    }

    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ))
    setNewComment('')
  }

  const handleAttachmentClick = (url: string) => {
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full px-1 sm:px-4 lg:max-w-7xl lg:mx-auto sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8"
        >
          Music Discussion
        </motion.h1>

        {/* Search and Sort */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
        <input
          type="text"
              placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300 hover:shadow-xl"
        />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'hot' | 'new' | 'top' | 'trending')}
            className="w-full sm:w-auto px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300 hover:shadow-xl"
          >
            <option value="hot">Hot</option>
            <option value="new">New</option>
            <option value="top">Top</option>
            <option value="trending">Trending</option>
          </select>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {['All', 'Arrangements', 'Solfa Notation', 'Music Theory', 'General'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                (selectedCategory === category || (category === 'All' && !selectedCategory))
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
      </motion.div>

        {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm mb-8"
        >
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-6">Create Post</h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300 hover:shadow-xl"
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300 hover:shadow-xl h-32 resize-none"
            />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <select
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full sm:w-auto px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300 hover:shadow-xl"
              >
                <option value="General">General</option>
                <option value="Arrangements">Arrangements</option>
                <option value="Solfa Notation">Solfa Notation</option>
                <option value="Music Theory">Music Theory</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePost}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
              >
                Post
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Voting */}
                <div className="flex sm:flex-col items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePostInteraction(post.id, 'like')}
                    className={`p-2 rounded-xl ${
                      post.userInteractions?.hasLiked
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <ThumbsUp className="w-6 h-6" />
                  </motion.button>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{post.likes}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePostInteraction(post.id, 'dislike')}
                    className={`p-2 rounded-xl ${
                      post.userInteractions?.hasDisliked
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <ThumbsDown className="w-6 h-6" />
                  </motion.button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.dislikes}</span>
            </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePostInteraction(post.id, 'bookmark')}
                        className={`p-2 rounded-xl ${
                          post.userInteractions?.hasBookmarked
                            ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePostInteraction(post.id, 'share')}
                        className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300"
                            >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">{post.content}</p>
                  
                  {/* Post Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{post.views} views</span>
                    <span>{post.shares} shares</span>
                    <span>{post.bookmarks} bookmarks</span>
            </div>

                  {/* Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.attachments.map((attachment, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAttachmentClick(attachment.url)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"
                        >
                          {attachment.type === 'song' ? <Music className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          <span className="text-sm">{attachment.title}</span>
                        </motion.button>
                      ))}
                    </div>
            )}

                  {/* Comments */}
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words mb-2">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCommentInteraction(post.id, comment.id, 'like')}
                            className={`p-1 rounded-lg ${
                              comment.userInteractions?.hasLiked
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </motion.button>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{comment.likes}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCommentInteraction(post.id, comment.id, 'dislike')}
                            className={`p-1 rounded-lg ${
                              comment.userInteractions?.hasDisliked
                                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </motion.button>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{comment.dislikes}</span>
                          </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
        </div>
      </div>
    </div>
  )
} 