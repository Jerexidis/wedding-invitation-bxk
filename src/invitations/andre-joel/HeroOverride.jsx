import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';

/* ─── SVG: Angelito decorativo ──────────────────────────────────── */
const AngelSVG = ({ size = 'large', className = '' }) => {
    const w = size === 'large' ? 90 : 36;
    const h = size === 'large' ? 80 : 32;
    return (
        <svg
            width={w}
            height={h}
            viewBox="0 0 200 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${size === 'large' ? 'opacity-90' : 'opacity-60'} ${className}`}
            style={size === 'large' ? { filter: 'drop-shadow(0 0 16px rgba(173, 200, 230, 0.5))' } : {}}
        >
            {/* Halo */}
            <ellipse cx="100" cy="32" rx="28" ry="8" stroke="url(#haloGold)" strokeWidth="3" fill="none" opacity="0.9"/>
            <ellipse cx="100" cy="32" rx="24" ry="6" stroke="url(#haloGold)" strokeWidth="1.5" fill="none" opacity="0.5"/>

            {/* Head */}
            <circle cx="100" cy="55" r="20" fill="url(#skinGrad)" />
            <circle cx="93" cy="52" r="2" fill="#5A4A3A" opacity="0.7"/>
            <circle cx="107" cy="52" r="2" fill="#5A4A3A" opacity="0.7"/>
            <path d="M96 60 Q100 64 104 60" stroke="#D4A89A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

            {/* Wings - Left */}
            <path d="M60 85 Q40 55 55 40 Q65 50 75 70 Q68 78 60 85Z" fill="url(#wingGrad)" opacity="0.85"/>
            <path d="M55 90 Q30 65 48 45 Q55 55 65 75 Q60 82 55 90Z" fill="url(#wingGrad)" opacity="0.6"/>
            <path d="M50 92 Q22 72 42 50 Q48 60 58 78 Q54 85 50 92Z" fill="url(#wingGrad)" opacity="0.4"/>

            {/* Wings - Right */}
            <path d="M140 85 Q160 55 145 40 Q135 50 125 70 Q132 78 140 85Z" fill="url(#wingGrad)" opacity="0.85"/>
            <path d="M145 90 Q170 65 152 45 Q145 55 135 75 Q140 82 145 90Z" fill="url(#wingGrad)" opacity="0.6"/>
            <path d="M150 92 Q178 72 158 50 Q152 60 142 78 Q146 85 150 92Z" fill="url(#wingGrad)" opacity="0.4"/>

            {/* Body / Robe */}
            <path d="M82 73 Q100 72 118 73 Q125 110 130 150 L70 150 Q75 110 82 73Z" fill="url(#robeGrad)" opacity="0.9"/>
            <path d="M85 73 Q100 72 115 73 Q120 100 122 140 L78 140 Q80 100 85 73Z" fill="url(#robeLight)" opacity="0.4"/>

            {/* Hands clasped */}
            <ellipse cx="100" cy="110" rx="8" ry="5" fill="url(#skinGrad)" opacity="0.85"/>

            {/* Small cross held */}
            <rect x="98" y="98" width="4" height="16" rx="1" fill="url(#haloGold)" opacity="0.8"/>
            <rect x="94" y="102" width="12" height="3" rx="1" fill="url(#haloGold)" opacity="0.8"/>

            <defs>
                <linearGradient id="haloGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5E6B8"/>
                    <stop offset="50%" stopColor="#E8D5A0"/>
                    <stop offset="100%" stopColor="#D4C48A"/>
                </linearGradient>
                <linearGradient id="skinGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FDEBD0"/>
                    <stop offset="100%" stopColor="#F0D5B8"/>
                </linearGradient>
                <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="40%" stopColor="#E8F0FA"/>
                    <stop offset="100%" stopColor="#C8DDF0"/>
                </linearGradient>
                <linearGradient id="robeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="100%" stopColor="#E0ECF6"/>
                </linearGradient>
                <linearGradient id="robeLight" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="100%" stopColor="#D0E0F0"/>
                </linearGradient>
            </defs>
        </svg>
    );
};

/* ─── SVG: Cruz bautismal suave ─────────────────────────────────── */
const BaptismCross = ({ className = '' }) => (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`opacity-50 ${className}`}>
        <rect x="6" y="0" width="4" height="20" rx="2" fill="url(#crossSoft)"/>
        <rect x="1" y="5" width="14" height="4" rx="2" fill="url(#crossSoft)"/>
        <defs>
            <linearGradient id="crossSoft" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#D4C48A"/>
                <stop offset="100%" stopColor="#E8D5A0"/>
            </linearGradient>
        </defs>
    </svg>
);

