import React, { useState, useRef, useEffect } from 'react';
import { CalendarPlus, ChevronDown } from 'lucide-react';

const AddToCalendar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const event = {
        title: "XV Años de Melani Marisol",
        description: "¡Celebra los XV Años de Melani Marisol con nosotros!",
        location: "Quinta Sarai, Av. Siglo XXI KM 3.5, Aguascalientes",
        start: "20260502T190000",
        end: "20260503T020000",
    };

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    const outlookStart = "2026-05-02T19:00:00";
    const outlookEnd = "2026-05-03T02:00:00";
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description)}&startdt=${outlookStart}&enddt=${outlookEnd}&location=${encodeURIComponent(event.location)}`;

    const openAppleCalendar = () => {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//XV Melani//ES',
            'BEGIN:VEVENT',
            `DTSTART:${event.start}`,
            `DTEND:${event.end}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}`,
            `LOCATION:${event.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'xv-melani-marisol.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative inline-block text-center z-50" ref={dropdownRef}>
            <p className="text-sm text-rana-gray mb-3 tracking-wide">Agrega al calendario</p>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center gap-3 bg-white hover:bg-rana-cream text-rana-primary px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-rana-lily/40 hover:border-rana-primary/30 transform hover:-translate-y-1 font-bold tracking-wide uppercase text-sm w-full md:w-auto"
            >
                <CalendarPlus className="w-5 h-5" />
                <span>Agendar Fecha</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div 
                className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)] w-56 bg-white rounded-2xl shadow-xl border border-rana-lily/30 overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
            >
                <div className="flex flex-col py-2">
                    {/* Google Calendar */}
                    <a 
                        href={googleUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-rana-light transition-colors text-rana-dark text-sm font-medium"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Google Calendar</span>
                    </a>

                    {/* Outlook */}
                    <a 
                        href={outlookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-rana-light transition-colors text-rana-dark text-sm font-medium"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                            <path d="M22 6L14 4V20L22 18V6Z" fill="#0078D4" />
                            <path d="M14 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H14V4Z" fill="#28A8EA" />
                            <path d="M9.5 15.5C11.433 15.5 13 13.933 13 12C13 10.067 11.433 8.5 9.5 8.5C7.567 8.5 6 10.067 6 12C6 13.933 7.567 15.5 9.5 15.5Z" fill="#FFF" />
                            <path d="M9.5 14C10.6046 14 11.5 13.1046 11.5 12C11.5 10.8954 10.6046 10 9.5 10C8.39543 10 7.5 10.8954 7.5 12C7.5 13.1046 8.39543 14 9.5 14Z" fill="#0078D4" />
                        </svg>
                        <span>Outlook</span>
                    </a>

                    {/* Apple Calendar */}
                    <button 
                        onClick={() => { openAppleCalendar(); setIsOpen(false); }} 
                        className="flex items-center gap-3 px-5 py-3 hover:bg-rana-light transition-colors text-rana-dark text-sm font-medium text-left w-full cursor-pointer"
                    >
                        <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                        </svg>
                        <span>Apple Calendar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToCalendar;
