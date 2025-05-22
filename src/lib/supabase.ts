import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string
)

// Create a client with the service role key for server-side operations (bypasses RLS)
export const supabaseService = createClient(
  supabaseUrl as string,
  supabaseServiceRoleKey as string,
  {
    auth: {
      persistSession: false,
    },
  }
) 