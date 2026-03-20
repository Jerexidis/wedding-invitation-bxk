import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bknenwoftjgxfnngesly.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbmVud29mdGpneGZubmdlc2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzEwMTcsImV4cCI6MjA4OTQ0NzAxN30.bqsdH50V_GCKFKfpGlOVs1DB7ZKoNEVS9vVBYwDsbYw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
