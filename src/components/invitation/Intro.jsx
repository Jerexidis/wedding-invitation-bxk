const Intro = ({ data, basePath }) => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-b from-inv-cream to-inv-light text-center overflow-hidden">
            {/* Subtle decorative pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 5v20M28 35v20M5 28h20M35 28h20' stroke='%23B8944A' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-2xl mx-auto relative z-10">

                {/* Opening message with small cross */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-inv-accent/40" />
                    <svg width="14" height="18" viewBox="0 0 16 20" fill="none" className="opacity-50">
                        <rect x="6" y="0" width="4" height="20" rx="1" fill="currentColor" className="text-inv-accent"/>
                        <rect x="1" y="5" width="14" height="4" rx="1" fill="currentColor" className="text-inv-accent"/>
                    </svg>
                    <div className="w-8 h-[1px] bg-inv-accent/40" />
                </div>
                <p className="text-inv-gray text-sm uppercase tracking-[0.3em] mb-6">{data.message}</p>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg border border-inv-lily/50 mb-8">
                    <h3 className="text-sm uppercase tracking-[0.25em] text-inv-primary font-semibold mb-3">{data.label}</h3>
                    <p className="font-inv-display text-2xl md:text-3xl text-inv-dark leading-relaxed">
                        {data.parent1}
                    </p>
                    <div className="flex items-center justify-center gap-3 my-2">
                        <div className="w-8 h-[1px] bg-inv-accent" />
                        <span className="text-inv-accent text-lg">&</span>
                        <div className="w-8 h-[1px] bg-inv-accent" />
                    </div>
                    <p className="font-inv-display text-2xl md:text-3xl text-inv-dark leading-relaxed">
                        {data.parent2}
                    </p>
                </div>

                <p className="text-inv-gray text-base md:text-lg italic leading-relaxed max-w-lg mx-auto">
                    "{data.closingMessage}"
                </p>

                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-12 h-[1px] bg-inv-accent/60" />
                    <span className="text-inv-accent text-xl">✦</span>
                    <div className="w-12 h-[1px] bg-inv-accent/60" />
                </div>
            </div>
    </section>
    );
};

export default Intro;
