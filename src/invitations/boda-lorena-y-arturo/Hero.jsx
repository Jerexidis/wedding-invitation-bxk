import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Hero({ config, basePath }) {
    return (
        <header className="bla-hero">
            <div className="bla-hero__frame">
                {/* Silver 25 Badge */}
                <div className="bla-silver-badge" data-silver-badge>
                    <span className="bla-silver-badge__number">25</span>
                    <span className="bla-silver-badge__text">años</span>
                </div>

                <div className="bla-hero__badge" data-bla-hero>
                    <span className="bla-hero__badge-dot" />
                    <span>{config.hero.title}</span>
                    <Sparkles size={12} />
                    <span className="bla-hero__badge-dot" />
                </div>

                {/* Cartoon couple - YOUR image */}
                <div className="bla-hero__image-container" data-bla-hero>
                    <img
                        src={`${basePath}/img/novios-cartoon.png`}
                        alt={config.hero.names}
                        className="bla-hero__image"
                    />
                </div>

                <h1 className="bla-hero__names" data-bla-hero>
                    Lorena
                    <span className="bla-hero__ampersand">&</span>
                    Arturo
                </h1>

                {/* Quote */}
                <div className="bla-hero__quote" data-bla-hero>
                    <p>{config.hero.quote}</p>
                </div>

                {/* Rings divider */}
                <img
                    src={`${basePath}/img/anillos-divider.png`}
                    alt=""
                    className="bla-rings-divider"
                    aria-hidden="true"
                />

                <div className="bla-hero__date-pills" data-bla-hero>
                    <div className="bla-hero__pill">
                        <span className="bla-hero__pill-label">Fecha</span>
                        <span className="bla-hero__pill-value">{config.hero.date}</span>
                    </div>
                    <div className="bla-hero__pill">
                        <span className="bla-hero__pill-label">Hora</span>
                        <span className="bla-hero__pill-value">{config.hero.time}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
