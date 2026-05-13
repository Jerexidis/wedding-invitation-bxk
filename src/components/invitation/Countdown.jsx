import useCountdown from '../../hooks/useCountdown';
import AddToCalendar from './AddToCalendar';

const Countdown = ({ data, calendar, basePath }) => {
    const { days, hours, minutes, seconds, isTime } = useCountdown(data.targetDate);

    return (
        <section className="relative py-20 px-4 bg-gradient-to-b from-inv-light to-inv-cream text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-inv-display text-inv-primary mb-4">{isTime ? "¡Es Hoy!" : "¡Falta poco!"}</h2>

                {/* Small decorative divider */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="w-10 h-[1px] bg-inv-accent/40" />
                    <span className="text-inv-accent text-sm">✦</span>
                    <div className="w-10 h-[1px] bg-inv-accent/40" />
                </div>

                {!isTime && (
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
                        <TimerBox value={days} label="Días" />
                        <TimerBox value={hours} label="Horas" />
                        <TimerBox value={minutes} label="Minutos" />
                        <TimerBox value={seconds} label="Segundos" />
                    </div>
                )}
                {!isTime && (
                    <div className="mb-8 animate-fade-in">
                        <p className="text-xl md:text-3xl text-inv-dark font-inv-display mb-2">{data.displayDate}</p>
                        <p className="text-lg text-inv-gray uppercase tracking-widest">{data.displayYear}</p>
                    </div>
                )}
                {!isTime && <AddToCalendar data={calendar} />}
            </div>
        </section>
    );
};

const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="w-24 h-24 md:w-28 md:h-28 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-300 border border-inv-lily/30">
            <span className="text-3xl md:text-4xl font-bold leading-none text-inv-accent-warm">{value < 10 ? `0${value}` : value}</span>
            <span className="text-[0.6rem] uppercase tracking-wider mt-1.5 text-inv-gray font-medium">{label}</span>
        </div>
    </div>
);

export default Countdown;
