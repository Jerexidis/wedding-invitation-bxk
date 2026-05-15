import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';

/* ─── SVG Decorations ───────────────────────────────────────────── */
const LotusDecor = ({ size = 'large' }) => {
    const w = size === 'large' ? 80 : 28;
    const h = size === 'large' ? 52 : 18;
    return (
        <svg
            width={w}
            height={h}
            viewBox="0 0 200 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={size === 'large' ? 'opacity-80 drop-shadow-lg' : 'opacity-70'}
            style={size === 'large' ? { filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.4))' } : {}}
        >
            <path d="M100 5C92 30 88 55 88 80C88 90 92 100 100 105C108 100 112 90 112 80C112 55 108 30 100 5Z" fill={size === 'large' ? 'url(#lotusGold1)' : '#C9B896'} opacity="0.95"/>
            <path d="M75 20C65 42 60 62 65 82C68 92 75 98 85 100C88 90 86 75 82 60C78 45 75 30 75 20Z" fill={size === 'large' ? 'url(#lotusGold1)' : '#C9B896'} opacity="0.9"/>
            <path d="M125 20C135 42 140 62 135 82C132 92 125 98 115 100C112 90 114 75 118 60C122 45 125 30 125 20Z" fill={size === 'large' ? 'url(#lotusGold1)' : '#C9B896'} opacity="0.9"/>
            <path d="M52 35C40 55 35 75 42 92C46 100 55 105 68 105C68 94 62 78 56 64C52 54 50 42 52 35Z" fill={size === 'large' ? 'url(#lotusGold2)' : '#C9B896'} opacity="0.85"/>
            <path d="M148 35C160 55 165 75 158 92C154 100 145 105 132 105C132 94 138 78 144 64C148 54 150 42 148 35Z" fill={size === 'large' ? 'url(#lotusGold2)' : '#C9B896'} opacity="0.85"/>
            <path d="M30 55C20 72 18 88 28 100C34 107 44 110 58 108C55 98 46 84 38 72C33 65 30 58 30 55Z" fill={size === 'large' ? 'url(#lotusGold2)' : '#C9B896'} opacity="0.75"/>
            <path d="M170 55C180 72 182 88 172 100C166 107 156 110 142 108C145 98 154 84 162 72C167 65 170 58 170 55Z" fill={size === 'large' ? 'url(#lotusGold2)' : '#C9B896'} opacity="0.75"/>
            {size === 'large' && (
                <>
                    <path d="M15 72C8 85 8 98 18 107C24 112 34 114 48 112C44 104 35 92 27 82C22 76 18 74 15 72Z" fill="url(#lotusGold3)" opacity="0.65"/>
                    <path d="M185 72C192 85 192 98 182 107C176 112 166 114 152 112C156 104 165 92 173 82C178 76 182 74 185 72Z" fill="url(#lotusGold3)" opacity="0.65"/>
                    <ellipse cx="100" cy="115" rx="45" ry="8" fill="url(#lotusGold3)" opacity="0.4"/>
                    <defs>
                        <linearGradient id="lotusGold1" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#FFD700"/>
                            <stop offset="100%" stopColor="#C9A84C"/>
                        </linearGradient>
                        <linearGradient id="lotusGold2" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#E6BE5A"/>
                            <stop offset="100%" stopColor="#A68A3E"/>
                        </linearGradient>
                        <linearGradient id="lotusGold3" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#D4AA4F"/>
                            <stop offset="100%" stopColor="#8B7332"/>
                        </linearGradient>
                    </defs>
                </>
            )}
        </svg>
    );
};

const CommunionCross = ({ size = 'large' }) => {
    const w = size === 'large' ? 70 : 24;
    const h = size === 'large' ? 90 : 30;
    return (
        <svg
            width={w}
            height={h}
            viewBox="0 0 120 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={size === 'large' ? 'opacity-90 drop-shadow-lg' : 'opacity-70'}
            style={size === 'large' ? { filter: 'drop-shadow(0 0 14px rgba(212, 175, 85, 0.5))' } : {}}
        >
            {/* Cross body */}
            <rect x="45" y="10" width="30" height="140" rx="4" fill="url(#crossGold1)" opacity="0.95"/>
            <rect x="15" y="40" width="90" height="26" rx="4" fill="url(#crossGold1)" opacity="0.95"/>
            {/* Inner cross highlight */}
            <rect x="50" y="15" width="20" height="130" rx="3" fill="url(#crossGold2)" opacity="0.6"/>
            <rect x="20" y="45" width="80" height="16" rx="3" fill="url(#crossGold2)" opacity="0.6"/>
            {/* Center circle with chalice motif */}
            <circle cx="60" cy="53" r="14" fill="url(#crossGold3)" opacity="0.9"/>
            <circle cx="60" cy="53" r="10" fill="none" stroke="#FFF8E7" strokeWidth="1" opacity="0.5"/>
            {/* Simple chalice in center */}
            <path d="M55 49C55 46 57 44 60 44C63 44 65 46 65 49L64 55H56L55 49Z" fill="#FFF8E7" opacity="0.8"/>
            <rect x="58" y="55" width="4" height="5" rx="0.5" fill="#FFF8E7" opacity="0.7"/>
            <rect x="56" y="59" width="8" height="2" rx="1" fill="#FFF8E7" opacity="0.7"/>
            {/* Decorative dots at cross tips */}
            <circle cx="60" cy="8" r="3" fill="url(#crossGold2)" opacity="0.7"/>
            <circle cx="60" cy="152" r="3" fill="url(#crossGold2)" opacity="0.5"/>
            <circle cx="12" cy="53" r="3" fill="url(#crossGold2)" opacity="0.6"/>
            <circle cx="108" cy="53" r="3" fill="url(#crossGold2)" opacity="0.6"/>
            <defs>
                <linearGradient id="crossGold1" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#E8D5A3"/>
                    <stop offset="50%" stopColor="#D4AF55"/>
                    <stop offset="100%" stopColor="#B8944A"/>
                </linearGradient>
                <linearGradient id="crossGold2" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFF8E7"/>
                    <stop offset="100%" stopColor="#E8D5A3"/>
                </linearGradient>
                <linearGradient id="crossGold3" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF55"/>
                    <stop offset="100%" stopColor="#8B7332"/>
                </linearGradient>
            </defs>
        </svg>
    );
};

