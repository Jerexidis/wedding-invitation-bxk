import { Gift, ExternalLink } from 'lucide-react';

const Gifts = ({ data, basePath }) => {
    if (!data?.enabled) return null;

    return (
        <section className="relative py-20 px-4 bg-white text-center overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="inline-flex items-center justify-center p-4 bg-inv-light rounded-full mb-6 shadow-sm">
                    <Gift className="w-8 h-8 text-inv-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-inv-display text-inv-primary mb-4">{data.title}</h3>
                {data.message && <p className="text-inv-gray mb-8 max-w-md mx-auto">{data.message}</p>}
                <div className="bg-gradient-to-br from-inv-cream to-inv-light p-8 rounded-3xl border border-inv-lily/50 max-w-md mx-auto shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {data.type === 'link' && data.link ? (
                            <a href={data.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-inv-primary text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-md hover:opacity-90 transition-opacity">
                                <Gift className="w-4 h-4" />
                                <span>{data.linkText || 'Ver Mesa de Regalos'}</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-inv-primary text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                                <span>💌</span>
                                <span>{data.envelopeText || 'Lluvia de Sobres'}</span>
                            </div>
                        )}
                        <p className="text-inv-gray text-sm leading-relaxed text-center mt-2 px-2">{data.envelopeDescription || data.linkDescription || ''}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gifts;
