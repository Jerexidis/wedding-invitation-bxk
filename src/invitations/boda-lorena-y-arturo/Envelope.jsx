import React from 'react';
import { Heart } from 'lucide-react';

export default function Envelope({ config, basePath, openInvitation, envelopeExit }) {
    return (
        <div className={`bla-envelope ${envelopeExit ? 'exit' : ''}`}>
            <div className="bla-envelope__card">
                {/* Floating rings decoration */}
                <img
                    src={`${basePath}/img/anillos-divider.png`}
                    alt=""
                    className="bla-envelope__rings"
                    aria-hidden="true"
                />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div className="bla-silver-badge-small">
                        <span>25</span> años
                    </div>
                    <p className="bla-envelope__eyebrow">{config.hero.title}</p>
                    <h2 className="bla-envelope__names">
                        Lorena <span className="bla-amp-small">&</span> Arturo
                    </h2>
                    <p className="bla-envelope__subtitle">
                        Recién casados... <strong>¡hace 25 años!</strong> 😂
                        <br />
                        <span style={{ fontSize: '0.82rem' }}>¡Y esto hay que celebrarlo en grande!</span>
                    </p>
                    <button type="button" onClick={openInvitation} className="bla-envelope__seal">
                        <span className="bla-envelope__seal-25">25</span>
                    </button>
                    <p className="bla-envelope__cta">Abrir invitación</p>
                </div>
            </div>
        </div>
    );
}
