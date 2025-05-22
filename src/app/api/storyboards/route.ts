import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a temporary in-memory storage
// In a real app, you would use a database
const storyboards: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const songId = searchParams.get('songId')

  if (!songId) {
    return NextResponse.json(
      { error: 'Song ID is required' },
      { status: 400 }
    )
  }

  const songStoryboards = storyboards.filter(sb => sb.songId === songId)
  return NextResponse.json(songStoryboards)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { songId, sections } = body

    if (!songId || !sections) {
      return NextResponse.json(
        { error: 'Song ID and sections are required' },
        { status: 400 }
      )
    }

    const storyboard = {
      id: Date.now().toString(),
      songId,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    storyboards.push(storyboard)
    return NextResponse.json(storyboard, { status: 201 })
  } catch (error) {
    console.error('Error creating storyboard:', error)
    return NextResponse.json(
      { error: 'Failed to create storyboard' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, sections } = body

    if (!id || !sections) {
      return NextResponse.json(
        { error: 'Storyboard ID and sections are required' },
        { status: 400 }
      )
    }

    const index = storyboards.findIndex(sb => sb.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Storyboard not found' },
        { status: 404 }
      )
    }

    storyboards[index] = {
      ...storyboards[index],
      sections,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(storyboards[index])
  } catch (error) {
    console.error('Error updating storyboard:', error)
    return NextResponse.json(
      { error: 'Failed to update storyboard' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Storyboard ID is required' },
        { status: 400 }
      )
    }

    const index = storyboards.findIndex(sb => sb.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Storyboard not found' },
        { status: 404 }
      )
    }

    storyboards.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting storyboard:', error)
    return NextResponse.json(
      { error: 'Failed to delete storyboard' },
      { status: 500 }
    )
  }
} 