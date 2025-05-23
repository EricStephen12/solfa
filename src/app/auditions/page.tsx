'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Play, Pause, Volume2, Send, Trash, Eye } from 'lucide-react'
// Import supabase if needed later
// import { supabase } from '@/lib/supabase'
import { useRole } from '@/context/RoleProvider'

// Define placeholder interfaces
interface Audition {
  id: string
  userId: string
  songId?: string // Optional, if linked to a song
  songTitle?: string // Placeholder for song title
  audioUrl: string // URL for the recorded audio
  status: 'pending' | 'reviewed'
  feedback?: string
  createdAt: string
  userName: string // Placeholder for user name
}

// Placeholder data for directors
const placeholderAuditions: Audition[] = [
  {
    id: 'audition-1',
    userId: 'user-1',
    songId: 'song-1',
    songTitle: 'Joyful Praise',
    audioUrl: '/audio/placeholder-audition-1.wav', // Placeholder audio
    status: 'pending',
    createdAt: '2023-10-26T10:00:00Z',
    userName: 'Alice Smith',
  },
  {
    id: 'audition-2',
    userId: 'user-2',
    songId: 'song-3',
    songTitle: 'Spirit Chant',
    audioUrl: '/audio/placeholder-audition-2.wav', // Placeholder audio
    status: 'reviewed',
    feedback: 'Great effort, focus on the high notes.',
    createdAt: '2023-10-25T14:30:00Z',
    userName: 'Bob Johnson',
  },
  // Add more placeholder auditions as needed
]

