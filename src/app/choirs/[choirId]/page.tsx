'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Music, UserPlus, Trash, Edit, ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
// Import supabase if needed later
// import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRole } from '@/context/RoleProvider'
import Link from 'next/link'

// Define placeholder interfaces matching potential backend data
interface Member {
  id: string
  name: string
  email?: string
  voicePart?: 'soprano' | 'alto' | 'tenor' | 'bass'
  joinedAt?: string
}

interface Song {
  id: string
  title: string
  artist?: string // Added for completeness
}

interface Choir {
  id: string
  name: string
  description?: string
  imageUrl?: string
  members?: Member[]
  songs?: Song[]
}

// Placeholder data - more detailed for specific choir view
const placeholderChoirs: Choir[] = [
  {
    id: 'choir-1',
    name: 'Main Choir',
    description: 'The main worship choir of the ministry, leading praise and worship in services.',
    imageUrl: '/images/placeholder-choir-1-large.jpg', // Larger placeholder image
    members: [
      { id: 'm1', name: 'Sarah Adams', email: 'sarah.a@example.com', voicePart: 'soprano', joinedAt: '2022-01-15' },
      { id: 'm2', name: 'David Green', email: 'david.g@example.com', voicePart: 'tenor', joinedAt: '2021-11-01' },
      { id: 'm3', name: 'Jessica Brown', email: 'jessica.b@example.com', voicePart: 'alto', joinedAt: '2022-03-10' },
      { id: 'm4', name: 'Michael Davis', email: 'michael.d@example.com', voicePart: 'bass', joinedAt: '2021-09-20' },
    ],
    songs: [
      { id: 's1', title: 'Awesome God', artist: 'Pastor Chris' },
      { id: 's2', title: 'He Lives', artist: 'Sinach' },
      { id: 's5', title: 'You Are Mighty', artist: 'Pastor Chris' },
    ],
  },
  {
    id: 'choir-2',
    name: 'Youth Alive Choir',
    description: 'A vibrant choir for the youth, expressing faith through contemporary gospel music.',
    imageUrl: '/images/placeholder-choir-2-large.jpg', // Larger placeholder image
    members: [
      { id: 'm3', name: 'Youth Member One', voicePart: 'soprano' },
      { id: 'm4', name: 'Youth Member Two', voicePart: 'alto' },
    ],
    songs: [
      { id: 's3', title: 'Spirit Chant', artist: 'Eben' },
      { id: 's4', title: 'Higher Life', artist: 'Joe Praize' },
    ],
  },
  {
     id: 'choir-3',
     name: 'Gospel Groovers',
     description: 'Bringing the latest in contemporary gospel and urban praise sounds.',
     imageUrl: '/images/placeholder-choir-3-large.jpg', // Larger placeholder image
     members: [],
     songs: [],
  }
];

