import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let _supabase = null
let _warned = false

/**
 * Stub encadenable que no hace nada.
 * Soporta cadenas como .from('x').insert([...]).select().eq('a','b')
 * y al hacer await devuelve { data: null, error }.
 */
const _noopError = new Error('Supabase not configured')

function _createNoopChain() {
    return new Proxy(() => _createNoopChain(), {
        get(_, prop) {
            // Cuando se hace await o .then(), resolver con resultado vacío
            if (prop === 'then') {
                return (resolve) => resolve({ data: null, error: _noopError })
            }
            // Cualquier otra propiedad devuelve otra función encadenable
            return () => _createNoopChain()
        },
    })
}

export const supabase = new Proxy({}, {
    get(_, prop) {
        if (!_supabase) {
            if (!supabaseUrl || !supabaseAnonKey) {
                if (!_warned) {
                    console.warn('[Supabase] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configurados. Las funciones de RSVP no estarán disponibles.')
                    _warned = true
                }
                // Devolver función que inicia cadena no-op (para .from(), .auth, etc.)
                return () => _createNoopChain()
            }
            _supabase = createClient(supabaseUrl, supabaseAnonKey)
        }
        const value = _supabase[prop]
        return typeof value === 'function' ? value.bind(_supabase) : value
    }
})
