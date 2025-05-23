'use client'

import { useState, useEffect, useRef } from 'react'
import { VoicePart } from '@/lib/solfa'

interface AudioPlayerProps {
  notations: Record<VoicePart, string[]>
  activeVoicePart: VoicePart
  onNoteHighlight: (index: number) => void
}

// Voice part frequency ranges (in Hz)
const VOICE_RANGES = {
  soprano: {
    do: 523.25, // C5
    re: 587.33, // D5
    mi: 659.25, // E5
    fa: 698.46, // F5
    sol: 783.99, // G5
    la: 880.00, // A5
    ti: 987.77  // B5
  },
  alto: {
    do: 392.00, // G4
    re: 440.00, // A4
    mi: 493.88, // B4
    fa: 523.25, // C5
    sol: 587.33, // D5
    la: 659.25, // E5
    ti: 698.46  // F5
  },
  tenor: {
    do: 261.63, // C4
    re: 293.66, // D4
    mi: 329.63, // E4
    fa: 349.23, // F4
    sol: 392.00, // G4
    la: 440.00, // A4
    ti: 493.88  // B4
  },
  bass: {
    do: 196.00, // G3
    re: 220.00, // A3
    mi: 246.94, // B3
    fa: 261.63, // C4
    sol: 293.66, // D4
    la: 329.63, // E4
    ti: 349.23  // F4
  }
}

export default function AudioPlayer({
  notations,
  activeVoicePart,
  onNoteHighlight
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainNodeRef = useRef<GainNode | null>(null)

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new AudioContext()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  // Create formant filter for vocal-like sound
  const createFormantFilter = (frequency: number) => {
    if (!audioContextRef.current) return null

    const filter = audioContextRef.current.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = frequency
    filter.Q.value = 1
    filter.gain.value = 10
    return filter
  }

  // Play note function with formant synthesis
  const playNote = (note: string, duration: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    const frequencies = VOICE_RANGES[activeVoicePart]
    const baseFreq = frequencies[note] || 440

    // Create main oscillator
    const mainOsc = audioContextRef.current.createOscillator()
    mainOsc.type = 'sine'
    mainOsc.frequency.value = baseFreq

    // Create formant oscillators for richer sound
    const formant1 = createFormantFilter(baseFreq * 1.5)
    const formant2 = createFormantFilter(baseFreq * 2)
    const formant3 = createFormantFilter(baseFreq * 3)

    // Connect oscillators
    mainOsc.connect(gainNodeRef.current)
    if (formant1) formant1.connect(gainNodeRef.current)
    if (formant2) formant2.connect(gainNodeRef.current)
    if (formant3) formant3.connect(gainNodeRef.current)

    // Add slight vibrato for more natural sound
    const vibrato = audioContextRef.current.createOscillator()
    vibrato.frequency.value = 5
    const vibratoGain = audioContextRef.current.createGain()
    vibratoGain.gain.value = 2
    vibrato.connect(vibratoGain)
    vibratoGain.connect(mainOsc.frequency)

    // Start oscillators
    mainOsc.start()
    vibrato.start()

    // Store oscillators for cleanup
    oscillatorsRef.current = [mainOsc, vibrato]

    // Stop after duration
    const stopTime = audioContextRef.current.currentTime + duration
    mainOsc.stop(stopTime)
    vibrato.stop(stopTime)
  }

  // Play sequence of notes
  const playSequence = async () => {
    if (!isPlaying) return

    const notes = notations[activeVoicePart]
    const noteDuration = 0.5 / playbackSpeed // Base duration of 500ms

    for (let i = 0; i < notes.length; i++) {
      if (!isPlaying) break
      setCurrentNoteIndex(i)
      onNoteHighlight(i)
      playNote(notes[i], noteDuration)
      await new Promise(resolve => setTimeout(resolve, noteDuration * 1000))
    }

    setIsPlaying(false)
    setCurrentNoteIndex(0)
    onNoteHighlight(-1)
  }

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      oscillatorsRef.current.forEach(osc => osc.stop())
    } else {
      setIsPlaying(true)
      playSequence()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">
            Playback Speed: {playbackSpeed}x
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Progress</div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{
              width: `${(currentNoteIndex / notations[activeVoicePart].length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  )
} 