/* ─── Cloud shapes ──────────────────────────────────────────────── */
const CloudSVG = ({ className = '', style = {} }) => (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
        <ellipse cx="70" cy="50" rx="55" ry="25" fill="currentColor"/>
        <ellipse cx="120" cy="45" rx="45" ry="22" fill="currentColor"/>
        <ellipse cx="95" cy="35" rx="35" ry="20" fill="currentColor"/>
        <ellipse cx="55" cy="42" rx="30" ry="18" fill="currentColor"/>
        <ellipse cx="140" cy="50" rx="35" ry="20" fill="currentColor"/>
    </svg>
);

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
                    .then(() => { setIsPlaying(true); setNeedsInteraction(false); })
                    .catch(() => setIsPlaying(false));
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) setProgress((current / duration) * 100);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <header className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Sky gradient background (no hero image needed) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #D6EAFF 0%, #E8F2FF 25%, #F0F7FF 50%, #FAFCFF 75%, #FFFFFF 100%)',
                    }}
                />
                {/* Subtle radial glow from top center */}
                <div className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 15%, rgba(255,223,140,0.15) 0%, transparent 60%)',
                    }}
                />
            </div>

            {/* Floating clouds */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                <CloudSVG
                    className="absolute text-white/60 w-[180px] md:w-[240px]"
                    style={{ top: '8%', left: '-5%', animation: 'cloudDrift 25s ease-in-out infinite' }}
                />
                <CloudSVG
                    className="absolute text-white/50 w-[150px] md:w-[200px]"
                    style={{ top: '15%', right: '-8%', animation: 'cloudDrift 30s ease-in-out 3s infinite reverse' }}
                />
                <CloudSVG
                    className="absolute text-white/40 w-[120px] md:w-[160px]"
                    style={{ top: '65%', left: '10%', animation: 'cloudDrift 22s ease-in-out 5s infinite' }}
                />
                <CloudSVG
                    className="absolute text-white/35 w-[100px] md:w-[140px]"
                    style={{ top: '75%', right: '5%', animation: 'cloudDrift 28s ease-in-out 8s infinite reverse' }}
                />
                <CloudSVG
                    className="absolute text-white/45 w-[130px]"
                    style={{ top: '40%', left: '60%', animation: 'cloudDrift 35s ease-in-out 2s infinite' }}
                />
            </div>

            {/* Sparkling star particles */}
            <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${2 + (i % 3)}px`,
                            height: `${2 + (i % 3)}px`,
                            left: `${(i * 5.5 + 3) % 100}%`,
                            top: `${(i * 11 + 8) % 90}%`,
                            background: i % 3 === 0
                                ? 'radial-gradient(circle, rgba(255,215,100,0.9) 0%, rgba(255,235,180,0.2) 100%)'
                                : 'radial-gradient(circle, rgba(173,200,230,0.8) 0%, rgba(200,220,245,0.2) 100%)',
                            animation: `sparkle ${2.5 + (i % 3) * 0.8}s ease-in-out ${(i % 5) * 0.6}s infinite alternate`,
                            boxShadow: i % 3 === 0
                                ? '0 0 6px 2px rgba(255, 215, 100, 0.3)'
                                : '0 0 5px 2px rgba(173, 200, 230, 0.25)',
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 animate-fade-in space-y-4 px-6 pb-24 md:pb-16">
                {/* Angel decoration */}
                <div className="flex justify-center mb-1">
                    <AngelSVG size="large" />
                </div>

                <p className="text-sm md:text-base uppercase tracking-[0.4em] font-semibold text-[#8AADCC]"
                   style={{ textShadow: '0 1px 8px rgba(138, 173, 204, 0.3)' }}>
                    {data.subtitle}
                </p>

                <h1
                    className="font-inv-display text-5xl sm:text-6xl md:text-8xl leading-tight text-[#4A6B8A]"
                    style={{ textShadow: '0 2px 20px rgba(74, 107, 138, 0.15)' }}
                >
                    {data.name}
                </h1>

                <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="w-16 h-[1px] bg-[#B8D4E8]/60" />
                    <BaptismCross />
                    <div className="w-16 h-[1px] bg-[#B8D4E8]/60" />
                </div>

                <p className="text-base md:text-lg tracking-[0.2em] font-light text-[#7A9AB8]">
                    {data.date}
                </p>
            </div>

            {/* Audio Player */}
            {data.song && (
                <>
                    <audio id="invitationAudio" loop ref={audioRef} onTimeUpdate={handleTimeUpdate}>
                        <source src={`${basePath}/audio/${data.song}`} type="audio/mpeg" />
                    </audio>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20 border border-[#B8D4E8]/40">
                        <button onClick={toggleMusic} className={`text-[#7A9AB8] hover:text-[#4A6B8A] transition-colors ${needsInteraction && !isPlaying ? 'animate-pulse' : ''}`}>
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <div className="flex-1 h-1 bg-[#D6EAFF] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#8AADCC] to-[#B8D4E8] transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <button onClick={toggleMute} className="text-[#A0BDD0]/60 hover:text-[#4A6B8A] transition-colors">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </>
            )}

            {/* Scroll Indicator */}
            <div className={`absolute ${data.song ? 'bottom-24' : 'bottom-8'} left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-20 text-[#8AADCC]/80`}>
                <span className="text-xs uppercase tracking-[0.2em] font-light">Desliza</span>
                <ChevronDown size={24} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes cloudDrift {
                    0% { transform: translateX(0px); }
                    50% { transform: translateX(40px); }
                    100% { transform: translateX(0px); }
                }
                @keyframes sparkle {
                    0% { opacity: 0.15; transform: scale(0.7); }
                    50% { opacity: 1; transform: scale(1.3); }
                    100% { opacity: 0.2; transform: scale(0.8); }
                }
            `}</style>
        </header>
    );
};

export { AngelSVG, BaptismCross, CloudSVG };
export default HeroOverride;
