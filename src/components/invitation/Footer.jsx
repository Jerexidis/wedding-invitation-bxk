const Footer = ({ data, basePath }) => {
    return (
        <footer className="relative py-12 bg-inv-cream text-center border-t border-inv-lily/30 overflow-hidden">
            <div className="max-w-md mx-auto px-6 relative z-10">
                {data.emojis && (
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {data.emojis.map((e, i) => <span key={i} className="text-2xl">{e}</span>)}
                    </div>
                )}

                {/* Small decorative cross */}
                {!data.emojis && (
                    <div className="flex items-center justify-center mb-4">
                        <svg width="18" height="24" viewBox="0 0 120 160" fill="none" className="opacity-30">
                            <rect x="45" y="10" width="30" height="140" rx="4" fill="currentColor" className="text-inv-primary"/>
                            <rect x="15" y="40" width="90" height="26" rx="4" fill="currentColor" className="text-inv-primary"/>
                        </svg>
                    </div>
                )}

                <p className="font-inv-display italic text-xl mb-2 text-inv-primary">{data.name}</p>
                <p className="text-inv-gray text-sm mb-4">{data.subtitle}</p>
                <a href="https://invita-ya.com" target="_blank" rel="noopener noreferrer" className="text-inv-primary hover:text-inv-teal transition-colors text-xs uppercase tracking-widest">
                    Creado con Invita-Ya.com
                </a>
            </div>
        </footer>
    );
};

export default Footer;
