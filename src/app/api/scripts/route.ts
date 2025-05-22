import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// In-memory storage for demonstration purposes
// In a real application, you would use a database
interface Script {
  id: string;
  title: string;
  type: 'director' | 'choir' | 'solfa';
  notes: string;
  songs: string[]; // Array of song IDs
  audioPath?: string;
  created_at?: string; // Supabase often uses created_at
}

const scripts: Script[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const typeFilter = searchParams.get('type')
    const id = searchParams.get('id') // Allow fetching single script via this route too

    if (id) {
      // Fetch a single script by ID using Supabase
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

    } else {
      // Fetch all scripts using Supabase, optionally filtered by type
      let query = supabaseService
        .from('scripts')
        .select('*, songs(*)') // Select script data and join related songs
        .order('created_at', { ascending: false })

      if (typeFilter && ['director', 'choir', 'solfa'].includes(typeFilter)) {
        query = query.eq('type', typeFilter)
      }

      const { data: scripts, error: scriptsError } = await query

      if (scriptsError) {
        console.error('Error fetching scripts from Supabase:', scriptsError)
        return NextResponse.json({ message: scriptsError.message }, { status: 500 })
      }

      console.log(`Found ${scripts?.length || 0} scripts`)
      return NextResponse.json(scripts)
    }

  } catch (error: any) {
    console.error('Detailed error in GET /api/scripts:', error)
    // Check if it's a connection error
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('request to')) {
        return NextResponse.json(
          { message: 'Could not connect to database. Please check your Supabase connection string and network access.' },
          { status: 503 }
        )
      }
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, notes, songs, audioPath } = body

    if (!title || !type || !songs) {
      return NextResponse.json(
        { error: 'Title, type, and songs are required' },
        { status: 400 }
      )
    }

    if (!['director', 'choir', 'solfa'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid script type' },
        { status: 400 }
      )
    }

    // Create a new script using Supabase
    // Assuming your table name is 'scripts' and columns match the body properties
    const { data: script, error } = await supabaseService
      .from('scripts')
      .insert([{ title, type, notes, songs, audioPath }]) // Insert the new script data
      .select() // Select the inserted row
      .single() // Get the single inserted row

    if (error) {
      console.error('Error creating script in Supabase:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error('Detailed error in POST /api/scripts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    // Update a script by ID using Supabase
    // Assuming your table name is 'scripts' and the primary key column is 'id'
    const { data: script, error } = await supabaseService
      .from('scripts')
      .update(data) // Update the script data
      .eq('id', id) // Find the script by ID
      .select('*, songs(*)') // Select the updated row and join related songs
      .single() // Get the single updated row

    if (error) {
      console.error('Error updating script:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error updating script:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    // Delete a script by ID using Supabase
    // Assuming your table name is 'scripts' and the primary key column is 'id'
    const { data: script, error } = await supabaseService
      .from('scripts')
      .delete()
      .eq('id', id) // Find the script by ID
      .select() // Select the deleted row (optional, but useful for confirmation)
      .single() // Get the single deleted row (optional)

    if (error) {
      console.error('Error deleting script:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Script deleted successfully' })
  } catch (error) {
    console.error('Error deleting script:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 