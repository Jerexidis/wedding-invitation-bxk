import AddToCalendar from './AddToCalendar';
import { useCountdown } from '../../../hooks/useCountdown';

// Fecha de la boda — usamos el hook compartido en lugar de lógica inline
const WEDDING_DATE = '2026-05-30T16:00:00';

const Countdown = () => {
    const { dias, horas, minutos, segundos, isExpired } = useCountdown(WEDDING_DATE);

    return (
        <section className="py-20 px-4 bg-white text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif text-primary mb-12">
                    {isExpired ? '¡Es Hoy!' : '¡Falta Poco!'}
                </h2>

                {!isExpired && (
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10">
                        <TimerBox value={dias}     label="Días" />
                        <TimerBox value={horas}    label="Hrs"  />
                        <TimerBox value={minutos}  label="Min"  />
                        <TimerBox value={segundos} label="Seg"  />
                    </div>
                )}

                {!isExpired && (
                    <div className="mb-8 animate-fade-in">
                        <p className="text-xl md:text-3xl text-slate-700 font-serif mb-2">Sábado, 30 de Mayo</p>
                        <p className="text-lg text-slate-500 uppercase tracking-widest">2026</p>
                    </div>
                )}

                {!isExpired && <AddToCalendar />}
            </div>
        </section>
    );
};

const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary text-white rounded-full flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-2xl md:text-3xl font-bold leading-none">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider mt-1 opacity-90">{label}</span>
        </div>
    </div>
);

export default Countdown;
