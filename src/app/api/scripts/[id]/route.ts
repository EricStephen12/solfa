import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// Assume scripts array is imported or fetched from a shared source or database
// For demonstration, we'll use a placeholder structure
interface Script {
    id: string;
    title: string;
    type: 'director' | 'choir' | 'solfa';
    notes: string;
    songs: string[]; // Array of song IDs
    audioPath?: string;
    created_at?: string; // Supabase often uses created_at
  }

// NOTE: In a real app, this data would come from a database
// For this example, we'll simulate finding a script from a list
const findScriptById = (id: string): Script | undefined => {
    console.warn('Using mock data for findScriptById. Replace with database logic.');
    // This is a placeholder. Replace with database query.
    // Assuming 'scripts' is accessible here (e.g., imported from a shared module)
    const mockScripts: Script[] = [
      {
        id: 'script1',
        title: 'Mock Director Script',
        type: 'director',
        notes: 'Notes for the director',
        songs: ['1', '2'], // Example song IDs
        created_at: new Date().toISOString(),
      },
      {
        id: 'script2',
        title: 'Mock Choir Script',
        type: 'choir',
        notes: 'Notes for the choir',
        songs: ['1'], // Example song IDs
        audioPath: '/uploads/mock-audio.mp3',
        created_at: new Date().toISOString(),
      },
      // Add more mock scripts if needed
    ];
    return mockScripts.find(script => script.id === id);
  };

const updateScriptInList = (id: string, updatedScript: Partial<Script>): Script | undefined => {
    console.warn('Using mock data updateScriptInList. Replace with database logic.');
    // This is a placeholder. Replace with database update logic.
    // In a real app, you'd update the script in your persistent data store.
    const existingScript = findScriptById(id); // This will return a mock script
    if (!existingScript) return undefined;
    const mergedScript = { ...existingScript, ...updatedScript };
    // In a real app, you would save mergedScript to the database
    return mergedScript;
};

const deleteScriptFromList = (id: string): boolean => {
    console.warn('Using mock data deleteScriptFromList. Replace with database logic.');
    // This is a placeholder. Replace with database delete logic.
    // In a real app, you'd delete the script from your persistent data store.
    const exists = findScriptById(id);
    return !!exists; // Simulate successful deletion if it exists
};

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id

    // Fetch a single script by ID from Supabase, joining related songs
    const { data: script, error: scriptError } = await supabaseService
      .from('scripts')
      .select('*, songs(*)') // Select script data and join related songs
      .eq('id', id)
      .single()

    if (scriptError) {
      console.error('Error fetching script by ID from Supabase:', scriptError)
      return NextResponse.json({ message: scriptError.message }, { status: 500 })
    }

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('Detailed error in GET /api/scripts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    const body = await request.json()

    // Update a script by ID in Supabase
    const { data: script, error } = await supabaseService
      .from('scripts')
      .update(body)
      .eq('id', id)
      .select('*, songs(*)')
      .single()

    if (error) {
      console.error('Error updating script in Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('Detailed error in PUT /api/scripts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id

    // Delete a script by ID from Supabase
    const { data: script, error } = await supabaseService
      .from('scripts')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting script from Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Script deleted successfully' })
  } catch (error) {
    console.error('Detailed error in DELETE /api/scripts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 