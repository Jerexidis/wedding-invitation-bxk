import { BaptismCross, CloudSVG } from './HeroOverride';

const FooterOverride = ({ data = {} }) => {
    return (
        <footer className="relative py-12 text-center overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #F0F7FF 0%, #E8F2FF 50%, #D6EAFF 100%)' }}>

            {/* Background clouds */}
            <CloudSVG
                className="absolute text-white/25 w-[100px]"
                style={{ bottom: '10%', right: '-3%', animation: 'cloudDrift 22s ease-in-out infinite' }}
            />
            <CloudSVG
                className="absolute text-white/20 w-[80px]"
                style={{ top: '15%', left: '-2%', animation: 'cloudDrift 28s ease-in-out 3s infinite reverse' }}
            />

            <div className="max-w-md mx-auto px-6 relative z-10">
                {/* Baptism cross */}
                <div className="flex items-center justify-center mb-4">
                    <BaptismCross />
                </div>

                <p className="font-inv-display italic text-xl mb-2 text-[#4A6B8A]">{data.name}</p>
                <p className="text-[#7A9AB8] text-sm mb-4">{data.subtitle}</p>

                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-[#B8D4E8]/40" />
                    <span className="text-[#D4C48A] text-xs">✦</span>
                    <div className="w-8 h-[1px] bg-[#B8D4E8]/40" />
                </div>

                <a href="https://invita-ya.com" target="_blank" rel="noopener noreferrer"
                   className="text-[#5A8AAE] hover:text-[#3A5F7A] transition-colors text-xs uppercase tracking-widest">
                    Creado con Invita-Ya.com
                </a>
            </div>
        </footer>
    );
};

export default FooterOverride;