export default function ChoirDetailPage() {
  const { choirId } = useParams()
  const router = useRouter()
  const { role, isLoading: roleLoading } = useRole()
  const [choir, setChoir] = useState<Choir | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Manage loading state
  const [error, setError] = useState<string | null>(null) // Manage error state

  // State for director actions (placeholders)
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberVoicePart, setNewMemberVoicePart] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano');
  const [isAssigningSong, setIsAssigningSong] = useState(false);
  const [songToAssign, setSongToAssign] = useState(''); // Placeholder song ID

  // Effect to load choir details based on choirId
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate fetching data
    const foundChoir = placeholderChoirs.find(c => c.id === choirId);
    
    if (foundChoir) {
      setChoir(foundChoir);
      setIsLoading(false);
    } else {
      setChoir(null);
      setError('Choir not found.');
      setIsLoading(false);
    }

    // Replace with Supabase fetch later:
    /*
    const loadChoir = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('choirs')
          .select(`
            *,
            members (*),
            songs (id, title)
          `)
          .eq('id', choirId)
          .single();
        
        if (error) throw error;
        
        setChoir(data || null);
      } catch (err) {
        console.error('Error loading choir:', err);
        setError('Failed to load choir details.');
      } finally {
        setIsLoading(false);
      }
    };
    loadChoir();
    */

  }, [choirId]); // Rerun effect when choirId changes

  // Placeholder Director Actions
  const handleAddMember = () => {
    console.log('Adding member:', newMemberName, newMemberVoicePart, ' to ', choir?.name);
    // Simulate adding member to placeholder data (won't persist)
    if (choir) {
        const newMember: Member = { id: `m-${Date.now()}`, name: newMemberName, voicePart: newMemberVoicePart };
        setChoir(prev => prev ? { ...prev, members: [...(prev.members || []), newMember] } : null);
        setNewMemberName('');
        setNewMemberVoicePart('soprano');
        setIsAddingMember(false);
    }
  };

   const handleRemoveMember = (memberId: string) => {
     console.log('Removing member:', memberId, ' from ', choir?.name);
     if (choir) {
       setChoir(prev => prev ? { ...prev, members: prev.members?.filter(m => m.id !== memberId) } : null);
     }
   };

   const handleAssignSong = () => {
     console.log('Assigning song:', songToAssign, ' to ', choir?.name);
     // Simulate assigning song (won't persist)
     if (choir && songToAssign) {
         // Find the placeholder song by ID (assuming placeholderSongs from /songs page exists or is accessible)
         // For simplicity here, just add a dummy song object
         const dummySong: Song = { id: songToAssign, title: `Song ${songToAssign}` }; // Replace with actual song data later
         setChoir(prev => prev ? { ...prev, songs: [...(prev.songs || []), dummySong] } : null);
         setSongToAssign('');
         setIsAssigningSong(false);
     }
   };

   const handleRemoveSong = (songId: string) => {
     console.log('Removing song:', songId, ' from ', choir?.name);
     if (choir) {
        setChoir(prev => prev ? { ...prev, songs: prev.songs?.filter(s => s.id !== songId) } : null);
     }
   };

  // Show loading, error, or not found states
  if (isLoading || roleLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-12">
        Loading choir details...
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 dark:text-red-400 py-12">
        {error}
      </motion.div>
    )
  }

  if (!choir) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-12">
        Choir not found.
      </motion.div>
    )
  }

  // Render choir details for all users
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 py-8"
    >
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        whileHover={{ x: -5 }}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Choirs
      </motion.button>

      {/* Choir Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gold-300 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden relative bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center">
           {choir.imageUrl ? (
             <Image
               src={choir.imageUrl}
               alt={choir.name}
               fill
               className="object-cover"
             />
           ) : (
             <Users className="w-16 h-16 text-blue-600 dark:text-blue-400" />
           )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{choir.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{choir.description || 'No description provided.'}</p>

          {/* Director Actions for Choir Management */}
          {role === 'director' && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
               {/* Add Member Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingMember(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </motion.button>
               {/* Assign Song Button */}
               <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAssigningSong(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Music className="w-4 h-4 mr-2" />
                Assign Song
              </motion.button>
              {/* Edit Choir Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                 // onClick={() => handleEditChoir()} // Implement edit functionality later
                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Choir
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">Members ({choir.members?.length || 0})</h2>
        {choir.members && choir.members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
            {choir.members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                   {member.email && <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>}
                </div>
                 <div className="flex items-center space-x-4">
                  {member.voicePart && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {member.voicePart.charAt(0).toUpperCase() + member.voicePart.slice(1)}
                    </span>
                  )}
                   {role === 'director' && (
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => handleRemoveMember(member.id)} // Placeholder remove logic
                       className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                     >
                       <Trash className="w-4 h-4" />
                     </motion.button>
                   )}
                 </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        ) : ( // No members found
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-4">
            No members in this choir yet.
          </motion.div>
        )}
      </div>

      {/* Songs List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">Assigned Songs ({choir.songs?.length || 0})</h2>
        {choir.songs && choir.songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {choir.songs.map((song) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <Music className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">{song.title}</span>
                       {song.artist && <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>}
                    </div>
                  </div>
                   {role === 'director' && (
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => handleRemoveSong(song.id)} // Placeholder remove logic
                       className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                     >
                       <Trash className="w-4 h-4" />
                     </motion.button>
                   )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : ( // No songs assigned
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-4">
            No songs assigned to this choir yet.
          </motion.div>
        )}
      </div>

      {/* Add Member Modal (Placeholder) */}
      <AnimatePresence>
        {isAddingMember && role === 'director' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsAddingMember(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Member</h3>
              <div className="space-y-4">
                 {/* Form fields for member details */}
                <div>
                  <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input type="text" id="memberName" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="memberVoicePart" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Voice Part</label>
                   <select id="memberVoicePart" value={newMemberVoicePart} onChange={(e) => setNewMemberVoicePart(e.target.value as any)} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                     <option value="soprano">Soprano</option>
                     <option value="alto">Alto</option>
                     <option value="tenor">Tenor</option>
                     <option value="bass">Bass</option>
                   </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setIsAddingMember(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Cancel</button>
                   <button type="button" onClick={handleAddMember} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Member</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

       {/* Assign Song Modal (Placeholder) */}
      <AnimatePresence>
        {isAssigningSong && role === 'director' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsAssigningSong(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assign Song</h3>
              <div className="space-y-4">
                {/* Placeholder: Song selection dropdown/list */}
                <div>
                  <label htmlFor="songToAssign" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Song (Placeholder)</label>
                   {/* This would ideally be a searchable dropdown with songs */}
                   <input type="text" id="songToAssign" value={songToAssign} onChange={(e) => setSongToAssign(e.target.value)} placeholder="Enter Song ID (Placeholder)" className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setIsAssigningSong(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Cancel</button>
                  <button type="button" onClick={handleAssignSong} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Assign Song</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
} 