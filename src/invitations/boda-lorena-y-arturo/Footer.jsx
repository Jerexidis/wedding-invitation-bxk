import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer({ config, basePath }) {
    return (
        <footer className="bla-footer">
            <div className="bla-footer__card">
                <img
                    src={`${basePath}/img/anillos-divider.png`}
                    alt=""
                    style={{ width: '50px', margin: '0 auto 0.75rem', display: 'block', opacity: 0.5 }}
                />
                <p className="bla-footer__names">{config.hero.names}</p>
                <p className="bla-footer__tagline">
                    Bodas de Plata · 25 Años 🥈
                </p>
                <p className="bla-footer__message">
                    25 años de risas, aventuras y mucho amor.
                    ¡Gracias por celebrar con nosotros! 🎉
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <Heart size={18} color="var(--bla-silver)" className="bla-heartbeat" style={{ display: 'inline' }} />
                </div>
                <p style={{ marginTop: '1.2rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--bla-text-muted)' }}>
                    Creado con <span style={{ color: 'var(--bla-silver)' }}>♥</span> por <strong>Invita-Ya</strong>
                </p>
            </div>
        </footer>
    );
}
