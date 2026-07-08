import React from 'react';
import { Users, Heart } from 'lucide-react';

export default function Padrinos({ config }) {
    if (!config.padrinos.enabled) return null;

    return (
        <section className="bla-section bla-padrinos" data-bla-section>
            <p className="bla-section__eyebrow">
                <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {config.padrinos.label}
            </p>
            <h2 className="bla-section__title">Nuestros Padrinos</h2>

            <div className="bla-card bla-padrinos__card">
                <p className="bla-padrinos__name">{config.padrinos.madrina}</p>
                <p className="bla-padrinos__amp">&</p>
                <p className="bla-padrinos__name">{config.padrinos.padrino}</p>
                <div style={{ marginTop: '1.2rem' }}>
                    <Heart size={20} color="var(--bla-silver)" className="bla-heartbeat" style={{ display: 'inline' }} />
                </div>
            </div>
        </section>
    );
}
