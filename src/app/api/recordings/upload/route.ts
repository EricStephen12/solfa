import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a temporary in-memory storage
// In a real app, you would use a cloud storage service like AWS S3
const recordings: { id: string; songId: string; url: string; createdAt: string }[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as Blob
    const songId = formData.get('songId') as string

    if (!audio || !songId) {
      return NextResponse.json(
        { error: 'Audio file and song ID are required' },
        { status: 400 }
      )
    }

    // In a real app, you would:
    // 1. Upload the audio file to cloud storage (e.g., AWS S3)
    // 2. Get back a URL for the uploaded file
    // 3. Store the URL in your database

    // For now, we'll create a temporary URL using the Blob
    const url = URL.createObjectURL(audio)
    const recording = {
      id: Date.now().toString(),
      songId,
      url,
      createdAt: new Date().toISOString()
    }

    recordings.push(recording)

    return NextResponse.json(recording, { status: 201 })
  } catch (error) {
    console.error('Error uploading recording:', error)
    return NextResponse.json(
      { error: 'Failed to upload recording' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const songId = searchParams.get('songId')

  if (!songId) {
    return NextResponse.json(
      { error: 'Song ID is required' },
      { status: 400 }
    )
  }

  const songRecordings = recordings.filter(r => r.songId === songId)
  return NextResponse.json(songRecordings)
} 