/* ─── Small divider cross ───────────────────────────────────────── */
const SmallCross = () => (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
        <rect x="6" y="0" width="4" height="20" rx="1" fill="#C9B896"/>
        <rect x="1" y="5" width="14" height="4" rx="1" fill="#C9B896"/>
    </svg>
);

const Hero = ({ data, basePath }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
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

    /* Detect Primera Comunión from subtitle text */
    const isCommunion = data.subtitle?.toLowerCase().includes('comunión') || data.subtitle?.toLowerCase().includes('comunion');

    return (
        <header className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center text-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 will-change-transform">
                <img
                    src={`${basePath}/img/${data.backgroundImage}`}
                    alt="Fondo de invitación"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu"
                />
                <div className={`absolute inset-0 ${
                    isCommunion
                        ? 'bg-gradient-to-t from-[#2C2318]/90 via-[#2C2318]/40 to-[#8B7332]/15'
                        : 'bg-gradient-to-t from-inv-dark/90 via-inv-dark/40 to-inv-primary/20'
                }`} />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {[...Array(isCommunion ? 10 : 15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${3 + (i % 4)}px`,
                            height: `${3 + (i % 4)}px`,
                            left: `${(i * 7 + 5) % 100}%`,
                            top: `${(i * 13 + 10) % 100}%`,
                            background: isCommunion
                                ? 'radial-gradient(circle, rgba(212,175,85,0.8) 0%, rgba(232,213,163,0.3) 100%)'
                                : undefined,
                            animation: `firefly ${3 + (i % 4)}s ease-in-out ${(i % 3) * 0.7}s infinite alternate`,
                            boxShadow: isCommunion
                                ? '0 0 6px 2px rgba(212, 175, 85, 0.4)'
                                : '0 0 8px 3px rgba(255, 245, 157, 0.6)',
                        }}
                        {...(!isCommunion ? { className: `absolute rounded-full bg-inv-firefly` } : {})}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-white animate-fade-in space-y-3 px-6 pb-24 md:pb-16">
                {/* Decoration SVG */}
                <div className="flex justify-center mb-2">
                    {isCommunion ? <CommunionCross size="large" /> : <LotusDecor size="large" />}
                </div>

                <p className={`text-sm md:text-base uppercase tracking-[0.4em] font-light ${
                    isCommunion ? 'text-[#E8D5A3]' : 'text-inv-firefly'
                }`}>
                    {data.subtitle}
                </p>
                <h1
                    className="font-inv-display text-5xl sm:text-6xl md:text-8xl drop-shadow-lg leading-tight text-white"
                    style={{ textShadow: isCommunion
                        ? '0 0 30px rgba(212, 175, 85, 0.35)'
                        : '0 0 30px rgba(255, 215, 0, 0.4)'
                    }}
                >
                    {data.name}
                </h1>
                <div className="flex items-center justify-center gap-4 mt-2">
                    <div className={`w-16 h-[1px] ${isCommunion ? 'bg-[#C9B896]/60' : 'bg-inv-accent/60'}`} />
                    {isCommunion ? <SmallCross /> : <LotusDecor size="small" />}
                    <div className={`w-16 h-[1px] ${isCommunion ? 'bg-[#C9B896]/60' : 'bg-inv-accent/60'}`} />
                </div>
                <p className={`text-base md:text-lg tracking-[0.2em] font-light ${
                    isCommunion ? 'text-[#F5ECD7]' : 'text-inv-lily'
                }`}>
                    {data.date}
                </p>
            </div>

            {/* Audio Player - themed */}
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

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-inv-dark/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20 border border-inv-accent/30">
                        <button onClick={toggleMusic} className="text-inv-accent hover:text-white transition-colors">
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>

                        <div className="flex-1 h-1 bg-inv-primary/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-inv-accent to-inv-firefly transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <button onClick={toggleMute} className="text-inv-lily/60 hover:text-white transition-colors">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </>
            )}

            {/* Scroll Indicator */}
            <div className={`absolute ${data.song ? 'bottom-24' : 'bottom-8'} left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-20 ${
                isCommunion ? 'text-[#E8D5A3]/80' : 'text-inv-lily/80'
            }`}>
                <span className="text-xs uppercase tracking-[0.2em] font-light">Desliza</span>
                <ChevronDown size={24} />
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes firefly {
                    0% { opacity: 0.2; transform: translate(0, 0) scale(0.8); }
                    50% { opacity: 1; transform: translate(15px, -20px) scale(1.2); }
                    100% { opacity: 0.3; transform: translate(-30px, 10px) scale(0.9); }
                }
            `}</style>
        </header>
    );
};

export default Hero;
