import { SprayCan } from 'lucide-react';

export default function GiftsOverride({ data, basePath }) {
    if (!data?.enabled) return null;

    return (
        <section className="relative py-16 px-4 bg-gradient-to-b from-white to-inv-cream text-center overflow-hidden z-10">
            <div className="max-w-2xl mx-auto relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-5 shadow-sm border border-blue-100">
                    <SprayCan className="w-8 h-8 text-inv-primary" />
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-inv-display text-inv-primary mb-3">{data.title}</h3>
                <p className="text-inv-gray mb-6 max-w-md mx-auto leading-relaxed">{data.message}</p>

                {/* Watercolor illustration */}
                <div className="flex justify-center">
                    <div className="relative">
                        <img
                            src={`${basePath}/img/limpieza.webp`}
                            alt="Productos de limpieza y despensa"
                            className="w-64 md:w-72 h-auto object-contain"
                            style={{ mixBlendMode: 'multiply' }}
                        />
                    </div>
                </div>

                {/* Suggestions */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {['🧹 Escoba', '🧼 Jabón', '🧽 Esponjas', '🫧 Detergente', '🧴 Cloro', '🪣 Cubeta'].map((item) => (
                        <span
                            key={item}
                            className="inline-block bg-blue-50 text-inv-primary text-sm px-4 py-2 rounded-full border border-blue-100 font-medium"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
