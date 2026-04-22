import React from 'react';

const Footer = () => {
    return (
        <footer className="relative py-12 bg-rana-cream text-center border-t border-rana-lily/30 overflow-hidden">
            {/* Princess silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/princess-silhouette.png"
                alt=""
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            {/* Frog silhouette */}
            <img
                src="/invitations/melani-marisol/img/frog-silhouette.png"
                alt=""
                className="absolute -bottom-2 -left-2 w-20 md:w-24 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            {/* Lotus silhouette */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute -bottom-3 -right-3 w-24 md:w-28 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            <div className="max-w-md mx-auto px-6 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl">🐸</span>
                    <span className="text-rana-accent text-xl">👑</span>
                    <span className="text-2xl">🪷</span>
                </div>

                <p className="font-serif italic text-xl mb-2 text-rana-primary">
                    Melani Marisol
                </p>
                <p className="text-rana-gray text-sm mb-4">
                    XV Años • 2 de Mayo 2026
                </p>

                <a
                    href="https://invita-ya.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rana-primary hover:text-rana-teal transition-colors text-xs uppercase tracking-widest"
                >
                    Creado con Invita-Ya.com
                </a>
            </div>
        </footer>
    );
};

export default Footer;
