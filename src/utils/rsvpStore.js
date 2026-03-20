import { supabase } from './supabase'

/**
 * Agrega una confirmación de asistencia para una invitación.
 */
export async function addConfirmation(slug, { name, guests, message }) {
    const { data, error } = await supabase
        .from('rsvp')
        .insert([{ slug, name, guests: Number(guests) || 1, message: message || '' }])
        .select()

    if (error) throw error
    return data[0]
}

/**
 * Obtiene todas las confirmaciones de una invitación ordenadas por fecha.
 */
export async function getConfirmations(slug) {
    const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Elimina una confirmación por su ID.
 */
export async function removeConfirmation(id) {
    const { error } = await supabase
        .from('rsvp')
        .delete()
        .eq('id', id)

    if (error) throw error
}

/**
 * Obtiene el total de invitados confirmados para una invitación.
 */
export async function getTotalGuests(slug) {
    const confirmations = await getConfirmations(slug)
    return confirmations.reduce((sum, c) => sum + (c.guests || 1), 0)
}
