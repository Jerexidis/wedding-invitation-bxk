import { useState, useEffect } from 'react';
import AddToCalendar from './AddToCalendar';

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTime, setIsTime] = useState(false);

    useEffect(() => {
        const eventDate = new Date("May 2, 2026 19:00:00").getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                setIsTime(true);
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-20 px-4 bg-gradient-to-b from-rana-light to-rana-cream text-center">
            {/* Contenedor de marcas de agua para no recortar el dropdown */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Lotus silhouette watermark */}
                <img
                    src="/invitations/melani-marisol/img/lotus-silhouette.png"
                    alt=""
                    className="absolute left-2 top-4 w-28 md:w-36 opacity-[0.04] select-none"
                    style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
                />
                {/* Frog silhouette watermark */}
                <img
                    src="/invitations/melani-marisol/img/frog-silhouette.png"
                    alt=""
                    className="absolute -right-2 top-1/3 w-24 md:w-32 opacity-[0.04] select-none"
                    style={{ filter: 'sepia(0.5) hue-rotate(100deg)', transform: 'scaleX(-1)' }}
                />
                {/* Princess silhouette watermark */}
                <img
                    src="/invitations/melani-marisol/img/princess-silhouette.png"
                    alt=""
                    className="absolute -bottom-10 -left-6 w-44 md:w-56 opacity-[0.05] select-none"
                    style={{ filter: 'sepia(0.5) hue-rotate(100deg)', transform: 'scaleX(-1)' }}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <p className="text-sm uppercase tracking-[0.3em] text-rana-gray mb-2">Faltan</p>
                <h2 className="text-4xl md:text-5xl font-serif text-rana-primary mb-12">
                    {isTime ? "¡Es Hoy!" : "¡Falta Poco!"}
                </h2>

                {!isTime && (
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
                        <TimerBox value={timeLeft.days} label="Días" />
                        <TimerBox value={timeLeft.hours} label="Hrs" />
                        <TimerBox value={timeLeft.minutes} label="Min" />
                        <TimerBox value={timeLeft.seconds} label="Seg" />
                    </div>
                )}

                {!isTime && (
                    <div className="mb-8 animate-fade-in">
                        <p className="text-xl md:text-3xl text-rana-dark font-serif mb-2">Sábado, 2 de Mayo</p>
                        <p className="text-lg text-rana-gray uppercase tracking-widest">2026</p>
                    </div>
                )}

                {!isTime && <AddToCalendar />}
            </div>
        </section>
    );
};

const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-rana-primary to-rana-teal text-white rounded-2xl flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 border border-rana-accent/20">
            <span className="text-2xl md:text-3xl font-bold leading-none">
                {value < 10 ? `0${value}` : value}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider mt-1 opacity-90 text-rana-firefly">{label}</span>
        </div>
    </div>
);

export default Countdown;
