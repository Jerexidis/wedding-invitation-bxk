import { supabase } from './supabase'

/**
 * Agrega una confirmación de asistencia para una invitación.
 */
export async function addConfirmation(slug, { name, guests, message }) {
    const parsedGuests = Number(guests);
    const { data, error } = await supabase
        .from('rsvp')
        .insert([{ 
            slug, 
            name, 
            guests: isNaN(parsedGuests) ? 1 : parsedGuests, 
            message: message || '' 
        }])
        .select()

    if (error) throw error
    return data[0]
}

/**
 * Actualiza el número de invitados de una confirmación.
 */
export async function updateConfirmationGuests(id, guests) {
    const { data, error } = await supabase
        .from('rsvp')
        .update({ guests: Number(guests) })
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) {
        throw new Error('No se actualizó ningún registro. Es posible que falte la política UPDATE en Supabase para usuarios anónimos.')
    }
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
    return confirmations.reduce((sum, c) => {
        if (slug === 'maria-loyola' || slug === 'angelica-y-salvador') {
            return sum + (Number(c.guests) || 0)
        }
        return sum + (c.guests || 1)
    }, 0)
}
