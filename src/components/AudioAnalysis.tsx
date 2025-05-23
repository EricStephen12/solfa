import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Activity } from 'lucide-react'

interface AudioAnalysisProps {
  onPitchDetected: (pitch: number) => void
  onQualityChange: (quality: 'good' | 'fair' | 'poor') => void
}

export default function AudioAnalysis({ onPitchDetected, onQualityChange }: AudioAnalysisProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioQuality, setAudioQuality] = useState<'good' | 'fair' | 'poor'>('good')
  const [currentPitch, setCurrentPitch] = useState<number | null>(null)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Configure analyser
      analyserRef.current.fftSize = 2048
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      // Start visualization
      const draw = () => {
        if (!analyserRef.current || !canvasRef.current) return

        animationFrameRef.current = requestAnimationFrame(draw)
        analyserRef.current.getByteTimeDomainData(dataArray)

        // Convert to waveform data
        const waveform = Array.from(dataArray).map(value => value / 128.0)
        setWaveformData(waveform)

        // Analyze audio quality
        const rms = Math.sqrt(waveform.reduce((sum, value) => sum + value * value, 0) / waveform.length)
        const quality = rms > 0.7 ? 'good' : rms > 0.3 ? 'fair' : 'poor'
        setAudioQuality(quality)
        onQualityChange(quality)

        // Detect pitch using autocorrelation
        const pitch = detectPitch(dataArray, audioContextRef.current.sampleRate)
        if (pitch) {
          setCurrentPitch(pitch)
          onPitchDetected(pitch)
        }

        // Draw waveform
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = 'rgb(200, 200, 200)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgb(0, 0, 0)'
        ctx.beginPath()

        const sliceWidth = canvas.width / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = v * canvas.height / 2

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          x += sliceWidth
        }

        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()
      }

      draw()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const detectPitch = (dataArray: Uint8Array, sampleRate: number): number | null => {
    // Simple autocorrelation pitch detection
    const correlation = new Float32Array(dataArray.length)
    let maxCorrelation = 0
    let maxIndex = 0

    for (let lag = 0; lag < dataArray.length; lag++) {
      let sum = 0
      for (let i = 0; i < dataArray.length - lag; i++) {
        sum += (dataArray[i] - 128) * (dataArray[i + lag] - 128)
      }
      correlation[lag] = sum

      if (lag > 0 && correlation[lag] > maxCorrelation) {
        maxCorrelation = correlation[lag]
        maxIndex = lag
      }
    }

    if (maxIndex === 0) return null
    return sampleRate / maxIndex
  }

  const getNoteFromPitch = (frequency: number): string => {
    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
    const note = Math.round(noteNum) + 69
    return noteStrings[note % 12]
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Analysis</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Audio Quality Indicator */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Audio Quality: {audioQuality}
            </span>
          </div>
          <div className="h-2 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: audioQuality === 'good' ? '100%' : audioQuality === 'fair' ? '60%' : '30%'
              }}
              className={`h-full ${
                audioQuality === 'good'
                  ? 'bg-green-500'
                  : audioQuality === 'fair'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Pitch Display */}
        {currentPitch && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Pitch: {getNoteFromPitch(currentPitch)} ({Math.round(currentPitch)} Hz)
            </div>
          </div>
        )}

        {/* Waveform Visualization */}
        <canvas
          ref={canvasRef}
          width={400}
          height={100}
          className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg"
        />
      </div>
    </div>
  )
} 