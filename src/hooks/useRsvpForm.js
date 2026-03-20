import { useState } from 'react'
import { addConfirmation } from '../utils/rsvpStore'

/**
 * Hook reutilizable para el formulario RSVP.
 * @param {string} slug - Slug de la invitación para guardar en Supabase.
 * @returns {{ formData, handleInputChange, handleSubmit, rsvpStatus, resetForm }}
 */
export function useRsvpForm(slug) {
    const [formData, setFormData] = useState({
        name: '',
        guests: 1,
        message: '',
    })
    const [rsvpStatus, setRsvpStatus] = useState('idle') // idle | submitting | success

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setRsvpStatus('submitting')
        try {
            await addConfirmation(slug, {
                name: formData.name,
                guests: Number(formData.guests),
                message: formData.message || '',
            })
            setRsvpStatus('success')
        } catch (err) {
            console.error('Error al confirmar:', err)
            setRsvpStatus('idle')
            alert('Hubo un error al enviar tu confirmación. Intenta de nuevo.')
        }
    }

    const resetForm = () => {
        setFormData({ name: '', guests: 1, message: '' })
        setRsvpStatus('idle')
    }

    return { formData, handleInputChange, handleSubmit, rsvpStatus, resetForm }
}
