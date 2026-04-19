import React, { useState } from 'react';
import { Gift } from 'lucide-react';

// SVG de Amazon — reemplaza fa-amazon (Font Awesome eliminado)
const AmazonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
        <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.396C3.186 21.238 1.585 20.243.368 19c-.224-.223-.27-.4-.323-.512v-.466zm6.727-7.475c0-1.9.047-3.557-.136-4.85-.162-1.3-.583-2.18-1.653-2.44-1.09-.26-1.61.14-1.96.95-.254.6-.358 1.2-.358 1.93 0 .712.11 1.35.33 1.91.34.876.91 1.394 1.68 1.556 1.085.23 2.097-.05 2.097-1.057zm9.03 3.054c.37.79.91 1.424 1.623 1.9 1.015.683 2.246.92 3.695.713.734-.107 1.36-.358 1.878-.756.518-.4.778-.877.778-1.432 0-.6-.35-1.073-1.057-1.42-.39-.194-.947-.36-1.67-.5-.725-.14-1.56-.232-2.506-.27l-.46-.02c-.71-.042-1.288.047-1.73.267-.443.22-.665.545-.665.975 0 .26.038.394.114.543zm3.367-10.57c.716.067 1.39.2 2.023.395.633.196 1.17.4 1.61.617.44.216.808.397 1.103.54.293.14.523.207.69.2.167 0 .255-.07.267-.212.01-.14-.07-.28-.24-.428-.17-.148-.423-.307-.76-.476-.32-.18-.696-.352-1.13-.516-.433-.166-.885-.302-1.358-.41-.473-.108-.94-.162-1.4-.162-.463 0-.92.054-1.378.162-.45.11-.882.244-1.296.4-.413.157-.79.33-1.13.52-.34.19-.59.35-.76.498-.17.148-.25.288-.24.428.012.14.1.21.267.21.167 0 .397-.06.69-.2.295-.14.663-.323 1.103-.54.44-.216.977-.42 1.61-.617.632-.196 1.306-.33 2.023-.396l.001-.013z"/>
    </svg>
);

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
                        <AmazonIcon />
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
