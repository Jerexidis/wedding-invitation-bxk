const Padrinos = ({ data, basePath }) => {
    return (
        <section className="relative py-16 px-6 bg-gradient-to-b from-[#C4A882] to-[#A8896A] text-center overflow-hidden">
            {/* Subtle gold dot pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF55 1px, transparent 1px), radial-gradient(circle at 80% 20%, #D4AF55 1px, transparent 1px), radial-gradient(circle at 60% 80%, #D4AF55 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Decorative cross watermarks */}
            <div className="absolute top-6 left-6 opacity-[0.06] pointer-events-none select-none">
                <svg width="50" height="65" viewBox="0 0 120 160" fill="none">
                    <rect x="45" y="10" width="30" height="140" rx="4" fill="#C9B896"/>
                    <rect x="15" y="40" width="90" height="26" rx="4" fill="#C9B896"/>
                </svg>
            </div>
            <div className="absolute bottom-6 right-6 opacity-[0.06] pointer-events-none select-none">
                <svg width="40" height="52" viewBox="0 0 120 160" fill="none">
                    <rect x="45" y="10" width="30" height="140" rx="4" fill="#C9B896"/>
                    <rect x="15" y="40" width="90" height="26" rx="4" fill="#C9B896"/>
                </svg>
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <p className="text-white/70 text-sm uppercase tracking-[0.3em] mb-3">{data.subtitle}</p>
                <h2 className="font-inv-display text-4xl md:text-5xl text-white mb-10">{data.label}</h2>

                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/20 shadow-lg">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-inv-accent text-2xl">✦</span>
                    </div>

                    <p className="font-inv-display text-2xl md:text-3xl text-white leading-relaxed">
                        {data.padrino1}
                    </p>
                    <div className="flex items-center justify-center gap-3 my-3">
                        <div className="w-8 h-[1px] bg-inv-accent/50" />
                        <span className="text-inv-accent text-lg">&</span>
                        <div className="w-8 h-[1px] bg-inv-accent/50" />
                    </div>
                    <p className="font-inv-display text-2xl md:text-3xl text-white leading-relaxed">
                        {data.padrino2}
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-6">
                        <span className="text-inv-accent text-2xl">✦</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Padrinos;
