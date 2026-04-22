import { useState } from 'react'
import { addConfirmation } from '../utils/rsvpStore'

/**
 * Hook reutilizable para el formulario RSVP.
 * @param {string} slug - Slug de la invitación para guardar en Supabase.
 * @returns {{ formData, handleInputChange, handleSubmit, rsvpStatus, rsvpError, resetForm }}
 *
 * rsvpStatus: 'idle' | 'submitting' | 'success' | 'error'
 * rsvpError: string con el mensaje de error, o null si no hay error
 */
export function useRsvpForm(slug) {
    const [formData, setFormData] = useState({
        name: '',
        guests: 1,
        message: '',
    })
    const [rsvpStatus, setRsvpStatus] = useState('idle')
    const [rsvpError, setRsvpError] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setRsvpStatus('submitting')
        setRsvpError(null)
        try {
            await addConfirmation(slug, {
                name: formData.name,
                guests: Number(formData.guests),
                message: formData.message || '',
            })
            setRsvpStatus('success')
        } catch (err) {
            console.error('Error al confirmar:', err)
            // En lugar de alert(), exponemos el error como estado
            // para que cada template lo muestre en su propio estilo
            setRsvpStatus('error')
            setRsvpError('Hubo un error al enviar tu confirmación. Intenta de nuevo.')
        }
    }

    const resetForm = () => {
        setFormData({ name: '', guests: 1, message: '' })
        setRsvpStatus('idle')
        setRsvpError(null)
    }

    return { formData, handleInputChange, handleSubmit, rsvpStatus, rsvpError, resetForm }
}
