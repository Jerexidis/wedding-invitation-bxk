import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { FloralDivider, FloatingLily } from './FloralDecorations';

const HeroOverride = ({ data, basePath }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    // Sync isPlaying state with actual audio play/pause events
    // This fixes the bug where the envelope starts the audio but the button still shows "play"
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
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

    return (
        <header className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center text-center">
            {/* Background Image with elegant Coral Overlay */}
            <div className="absolute inset-0 z-0 will-change-transform">
                <img
                    src={`${basePath}/img/${data.backgroundImage}`}
                    alt="Fondo floral de invitación"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu"
                    style={{ objectPosition: 'center bottom' }}
                />
                {/* Overlay en degradado cálido coral */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#46231C]/90 via-[#64372D]/35 to-[#FAEFCA]/15" />
            </div>

            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                <FloatingLily
                    basePath={basePath}
                    variant="cream"
                    className="absolute -left-14 top-[9%] w-44 sm:w-56 md:w-72 opacity-80 -rotate-12"
                />
                <FloatingLily
                    basePath={basePath}
                    variant="coral"
                    delay="-1.4s"
                    className="absolute -right-10 bottom-[18%] w-36 sm:w-48 md:w-60 opacity-75 rotate-12"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-white animate-fade-in space-y-4 px-6 pb-24 md:pb-16 text-center">

                <p className="text-sm md:text-base uppercase tracking-[0.4em] font-semibold text-[#F88363] drop-shadow-md" style={{ textShadow: '0 1px 8px rgba(248, 131, 99, 0.4)' }}>
                    {data.subtitle}
                </p>

                <h1
                    className="font-inv-display text-5xl sm:text-6xl md:text-8xl drop-shadow-lg leading-tight text-white"
                    style={{ textShadow: '0 0 25px rgba(250, 239, 202, 0.3)' }}
                >
                    {data.name}
                </h1>

                <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="w-16 h-[1px] bg-white/40" />
                    <FloralDivider size="small" className="text-white/70" />
                    <div className="w-16 h-[1px] bg-white/40" />
                </div>

                <p className="text-base md:text-lg tracking-[0.25em] font-medium text-white drop-shadow-md" style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)' }}>
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

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-[#46231C]/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20 border border-[#FAEFCA]/20">
                        <button onClick={toggleMusic} className="text-[#FAEFCA] hover:text-white transition-colors">
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>

                        <div className="flex-1 h-1 bg-[#64372D]/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FAEFCA] to-[#F88363] transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <button onClick={toggleMute} className="text-[#F0D2C3]/60 hover:text-white transition-colors">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </>
            )}

            {/* Scroll Indicator */}
            <div className={`absolute ${data.song ? 'bottom-24' : 'bottom-8'} left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-20 text-white/80`}>
                <span className="text-xs uppercase tracking-[0.25em] font-medium drop-shadow-md">Desliza</span>
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
