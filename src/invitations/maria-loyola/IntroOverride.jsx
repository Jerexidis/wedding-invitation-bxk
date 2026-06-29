import React from 'react';
import { FloralDivider } from './FloralDecorations';

const IntroOverride = ({ data, basePath }) => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-b from-[#FDF7E6] to-[#FDFBF7] text-center overflow-hidden">

            {/* Modern background elements: A large gold flower on the left and a gold bow on the right */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
                {/* Large white/gold flower behind cards */}
                <img
                    src={`${basePath}/img/flower_single.png?v=2`}
                    className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.14] object-contain rotate-12"
                    alt="flower bg"
                />
                {/* Large gold ribbon/bow behind cards */}
                <img
                    src={`${basePath}/img/gold_element_9.png`}
                    className="absolute -right-16 top-1/3 w-56 h-56 opacity-[0.18] object-contain -rotate-12 filter blur-[1px]"
                    alt="gold ribbon bg"
                />
                {/* Gold glittery stars peaking out */}
                <img
                    src={`${basePath}/img/gold_element_3.png`}
                    className="absolute left-1/4 top-10 w-16 h-16 opacity-[0.12] object-contain rotate-45"
                    alt="gold star bg"
                />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Separador floral en lugar de cruz */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-[#F0D2C3]" />
                    <img src={`${basePath}/img/flower_single.png?v=2`} className="w-6 h-6 object-contain" alt="flower icon" />
                    <div className="w-8 h-[1px] bg-[#F0D2C3]" />
                </div>

                <p className="text-[#A06E5F] text-sm uppercase tracking-[0.3em] mb-6">{data.message}</p>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-md border border-[#F0D2C3] mb-8 relative overflow-hidden">
                    {/* Subtle shiny star inside card background */}
                    <img
                        src={`${basePath}/img/gold_element_11.png`}
                        className="absolute right-4 top-4 w-8 h-8 opacity-25 object-contain animate-pulse-soft"
                        alt="sparkle"
                    />

                    <h3 className="text-xs uppercase tracking-[0.25em] text-[#B4503C] font-semibold mb-3">{data.label}</h3>
                    <p className="font-inv-display text-2xl md:text-3xl text-[#64372D] leading-relaxed">
                        {data.parent1}
                    </p>
                    <div className="flex items-center justify-center gap-3 my-2">
                        <div className="w-8 h-[1px] bg-[#F0D2C3]" />
                        <span className="text-[#D2644B] text-lg font-light">&</span>
                        <div className="w-8 h-[1px] bg-[#F0D2C3]" />
                    </div>
                    <p className="font-inv-display text-2xl md:text-3xl text-[#64372D] leading-relaxed">
                        {data.parent2}
                    </p>
                    {/* Deceased indicator — elegant cross symbol */}
                    {data.parent2Deceased && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                className="w-4 h-4 text-[#B4503C]/70"
                            >
                                <path d="M12 2v20M7 7h10" />
                            </svg>
                            <span className="text-[#B4503C]/70 text-xs uppercase tracking-[0.2em] font-medium italic">
                                En su memoria
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[#A06E5F] text-base md:text-lg italic leading-relaxed max-w-lg mx-auto">
                    "{data.closingMessage}"
                </p>

                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-12 h-[1px] bg-[#F0D2C3]/60" />
                    <FloralDivider size="small" className="text-[#D2644B]" />
                    <div className="w-12 h-[1px] bg-[#F0D2C3]/60" />
                </div>
            </div>
        </section>
    );
};

export default IntroOverride;
