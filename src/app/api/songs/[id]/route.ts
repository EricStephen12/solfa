import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// Assume songs array is imported or fetched from a shared source or database
// For demonstration, we'll use a placeholder structure
interface Song {
  id: string;
  title: string;
  lyrics: string;
  notations: Record<string, string[]>;
  audioPath?: string;
  created_at?: string;
}

// NOTE: In a real app, this data would come from a database
// For this example, we'll simulate finding a song from a list
const findSongById = (id: string): Song | undefined => {
  // This is a placeholder. Replace with database query.
  // Assuming 'songs' is accessible here (e.g., imported from a shared module)
  // For the sake of this isolated file edit, we'll just return a mock song.
  // In a real scenario, you'd need a way to access/query the data store.
  console.warn('Using mock data for findSongById. Replace with database logic.');
  const mockSongs: Song[] = [
    {
      id: '1',
      title: 'Mock Song 1',
      lyrics: 'do re mi',
      notations: { soprano: ['do', 're', 'mi'] },
      created_at: new Date().toISOString(),
    },
    // Add more mock songs if needed
  ];
  return mockSongs.find(song => song.id === id);
};

const updateSongInList = (id: string, updatedSong: Partial<Song>): Song | undefined => {
    console.warn('Using mock data updateSongInList. Replace with database logic.');
    // This is a placeholder. Replace with database update logic.
    // In a real app, you'd update the song in your persistent data store.
    // For this example, we'll just return a merged mock song.
    const existingSong = findSongById(id); // This will return a mock song
    if (!existingSong) return undefined;
    const mergedSong = { ...existingSong, ...updatedSong };
    // In a real app, you would save mergedSong to the database
    return mergedSong;
};

const deleteSongFromList = (id: string): boolean => {
    console.warn('Using mock data deleteSongFromList. Replace with database logic.');
    // This is a placeholder. Replace with database delete logic.
    // In a real app, you'd delete the song from your persistent data store.
    // For this example, we'll just simulate success if a mock song exists.
    const exists = findSongById(id);
    return !!exists; // Simulate successful deletion if it exists
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Fetch a single song by ID using Supabase
    const { data: song, error } = await supabaseService
      .from('songs') // Assuming your table name is 'songs'
      .select('*')
      .eq('id', id) // Assuming the primary key column is 'id'
      .single()

    if (error) {
      console.error('Error fetching song by ID from Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!song) {
      return NextResponse.json({ message: 'Song not found' }, { status: 404 })
    }

    return NextResponse.json(song)
  } catch (error) {
    console.error('Detailed error in GET /api/songs/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    // Update a song by ID using Supabase
    // Assuming your table name is 'songs' and columns match the body properties
    const { data: song, error } = await supabaseService
      .from('songs')
      .update(body) // Update the song data
      .eq('id', id) // Find the song by ID
      .select() // Select the updated row
      .single() // Get the single updated row

    if (error) {
      console.error('Error updating song in Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!song) {
      return NextResponse.json({ message: 'Song not found' }, { status: 404 })
    }

    return NextResponse.json(song)
  } catch (error) {
    console.error('Detailed error in PUT /api/songs/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Delete a song by ID using Supabase
    // Assuming your table name is 'songs' and the primary key column is 'id'
    const { data: song, error } = await supabaseService
      .from('songs')
      .delete()
      .eq('id', id) // Find the song by ID
      .select() // Select the deleted row (optional, but useful for confirmation)
      .single() // Get the single deleted row (optional)

    if (error) {
      console.error('Error deleting song from Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!song) {
      return NextResponse.json({ message: 'Song not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Song deleted successfully' })
  } catch (error) {
    console.error('Detailed error in DELETE /api/songs/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 