import React from 'react';

const FooterOverride = ({ data, basePath }) => {
    return (
        <footer className="relative py-12 bg-inv-cream text-center border-t border-[#E3D5C3]/40 overflow-hidden">
            <div className="max-w-md mx-auto px-6 relative z-10">
                {/* Clean flower image instead of the Christian cross */}
                <div className="flex items-center justify-center mb-4">
                    <img
                        src={`${basePath}/img/flower_single.png`}
                        className="w-10 h-10 object-contain drop-shadow-[0_2px_6px_rgba(218,171,107,0.4)]"
                        alt="flower footer icon"
                    />
                </div>

                <p className="font-inv-display italic text-2xl mb-2 text-inv-primary">{data.name}</p>
                <p className="text-inv-gray text-sm mb-4">{data.subtitle}</p>
                <a href="https://invita-ya.com" target="_blank" rel="noopener noreferrer" className="text-inv-primary hover:text-inv-teal transition-colors text-xs uppercase tracking-widest">
                    Creado con Invita-Ya.com
                </a>
            </div>
        </footer>
    );
};

export default FooterOverride;
