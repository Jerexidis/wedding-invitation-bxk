import React, { useState } from 'react';

const AddToCalendar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    const event = {
        title: "Boda Kassandra & Brian",
        description: "¡Celebra nuestra boda con nosotros!",
        location: "Quinta Maria Jardin de Eventos",
        start: "20260530T160000",
        end: "20260530T230000",
    };

    // URLs de calendarios
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    const outlookStart = "2026-05-30T16:00:00";
    const outlookEnd = "2026-05-30T23:00:00";
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description)}&startdt=${outlookStart}&enddt=${outlookEnd}&location=${encodeURIComponent(event.location)}`;

    const openAppleCalendar = () => {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Boda K&B//ES',
            'BEGIN:VEVENT',
            `DTSTART:${event.start}`,
            `DTEND:${event.end}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}`,
            `LOCATION:${event.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
        window.open(dataUri, '_blank');
    };

    // Estilos dinámicos
    const buttonStyle = {
        background: '#5D7C89', // Azul primario para combinar con el tema
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        letterSpacing: '0.5px'
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '120%',
        left: '50%',
        transform: isOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        background: 'white',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 100,
        minWidth: '220px',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        border: '1px solid #f0f0f0'
    };

    const getLinkStyle = (id) => ({
        textDecoration: 'none',
        color: '#444',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        transition: 'background 0.2s',
        fontSize: '0.95rem',
        background: hoveredLink === id ? '#F8FAFC' : 'transparent',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit'
    });

    return (
        <div style={{ position: 'relative', textAlign: 'center', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                style={buttonStyle}
            >
                <i className="far fa-calendar-check"></i>
                Agendar fecha
            </button>

            <div style={dropdownStyle}>
                <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={getLinkStyle('google')}
                    onMouseEnter={() => setHoveredLink('google')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    <i className="fab fa-google" style={{ color: '#EA4335' }}></i> Google Calendar
                </a>
                <a
                    href={outlookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={getLinkStyle('outlook')}
                    onMouseEnter={() => setHoveredLink('outlook')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    <i className="fab fa-windows" style={{ color: '#0078D4' }}></i> Outlook Online
                </a>
                <button
                    onClick={openAppleCalendar}
                    style={getLinkStyle('apple')}
                    onMouseEnter={() => setHoveredLink('apple')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    <i className="fab fa-apple" style={{ color: '#000' }}></i> Apple
                </button>
            </div>
        </div>
    );
};

export default AddToCalendar;