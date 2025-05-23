import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single Supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Only create the service client if the key is present (server-side)
export const supabaseService = supabaseServiceRoleKey
  ? createClient(
      supabaseUrl as string,
      supabaseServiceRoleKey as string,
      {
        auth: {
          persistSession: false,
        },
      }
    )
  : null 