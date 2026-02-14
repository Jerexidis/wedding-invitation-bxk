import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const Hero = () => {
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

    return (
        <header className="relative min-h-[100dvh] w-full flex flex-col items-center justify-end pb-24 md:pb-20 text-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 will-change-transform">
                <img
                    src="/img/Portada.jpeg"
                    alt="Fondo Boda"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="relative z-10 text-white animate-fade-in space-y-4 px-6 pb-8">
                <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl drop-shadow-lg leading-tight">Nos Casamos</h1>
                <p className="text-lg md:text-xl uppercase tracking-[0.3em] font-light">KASSANDRA & BRIAN</p>
                <div className="w-24 h-0.5 bg-white/60 mx-auto my-4"></div>
                <p className="text-lg md:text-2xl font-serif tracking-widest text-shadow-sm">30 de Mayo, 2026</p>
            </div>

            {/* Audio Player */}
            <audio
                id="bodaAudio"
                loop
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
            >
                <source src="/audio/MMXX's.mp3" type="audio/mpeg" />
            </audio>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/90 rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20">
                <button onClick={toggleMusic} className="text-primary hover:text-slate-800 transition-colors">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>

                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <button onClick={toggleMute} className="text-gray-400 hover:text-slate-800 transition-colors">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
            </div>
        </header>
    );
};

export default Hero;
