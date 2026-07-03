import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { FloralDivider } from './FloralDecorations';

const HeroOverride = ({ data, basePath }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [needsInteraction, setNeedsInteraction] = useState(false);

    useEffect(() => {
        if (!data.song || !audioRef.current) return;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch(() => setNeedsInteraction(true));
        }
    }, [data.song]);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setNeedsInteraction(false);
                    })
                    .catch(() => {
                        setIsPlaying(false);
                    });
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    // Arrays of gold elements for floating particles (stars and flowers)
    const floatingAssets = [
        'gold_element_7.png',  // Heart
        'gold_element_11.png', // Disco
        'flower_single.webp',   // Gold single flower
        'gold_element_8.png'   // Another Star
    ];

    return (
        <header className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center text-center">
            {/* Background Image with elegant Champagne Overlay */}
            <div className="absolute inset-0 z-0 will-change-transform">
                <img
                    src={`${basePath}/img/${data.backgroundImage}`}
                    alt="Fondo floral de invitación"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu"
                    style={{ objectPosition: 'center bottom' }}
                />
                {/* Overlay en degradado cálido de champagne dorado */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E271F]/90 via-[#4A3F35]/35 to-[#F7E7CE]/15" />
            </div>

            {/* Floating modern gold elements & flowers */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {[...Array(7)].map((_, i) => {
                    const asset = floatingAssets[i % floatingAssets.length];
                    const size = asset === 'flower_single.webp' ? 36 + (i % 3) * 8 : 30 + (i % 3) * 6;
                    return (
                        <img
                            key={i}
                            src={`${basePath}/img/${asset}`}
                            className="absolute object-contain opacity-85 select-none pointer-events-none"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${(i * 12 + 8) % 100}%`,
                                top: `${(i * 17 + 12) % 100}%`,
                                animation: `floatingPetal ${8 + (i % 4)}s ease-in-out ${(i % 3) * 1.2}s infinite alternate`,
                                filter: asset.includes('gold') || asset.includes('flower') ? 'drop-shadow(0 2px 4px rgba(218, 171, 107, 0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                            }}
                            alt="particle"
                        />
                    );
                })}
            </div>

            {/* Gold flower trio peaking from the side border next to the name */}
            <div className="absolute -right-12 md:-right-24 top-[45%] md:top-[18%] z-10 pointer-events-none select-none overflow-visible">
                {/* Glow behind the side flower */}
                <div className="absolute inset-0 bg-[#F7E7CE] opacity-20 blur-3xl rounded-full scale-75 translate-x-12"></div>
                <img
                    src={`${basePath}/img/flower_trio.png?v=2`}
                    className="w-44 h-44 md:w-80 md:h-80 object-contain rotate-[-15deg] drop-shadow-[0_4px_20px_rgba(218,171,107,0.4)] animate-float relative z-10"
                    alt="Flores de Oro Lateral"
                />
            </div>

            {/* Gold single flower peaking from the left border in Hero */}
            <div className="absolute -left-10 md:-left-20 top-[10%] md:top-[8%] z-10 pointer-events-none select-none overflow-visible">
                {/* Glow behind the side flower */}
                <div className="absolute inset-0 bg-[#F7E7CE] opacity-20 blur-3xl rounded-full scale-75 -translate-x-12"></div>
                <img
                    src={`${basePath}/img/flower_single.webp?v=2`}
                    className="w-32 h-32 md:w-60 md:h-60 object-contain rotate-[15deg] drop-shadow-[0_4px_20px_rgba(218,171,107,0.4)] animate-float relative z-10"
                    alt="Flor de Oro Lateral Izquierda"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-white animate-fade-in space-y-4 px-6 pb-24 md:pb-16 text-center">


                <p className="text-sm md:text-base uppercase tracking-[0.4em] font-semibold text-[#768A57] drop-shadow-md" style={{ textShadow: '0 1px 8px rgba(107, 127, 59, 0.4)' }}>
                    {data.subtitle}
                </p>

                <h1
                    className="font-inv-display text-5xl sm:text-6xl md:text-8xl drop-shadow-lg leading-tight text-white"
                    style={{ textShadow: '0 0 25px rgba(247, 231, 206, 0.3)' }}
                >
                    {data.name}
                </h1>

                <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="w-16 h-[1px] bg-[#A3B18A]/50" />
                    <FloralDivider size="small" className="text-[#8DA170]" />
                    <div className="w-16 h-[1px] bg-[#A3B18A]/50" />
                </div>

                <p className="text-base md:text-lg tracking-[0.25em] font-medium text-[#768A57]" style={{ textShadow: '0 1px 10px rgba(107, 127, 59, 0.35)' }}>
                    {data.date}
                </p>
            </div>

            {/* Audio Player */}
            {data.song && (
                <>
                    <audio
                        id="invitationAudio"
                        loop
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                    >
                        <source src={`${basePath}/audio/${data.song}`} type="audio/mpeg" />
                    </audio>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-[#2E271F]/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20 border border-[#F7E7CE]/20">
                        <button onClick={toggleMusic} className="text-[#F7E7CE] hover:text-white transition-colors">
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>

                        <div className="flex-1 h-1 bg-[#4A3F35]/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#F7E7CE] to-[#DFC59C] transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <button onClick={toggleMute} className="text-[#E3D5C3]/60 hover:text-white transition-colors">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </>
            )}

            {/* Scroll Indicator */}
            <div className={`absolute ${data.song ? 'bottom-24' : 'bottom-8'} left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-20 text-[#768A57]`}>
                <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ textShadow: '0 1px 6px rgba(107, 127, 59, 0.3)' }}>Desliza</span>
                <ChevronDown size={24} />
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes floatingPetal {
                    0% { opacity: 0.2; transform: translate(0, 0) rotate(0deg) scale(0.8); }
                    50% { opacity: 0.8; transform: translate(12px, -18px) rotate(45deg) scale(1.05); }
                    100% { opacity: 0.3; transform: translate(-15px, 12px) rotate(90deg) scale(0.9); }
                }
            `}</style>
        </header>
    );
};

export default HeroOverride;
