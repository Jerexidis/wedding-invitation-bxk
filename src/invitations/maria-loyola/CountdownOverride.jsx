import useCountdown from '../../hooks/useCountdown';
import AddToCalendar from '../../components/invitation/AddToCalendar';

const CountdownOverride = ({ data, calendar, basePath }) => {
    const { days, hours, minutes, seconds, isTime } = useCountdown(data.targetDate);

    return (
        <section className="relative py-20 px-4 bg-gradient-to-b from-inv-light to-inv-cream text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-inv-display text-inv-primary mb-4">{isTime ? "¡Es Hoy!" : "¡Falta poco!"}</h2>

                {/* Custom gold flower divider */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="w-12 h-[1px] bg-inv-accent/40" />
                    <img src={`${basePath}/img/flower_single.png?v=2`} className="w-7 h-7 object-contain drop-shadow-[0_2px_6px_rgba(218,171,107,0.3)]" alt="flower icon" />
                    <div className="w-12 h-[1px] bg-inv-accent/40" />
                </div>

                {!isTime && (
                    <div className="flex flex-nowrap justify-center gap-2 md:gap-6 mb-10">
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
        <div className="w-[72px] h-[72px] md:w-28 md:h-28 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-300 border border-inv-lily/30">
            <span className="text-2xl md:text-4xl font-bold leading-none text-inv-accent-warm">{value < 10 ? `0${value}` : value}</span>
            <span className="text-[0.5rem] md:text-[0.6rem] uppercase tracking-wider mt-1 text-inv-gray font-medium">{label}</span>
        </div>
    </div>
);

export default CountdownOverride;
