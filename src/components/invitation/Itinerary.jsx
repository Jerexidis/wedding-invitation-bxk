import { Church, PartyPopper, Music, UtensilsCrossed } from 'lucide-react';

const iconMap = {
    church: (props) => <Church {...props} />,
    party: (props) => <PartyPopper {...props} strokeWidth={2.5} />,
    music: (props) => <Music {...props} />,
    food: (props) => <UtensilsCrossed {...props} />,
};

const Itinerary = ({ data, basePath }) => {
    return (
        <section className="py-14 px-6 bg-inv-dark text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-inv-firefly/30" style={{
                        width: `${2 + (i % 4)}px`, height: `${2 + (i % 4)}px`,
                        left: `${(i * 17 + 5) % 100}%`, top: `${(i * 15 + 10) % 100}%`,
                        animation: `firefly ${3 + (i % 4)}s ease-in-out ${(i % 3) * 0.7}s infinite alternate`,
                        boxShadow: '0 0 6px 2px rgba(255, 245, 157, 0.3)',
                    }} />
                ))}
            </div>
            {data.decorationImage && (
                <img src={`${basePath}/img/${data.decorationImage}`} alt="" className="absolute bottom-10 -left-10 w-64 md:w-80 opacity-70 pointer-events-none select-none drop-shadow-2xl" style={{ transform: 'scaleX(-1)' }} />
            )}

            <div className="max-w-md mx-auto relative z-10">
                <p className="text-inv-firefly/70 text-sm uppercase tracking-[0.3em] mb-2">Programa del evento</p>
                <h2 className="text-3xl md:text-4xl font-inv-display text-white mb-10">Itinerario</h2>
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-inv-accent/40 via-inv-accent/20 to-transparent" />
                    <div className="space-y-6">
                        {data.items.map((item, index) => {
                            const IconComponent = iconMap[item.icon];
                            return (
                                <div key={index} className="relative flex items-start gap-5 group">
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-inv-primary border-2 border-inv-accent/50 flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {IconComponent && IconComponent({ className: 'w-5 h-5 text-white' })}
                                    </div>
                                    <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-inv-accent/10 hover:border-inv-accent/30 transition-colors duration-300 text-left">
                                        <p className="text-inv-accent font-bold text-sm tracking-wider mb-1">{item.time}</p>
                                        <p className="text-white font-semibold text-base">{item.event}</p>
                                        <p className="text-inv-lily/60 text-xs mt-1 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes firefly {
                    0% { opacity: 0.2; transform: translate(0, 0); }
                    50% { opacity: 0.8; transform: translate(10px, -15px); }
                    100% { opacity: 0.3; transform: translate(-10px, 5px); }
                }
            `}</style>
        </section>
    );
};

export default Itinerary;
