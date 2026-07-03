import { AngelSVG, CloudSVG } from './HeroOverride';

const IntroOverride = ({ data }) => {
    return (
        <section className="relative py-20 px-6 text-center overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #FAFCFF 0%, #F0F7FF 30%, #E8F2FF 70%, #F5F9FF 100%)' }}>

            {/* Subtle cloud decorations */}
            <CloudSVG
                className="absolute text-white/30 w-[120px]"
                style={{ top: '5%', right: '-3%', animation: 'cloudDrift 20s ease-in-out infinite' }}
            />
            <CloudSVG
                className="absolute text-white/25 w-[100px]"
                style={{ bottom: '10%', left: '-2%', animation: 'cloudDrift 25s ease-in-out 4s infinite reverse' }}
            />

            {/* Subtle cross pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='28' y='20' width='4' height='20' rx='2' fill='%23809AB8'/%3E%3Crect x='20' y='28' width='20' height='4' rx='2' fill='%23809AB8'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Angel divider */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-[#8AADCC]/40" />
                    <AngelSVG size="small" />
                    <div className="w-8 h-[1px] bg-[#8AADCC]/40" />
                </div>
                <p className="text-[#7A9AB8] text-sm uppercase tracking-[0.3em] mb-6">{data.message}</p>

                {/* Parents card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg border border-[#B8D4E8]/50 mb-8"
                     style={{ boxShadow: '0 8px 32px rgba(138, 173, 204, 0.12)' }}>
                    <h3 className="text-sm uppercase tracking-[0.25em] text-[#5A8AAE] font-semibold mb-3">{data.label}</h3>
                    <p className="font-inv-display text-2xl md:text-3xl text-[#3A5F7A] leading-relaxed">
                        {data.parent1}
                    </p>
                    <div className="flex items-center justify-center gap-3 my-2">
                        <div className="w-8 h-[1px] bg-[#D4C48A]" />
                        <span className="text-[#D4C48A] text-lg">&</span>
                        <div className="w-8 h-[1px] bg-[#D4C48A]" />
                    </div>
                    <p className="font-inv-display text-2xl md:text-3xl text-[#3A5F7A] leading-relaxed">
                        {data.parent2}
                    </p>
                </div>

                {/* Closing message */}
                <p className="text-[#6A8FA8] text-base md:text-lg italic leading-relaxed max-w-lg mx-auto">
                    &ldquo;{data.closingMessage}&rdquo;
                </p>

                {/* Bottom divider */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-12 h-[1px] bg-[#B8D4E8]/60" />
                    <span className="text-[#D4C48A] text-xl">✦</span>
                    <div className="w-12 h-[1px] bg-[#B8D4E8]/60" />
                </div>
            </div>
        </section>
    );
};

export default IntroOverride;
