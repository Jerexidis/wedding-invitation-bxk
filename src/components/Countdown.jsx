import { useState, useEffect } from 'react';
import AddToCalendar from './AddToCalendar';

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTime, setIsTime] = useState(false);

    useEffect(() => {
        const weddingDate = new Date("May 30, 2026 16:00:00").getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

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
        <section className="py-20 px-4 bg-white text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif text-primary mb-12">
                    {isTime ? "¡Es Hoy!" : "¡Falta Poco!"}
                </h2>

                {!isTime && (
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10">
                        <TimerBox value={timeLeft.days} label="Días" />
                        <TimerBox value={timeLeft.hours} label="Hrs" />
                        <TimerBox value={timeLeft.minutes} label="Min" />
                        <TimerBox value={timeLeft.seconds} label="Seg" />
                    </div>
                )}

                {!isTime && (
                    <div className="mb-8 animate-fade-in">
                        <p className="text-xl md:text-3xl text-slate-700 font-serif mb-2">Sábado, 30 de Mayo</p>
                        <p className="text-lg text-slate-500 uppercase tracking-widest">2026</p>
                    </div>
                )}

                {!isTime && <AddToCalendar />}
            </div>
        </section>
    );
};

const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary text-white rounded-full flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-2xl md:text-3xl font-bold leading-none">
                {value < 10 ? `0${value}` : value}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider mt-1 opacity-90">{label}</span>
        </div>
    </div>
);

export default Countdown;
