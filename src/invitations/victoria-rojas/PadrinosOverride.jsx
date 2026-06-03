import React from 'react';
import { LeafWatermark } from './FloralDecorations';

const PadrinosOverride = ({ data, basePath }) => {
    // Helper function to render a photo frame or an elegant dashed placeholder
    const renderPadrinoSlot = (name, photo) => {
        if (!name) return null;
        return (
            <div className="flex flex-col items-center gap-3 group">
                {photo ? (
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[#F7E7CE]/40 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <img
                            src={`${basePath}/img/${photo}`}
                            alt={name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    /* Elegant placeholder slot for photos */
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/5 border border-dashed border-[#F7E7CE]/40 flex flex-col items-center justify-center text-[#F7E7CE]/70 shadow-inner transform hover:scale-105 hover:border-[#F7E7CE]/80 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 opacity-60 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="text-[0.55rem] uppercase tracking-[0.15em] opacity-60">Foto Padrino</span>
                    </div>
                )}
                <p className="font-inv-display text-xl md:text-2xl text-white leading-relaxed drop-shadow-md">
                    {name}
                </p>
            </div>
        );
    };

    return (
        <section className="relative py-16 px-6 bg-gradient-to-b from-[#2E271F] to-[#1C1713] text-center overflow-hidden">
            {/* Subtle gold dot pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 20%, currentColor 1px, transparent 1px), radial-gradient(circle at 60% 80%, currentColor 1px, transparent 1px)',
                    backgroundSize: '100px 100px',
                    color: '#F7E7CE',
                }}
            />

            {/* Modern background elements peaking from the corners behind everything */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
                {/* Gold champagne glasses peaking from the bottom-left */}
                <img
                    src={`${basePath}/img/gold_element_5.png`}
                    className="absolute -left-12 -bottom-8 w-44 h-44 opacity-[0.16] object-contain rotate-12"
                    alt="gold glasses bg"
                />
                {/* Gold heart balloon peaking from the top-right */}
                <img
                    src={`${basePath}/img/gold_element_7.png`}
                    className="absolute -right-8 top-6 w-40 h-40 opacity-[0.18] object-contain -rotate-12"
                    alt="gold heart bg"
                />
                {/* Sparkly star */}
                <img
                    src={`${basePath}/img/gold_element_11.png`}
                    className="absolute left-10 top-1/4 w-12 h-12 opacity-[0.15] object-contain animate-pulse-soft"
                    alt="gold sparkle bg"
                />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-3">{data.subtitle}</p>
                <h2 className="font-inv-display text-3xl md:text-5xl text-white mb-8 md:mb-10 tracking-widest drop-shadow-sm">{data.label}</h2>

                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-5 md:p-10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20 pointer-events-none rounded-3xl"></div>
                    
                    {(data.groups || [{ padrino1: data.padrino1, padrino2: data.padrino2, photo1: data.photo1, photo2: data.photo2 }]).map((group, index) => (
                        <div key={index} className={`relative z-10 ${index > 0 ? 'mt-8 pt-8 border-t border-white/10' : ''}`}>
                            {group.label && (
                                <h3 className="text-white/90 font-inv-display text-2xl md:text-3xl mb-4 tracking-widest">{group.label}</h3>
                            )}
                            <div className="flex items-center justify-center gap-2 mb-2 md:mb-4">
                                <img src={`${basePath}/img/flower_single.png?v=2`} className="w-5 h-5 object-contain" alt="flower icon" />
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
                                {renderPadrinoSlot(group.padrino1, group.photo1)}

                                {group.padrino1 && group.padrino2 && (
                                    <div className="flex md:flex-col items-center gap-3 md:gap-4">
                                        <div className="w-10 md:w-[1px] h-[1px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#F7E7CE]/40 to-transparent" />
                                        <span className="text-[#F7E7CE] text-lg md:text-xl drop-shadow-sm font-light">&</span>
                                        <div className="w-10 md:w-[1px] h-[1px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#F7E7CE]/40 to-transparent" />
                                    </div>
                                )}

                                {renderPadrinoSlot(group.padrino2, group.photo2)}
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-4 md:mt-6">
                                <img src={`${basePath}/img/gold_element_11.png`} className="w-4 h-4 object-contain animate-pulse-soft" alt="gold spark icon" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PadrinosOverride;
