const Padrinos = ({ data, basePath }) => {
    return (
        <section className="relative py-16 px-6 bg-gradient-to-b from-inv-dark to-inv-dark/90 text-center overflow-hidden">
            {/* Subtle gold dot pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 20%, currentColor 1px, transparent 1px), radial-gradient(circle at 60% 80%, currentColor 1px, transparent 1px)',
                    backgroundSize: '100px 100px',
                    color: 'rgb(var(--inv-accent))',
                }}
            />

            {/* Decorative cross watermarks */}
            <div className="absolute top-6 left-6 opacity-[0.06] pointer-events-none select-none">
                <svg width="50" height="65" viewBox="0 0 120 160" fill="none">
                    <rect x="45" y="10" width="30" height="140" rx="4" fill="currentColor" className="text-inv-accent"/>
                    <rect x="15" y="40" width="90" height="26" rx="4" fill="currentColor" className="text-inv-accent"/>
                </svg>
            </div>
            <div className="absolute bottom-6 right-6 opacity-[0.06] pointer-events-none select-none">
                <svg width="40" height="52" viewBox="0 0 120 160" fill="none">
                    <rect x="45" y="10" width="30" height="140" rx="4" fill="currentColor" className="text-inv-accent"/>
                    <rect x="15" y="40" width="90" height="26" rx="4" fill="currentColor" className="text-inv-accent"/>
                </svg>
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-3">{data.subtitle}</p>
                <h2 className="font-inv-display text-3xl md:text-5xl text-white mb-8 md:mb-10 tracking-widest drop-shadow-sm">{data.label}</h2>

                <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl p-5 md:p-10 border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
                    {/* Inner highlight for glass effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-30 pointer-events-none rounded-3xl"></div>
                    
                    {(data.groups || [{ padrino1: data.padrino1, padrino2: data.padrino2, photo1: data.photo1, photo2: data.photo2 }]).map((group, index) => (
                        <div key={index} className={`relative z-10 ${index > 0 ? 'mt-8 pt-8 border-t border-white/20' : ''}`}>
                            {group.label && (
                                <h3 className="text-white/90 font-inv-display text-2xl md:text-3xl mb-4 tracking-widest">{group.label}</h3>
                            )}
                            <div className="flex items-center justify-center gap-2 mb-2 md:mb-4">
                                <span className="text-inv-accent text-xl md:text-2xl">✦</span>
                            </div>

                            {/* Photo layout: show individual photos if available */}
                            {(group.photo1 || group.photo2) ? (
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
                                    {/* Padrino 1 */}
                                    <div className="flex flex-col items-center gap-3">
                                        {group.photo1 && (
                                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
                                                <img
                                                    src={`${basePath}/img/${group.photo1}`}
                                                    alt={group.padrino1}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <p className="font-inv-display text-xl md:text-2xl text-white leading-relaxed drop-shadow-md">
                                            {group.padrino1}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    {group.padrino2 && (
                                        <div className="flex md:flex-col items-center gap-3 md:gap-4">
                                            <div className="w-10 md:w-[1px] h-[1px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-inv-accent/60 to-transparent" />
                                            <span className="text-inv-accent text-lg md:text-xl drop-shadow-sm font-light">&</span>
                                            <div className="w-10 md:w-[1px] h-[1px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-inv-accent/60 to-transparent" />
                                        </div>
                                    )}

                                    {/* Padrino 2 */}
                                    {group.padrino2 && (
                                        <div className="flex flex-col items-center gap-3">
                                            {group.photo2 && (
                                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
                                                    <img
                                                        src={`${basePath}/img/${group.photo2}`}
                                                        alt={group.padrino2}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                            <p className="font-inv-display text-xl md:text-2xl text-white leading-relaxed drop-shadow-md">
                                                {group.padrino2}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Text-only layout (original) */
                                <>
                                    <p className="font-inv-display text-xl md:text-3xl text-white leading-relaxed drop-shadow-md">
                                        {group.padrino1}
                                    </p>
                                    {group.padrino2 && (
                                        <>
                                            <div className="flex items-center justify-center gap-3 md:gap-4 my-3 md:my-5 relative z-10">
                                                <div className="w-10 md:w-12 h-[1px] bg-gradient-to-r from-transparent via-inv-accent/60 to-transparent" />
                                                <span className="text-inv-accent text-lg md:text-xl drop-shadow-sm font-light">&</span>
                                                <div className="w-10 md:w-12 h-[1px] bg-gradient-to-r from-transparent via-inv-accent/60 to-transparent" />
                                            </div>
                                            <p className="font-inv-display text-xl md:text-3xl text-white leading-relaxed drop-shadow-md">
                                                {group.padrino2}
                                            </p>
                                        </>
                                    )}
                                </>
                            )}

                            <div className="flex items-center justify-center gap-2 mt-4 md:mt-6">
                                <span className="text-inv-accent text-xl md:text-2xl">✦</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Padrinos;
