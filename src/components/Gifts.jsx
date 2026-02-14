import React, { useState } from 'react';
import { Gift, ShoppingBag } from 'lucide-react';

const Gifts = () => {
    return (
        <section className="py-20 px-4 bg-white text-center">
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-full mb-6">
                    <Gift className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-3xl font-serif text-slate-800 mb-4">Mesa de Regalos</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Su presencia es nuestro mayor regalo, pero si desean tener un detalle con nosotros:
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                        href="https://www.amazon.com.mx/wedding/guest-view/3HLP5OM0ROOIQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 bg-primary-dark text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all hover:-translate-y-1 shadow-md"
                    >
                        <i className="fab fa-amazon text-xl"></i>
                        <span className="font-medium">Mesa en Amazon</span>
                    </a>

                    {/* Liverpool Button style example if enabled later
                    <a href="#" className="inline-flex items-center justify-center gap-3 bg-[#e91e63] text-white px-8 py-4 rounded-lg hover:bg-[#d81b60] transition-all hover:-translate-y-1 shadow-md">
                        <ShoppingBag /> Liverpool
                    </a> 
                    */}
                </div>

                <p className="mt-8 text-sm text-slate-500 bg-secondary inline-block px-4 py-2 rounded-full border border-slate-100">
                    O la opción en mesa será: <span className="font-semibold text-slate-700">"Lluvia de sobres"</span> 💌
                </p>
            </div>
        </section>
    );
};

export default Gifts;
