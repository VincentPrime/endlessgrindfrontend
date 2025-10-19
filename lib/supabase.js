import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

// Create Supabase client for file storage only
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // We're not using Supabase auth
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})