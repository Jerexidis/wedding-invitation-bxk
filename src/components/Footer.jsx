import React from 'react';

const Footer = () => {
    return (
        <footer className="py-12 bg-secondary text-center text-slate-400 text-sm border-t border-slate-100">
            <p className="font-serif italic text-lg mb-2 text-slate-600">Kassandra & Brian</p>
            <p className="mb-4">Hecho con amor para nuestra boda.</p>
            <a
                href="https://invita-ya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark transition-colors text-xs uppercase tracking-widest"
            >
                Creado con Invita-Ya.com
            </a>
        </footer>
    );
};

export default Footer;