export default function AuditionsPage() {
  const { role } = useRole()
  const [auditions, setAuditions] = useState<Audition[]>(placeholderAuditions) // Use placeholder data
  const [selectedAudition, setSelectedAudition] = useState<Audition | null>(null)

  // Member Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Playback State for Member Recording & Director Review
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5) // Default volume
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null); // URL for the currently playing audio

  // Director Review State
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitStatus, setFeedbackSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [isLoadingAuditions, setIsLoadingAuditions] = useState(false); // Manage loading state for director list
  const [auditionsError, setAuditionsError] = useState<string | null>(null); // Manage error state for director list

  // Effect to load auditions for directors - currently uses placeholder
  /*
  useEffect(() => {
    if (role === 'director') {
      const loadAuditions = async () => {
        setIsLoadingAuditions(true);
        setAuditionsError(null);
        try {
          const { data, error } = await supabase
            .from('auditions')
            .select(`
              *,
              song (title),
              user (name, email) // Assuming user data is linked
            `)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          setAuditions(data || []);
        } catch (err) {
          console.error('Error loading auditions:', err);
          setAuditionsError('Failed to load auditions.');
        } finally {
          setIsLoadingAuditions(false);
        }
      };
      loadAuditions();
    }
  }, [role]); // Rerun if role changes
  */

  // Effect to handle audio playback source
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      if (playbackUrl) {
        audio.src = playbackUrl;
        audio.load();
        // Note: Autoplay after load might be blocked by browsers, 
        // setIsPlaying(true) would trigger audio.play() on state change effect
      } else {
        audio.src = '';
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playbackUrl, volume]);

  // Effect to control play/pause based on isPlaying state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);


  // Member Recording Functions
  const startRecording = async () => {
    setAudioChunks([]);
    setRecordedAudioUrl(null);
    setUploadStatus('idle');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        setAudioChunks(chunks)
        const url = URL.createObjectURL(audioBlob)
        setRecordedAudioUrl(url);
        setPlaybackUrl(url); // Set for immediate playback review
        stream.getTracks().forEach(track => track.stop()); // Stop microphone stream
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      // Handle error in UI
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleSubmitAudition = async () => {
    if (!audioChunks.length) return

    setIsUploading(true);
    console.log('Simulating audition submission...', audioChunks);

    // Simulate upload and insert
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2; // 80% chance of success

    if (success) {
      setUploadStatus('success');
      // Reset recording state
      setAudioChunks([]);
      setRecordedAudioUrl(null);
      setPlaybackUrl(null);
      // In a real app, you would then clear the local audio URL
      // if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    } else {
      setUploadStatus('error');
    }
    setIsUploading(false);

    // Replace with Supabase upload and insert later:
    /*
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      const fileName = `audition-${Date.now()}.wav`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('auditions')
        .upload(fileName, audioBlob)

      if (uploadError) throw uploadError

      const { data: publicUrl } = supabase.storage
        .from('auditions')
        .getPublicUrl(fileName)

      const { data, error } = await supabase
        .from('auditions')
        .insert([
          {
            audio_url: publicUrl.publicUrl,
            status: 'pending',
            // Add userId, songId here based on context/selection
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        // Update state with the new audition if needed for member view (e.g., list of their submissions)
        // setAuditions(prev => [data[0], ...prev]); 
        setAudioChunks([]);
        setRecordedAudioUrl(null);
        setPlaybackUrl(null);
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        setUploadStatus('success');
      }
    } catch (error) {
      console.error('Error submitting audition:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
    */
  }

  // Director Review Functions
  const handleSelectAudition = (audition: Audition) => {
    setSelectedAudition(audition);
    setPlaybackUrl(audition.audioUrl); // Set audio source for review playback
    setFeedbackText(audition.feedback || ''); // Load existing feedback
    setIsPlaying(false); // Pause current playback when selecting new audition
    setCurrentTime(0); // Reset playback time
    setFeedbackSubmitStatus('idle'); // Reset submit status
  };

  const handleCloseReviewModal = () => {
    setSelectedAudition(null);
    setPlaybackUrl(null); // Clear audio source
    setIsPlaying(false); // Stop playback
    setFeedbackText('');
    setFeedbackSubmitStatus('idle');
  };

  const handleSubmitFeedback = async () => {
    if (!selectedAudition || !feedbackText) return

    setIsSubmittingFeedback(true);
    console.log('Simulating feedback submission for audition:', selectedAudition.id, feedbackText);

    // Simulate update
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = Math.random() > 0.1; // 90% chance of success

    if (success) {
      setFeedbackSubmitStatus('success');
      // Update the audition in the local state (placeholder)
      setAuditions(prev =>
        prev.map(audition =>
          audition.id === selectedAudition.id
            ? { ...audition, feedback: feedbackText, status: 'reviewed' }
            : audition
        )
      );
      // Keep modal open on success for now, can close later
      // handleCloseReviewModal();
    } else {
      setFeedbackSubmitStatus('error');
    }
    setIsSubmittingFeedback(false);

    // Replace with Supabase update later:
    /*
    try {
      const { error } = await supabase
        .from('auditions')
        .update({
          feedback: feedbackText,
          status: 'reviewed'
        })
        .eq('id', selectedAudition.id);

      if (error) throw error;

      setAuditions(prev =>
        prev.map(audition =>
          audition.id === selectedAudition.id
            ? { ...audition, feedback: feedbackText, status: 'reviewed' }
            : audition
        )
      );
      setFeedbackSubmitStatus('success');
      // handleCloseReviewModal();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setFeedbackSubmitStatus('error');
    } finally {
      setIsSubmittingFeedback(false);
    }
    */
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show loading state for initial role check if needed, but role should be available quickly
  // if (role === null) { // Assuming null means still loading
  //   return (
  //     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-12">
  //       Loading role information...
  //     </motion.div>
  //   );
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-8"
    >
      <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 text-center mb-6">Auditions</h1>

      {/* Conditional UI based on Role */}
      {role === 'member' ? (
        // --- Member View: Recording and Submission ---
        <motion.div
          key="member-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gold-300 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Record Your Audition</h2>
          <p className="text-gray-600 dark:text-gray-400">Practice the assigned song and record your best performance.</p>

           {/* Song Selection (Placeholder) */}
           <div>
              <label htmlFor="assignedSong" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Song (Placeholder)</label>
              {/* In a real app, this would fetch assigned songs for the member */}
               <select id="assignedSong" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                 <option value="">Select a song</option>
                 <option value="song-1">Joyful Praise</option>
                 <option value="song-3">Spirit Chant</option>
               </select>
           </div>

          {/* Recording Controls */}
          <div className="flex items-center space-x-4 justify-center">
            {!recordedAudioUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full transition-colors ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                <Mic className="w-8 h-8" />
              </motion.button>
            )}

            {recordedAudioUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className={`p-4 rounded-full transition-colors ${
                  isPlaying
                    ? 'bg-gold-500 hover:bg-gold-600 text-blue-900'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </motion.button>
            )}
             {/* Optional: Retake Button */}
             {recordedAudioUrl && (
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => { setRecordedAudioUrl(null); setAudioChunks([]); setPlaybackUrl(null); setIsPlaying(false); setCurrentTime(0); setDuration(0); setUploadStatus('idle'); setIsUploading(false); }}
                 className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
               >
                 <Trash className="w-8 h-8" />
               </motion.button>
             )}
          </div>

          {/* Playback Progress for Member Recording */}
          {recordedAudioUrl && (
             <div className="flex items-center space-x-4 mt-4">
                <div className="flex-1">
                  <input
                     type="range"
                     min="0"
                     max={duration}
                     value={currentTime}
                     onChange={(e) => {
                       if (audioRef.current) {
                         audioRef.current.currentTime = parseFloat(e.target.value);
                       }
                       setCurrentTime(parseFloat(e.target.value));
                     }}
                     className="w-full accent-gold-500"
                   />
                   <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                     <span>{formatTime(currentTime)}</span>
                     <span>{formatTime(duration)}</span>
                   </div>
                 </div>
                  <div className="flex items-center space-x-2">
                   <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                   <input
                     type="range"
                     min="0"
                     max="1"
                     step="0.01"
                     value={volume}
                     onChange={(e) => setVolume(parseFloat(e.target.value))}
                     className="w-20 accent-gold-500"
                   />
                 </div>
             </div>
          )}

          {/* Submission Button and Status */}
          <div className="text-center">
             {!recordedAudioUrl && !isRecording && !isUploading && uploadStatus === 'idle' && (
                <p className="text-gray-500 dark:text-gray-400">Press the microphone to start recording.</p>
             )}
             {isRecording && (
               <p className="text-red-500 dark:text-red-400 animate-pulse">Recording...</p>
             )}
              {isUploading && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="upload-loading" className="text-blue-600 dark:text-blue-400 mt-4">Submitting...</motion.p>
             )}
             {recordedAudioUrl && !isUploading && uploadStatus === 'idle' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitAudition}
                  disabled={!audioChunks.length || isUploading}
                  className="inline-flex items-center px-6 py-3 bg-gold-500 text-blue-900 rounded-lg font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Audition
                </motion.button>
             )}

             <AnimatePresence mode="wait">
                 {uploadStatus === 'success' && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="upload-success" className="text-green-600 dark:text-green-400 mt-4">Audition submitted successfully!</motion.p>
                )}
                 {uploadStatus === 'error' && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="upload-error" className="text-red-600 dark:text-red-400 mt-4">Submission failed. Please try again.</motion.p>
                )}
             </AnimatePresence>
          </div>

        </motion.div>

      ) : role === 'director' ? (
        // --- Director View: Review and Feedback ---
        <motion.div
          key="director-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 text-center md:text-left">Auditions for Review</h2>

           {/* Auditions List with Loading/Empty/Error States */}
           {isLoadingAuditions ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">Loading auditions...</motion.div>
           ) : auditionsError ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 py-8">{auditionsError}</motion.div>
           ) : auditions.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
               {auditions.map((audition) => (
                 <motion.div
                   key={audition.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
                   whileTap={{ scale: 0.98 }}
                   className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                   onClick={() => handleSelectAudition(audition)}
                 >
                   <div className="flex items-center space-x-4">
                     <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                     <div className="flex-1">
                       <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">Audition from {audition.userName}</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">Song: {audition.songTitle || 'N/A'} • {new Date(audition.createdAt).toLocaleDateString()}</p>
                     </div>
                   </div>
                   <div className="flex items-center justify-end mt-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                       audition.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                       audition.status === 'reviewed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                       'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                     }`}>
                       {audition.status}
                     </span>
                   </div>
                 </motion.div>
               ))}
              </AnimatePresence>
             </div>
           ) : ( // No auditions found
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">
                 <Mic className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Auditions Submitted Yet</h3>
                 <p className="text-gray-600 dark:text-gray-400">Check back later for new submissions.</p>
              </motion.div>
           )}
        </motion.div>

      ) : ( // --- Default View or Other Roles ---
        <motion.div
          key="default-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500 dark:text-gray-400 py-12"
        >
          Content coming soon for your role.
        </motion.div>
      )}

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Director Review Modal */}
      <AnimatePresence>
        {selectedAudition && role === 'director' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseReviewModal} // Close modal on overlay click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()} // Prevent closing modal on modal click
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Review Audition</h3>
              
              {/* Audition Info */}
              <div className="mb-6 space-y-2">
                 <p className="text-gray-600 dark:text-gray-400"><strong>From:</strong> {selectedAudition.userName}</p>
                 <p className="text-gray-600 dark:text-gray-400"><strong>Song:</strong> {selectedAudition.songTitle || 'N/A'}</p>
                 <p className="text-gray-600 dark:text-gray-400"><strong>Submitted:</strong> {new Date(selectedAudition.createdAt).toLocaleString()}</p>
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                       selectedAudition.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                       selectedAudition.status === 'reviewed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                       'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                 }`}>
                   {selectedAudition.status}
                 </span>
              </div>

              {/* Playback Controls for Review */}
              <div className="space-y-4 mb-6">
                 <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayPause} // Uses the same handlePlayPause as member view
                      className={`p-3 rounded-full transition-colors ${
                        isPlaying
                          ? 'bg-gold-500 hover:bg-gold-600 text-blue-900'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </motion.button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = parseFloat(e.target.value);
                          }
                          setCurrentTime(parseFloat(e.target.value));
                        }}
                        className="w-full accent-gold-500"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                     <div className="flex items-center space-x-2">
                      <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 accent-gold-500"
                      />
                    </div>
                 </div>
              </div>

              {/* Feedback Section */}
              <div className="space-y-4 mb-6">
                 <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feedback for Member</label>
                 <textarea
                   id="feedback"
                   rows={4}
                   value={feedbackText}
                   onChange={(e) => setFeedbackText(e.target.value)}
                   className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                   placeholder="Enter your feedback here..."
                 />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                 <button
                   type="button"
                   onClick={handleCloseReviewModal}
                   className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                 >
                   Close
                 </button>
                 <motion.button
                   type="button"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleSubmitFeedback}
                   disabled={isSubmittingFeedback || selectedAudition.status === 'reviewed'}
                   className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                 </motion.button>
              </div>
               <AnimatePresence mode="wait">
                  {feedbackSubmitStatus === 'success' && (
                     <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="feedback-success" className="text-center text-green-600 dark:text-green-400 mt-4">Feedback submitted!</motion.p>
                  )}
                   {feedbackSubmitStatus === 'error' && (
                     <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="feedback-error" className="text-center text-red-600 dark:text-red-400 mt-4">Submission failed. Please try again.</motion.p>
                  )}
               </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
} 