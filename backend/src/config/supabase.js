import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)

export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseSecret = createClient(supabaseUrl, supabaseSecretKey)
