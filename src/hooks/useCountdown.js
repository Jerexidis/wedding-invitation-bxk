import { useState, useEffect } from 'react'

/**
 * Hook reutilizable para cuenta regresiva.
 * @param {string} targetDateTime - Fecha/hora objetivo en formato ISO string.
 * @returns {{ dias, horas, minutos, segundos, isExpired }}
 */
export function useCountdown(targetDateTime) {
    const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        if (!targetDateTime) return

        const eventDate = new Date(targetDateTime).getTime()

        const update = () => {
            const now = new Date().getTime()
            const distance = eventDate - now

            if (distance < 0) {
                setIsExpired(true)
                setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
                return false // signal to clear interval
            }

            setTimeLeft({
                dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
                horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                segundos: Math.floor((distance % (1000 * 60)) / 1000),
            })
            return true // keep running
        }

        update() // initial call
        const timer = setInterval(() => {
            if (!update()) clearInterval(timer)
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDateTime])

    return { ...timeLeft, isExpired }
}
