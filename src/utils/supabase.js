import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let _supabase = null

export const supabase = new Proxy({}, {
    get(_, prop) {
        if (!_supabase) {
            if (!supabaseUrl || !supabaseAnonKey) {
                console.warn('[Supabase] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configurados. Las funciones de RSVP no estarán disponibles.')
                // Return a no-op client so the app doesn't crash
                return typeof prop === 'function' ? () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) : undefined
            }
            _supabase = createClient(supabaseUrl, supabaseAnonKey)
        }
        const value = _supabase[prop]
        return typeof value === 'function' ? value.bind(_supabase) : value
    }
})
