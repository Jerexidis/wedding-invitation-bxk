import React, { useState } from 'react';

// SVGs inline — reemplazan Font Awesome (eliminado del proyecto)
const CalendarCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <polyline points="9 16 11 18 15 14"/>
    </svg>
);
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
        <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/>
        <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
    </svg>
);
const OutlookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0078D4" width="18" height="18" aria-hidden="true">
        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.32-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.01V2.62q0-.46.33-.8.33-.32.8-.32h12.67q.46 0 .8.33.32.33.32.8V8h1q.41 0 .7.3.3.29.3.7zm-22.97 0q0 1.2.56 2.08t1.56.88q1 0 1.55-.87.54-.88.54-2.09 0-1.2-.55-2.08-.55-.87-1.55-.87-1.01 0-1.57.87-.55.88-.55 2.08zm10.09-.44q0-.63-.17-1.16-.17-.52-.52-.87-.36-.34-.85-.34t-.87.34q-.36.35-.53.87-.18.53-.18 1.16 0 .64.18 1.17.17.52.53.87.36.34.87.34t.85-.34q.35-.35.52-.87.17-.53.17-1.17zM9.1 22l4.9-4.3V18h-4.9v4zm14.39-.62v-8.76l-8.56 7.49 8.56 1.27z"/>
    </svg>
);
const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
    </svg>
);

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
                <CalendarCheckIcon />
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
                    <GoogleIcon /> Google Calendar
                </a>
                <a
                    href={outlookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={getLinkStyle('outlook')}
                    onMouseEnter={() => setHoveredLink('outlook')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    <OutlookIcon /> Outlook Online
                </a>
                <button
                    onClick={openAppleCalendar}
                    style={getLinkStyle('apple')}
                    onMouseEnter={() => setHoveredLink('apple')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    <AppleIcon /> Apple
                </button>
            </div>
        </div>
    );
};

export default AddToCalendar;