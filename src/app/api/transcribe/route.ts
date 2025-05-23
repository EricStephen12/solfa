import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Prepare form data for OpenAI Whisper
    const openaiForm = new FormData()
    openaiForm.append('file', file)
    openaiForm.append('model', 'whisper-1')

    const openaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiForm as any,
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.json()
      return NextResponse.json({ error: err.error?.message || 'Transcription failed' }, { status: 500 })
    }

    const data = await openaiRes.json()
    return NextResponse.json({ transcript: data.text })
  } catch (error) {
    console.error('Error in transcription:', error)
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
  }
} 