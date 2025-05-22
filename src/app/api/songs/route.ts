import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch all songs using Supabase
    const { data: songs, error } = await supabaseService
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching songs from Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(songs || [])
  } catch (error) {
    console.error('Detailed error in GET /api/songs:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, lyrics, voiceParts, solfaNotation } = body

    if (!title || !lyrics || !voiceParts) {
      return NextResponse.json(
        { error: 'Title, lyrics, and voice parts are required' },
        { status: 400 }
      )
    }

    // Create a new song using Supabase
    const { data: song, error } = await supabaseService
      .from('songs')
      .insert([{ 
        title, 
        lyrics, 
        voiceParts,
        solfaNotation,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating song in Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(song, { status: 201 })
  } catch (error) {
    console.error('Detailed error in POST /api/songs:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
