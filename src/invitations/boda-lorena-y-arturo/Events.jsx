import React from 'react';
import { Clock, MapPinned } from 'lucide-react';

export default function Events({ config, basePath }) {
    return (
        <section className="bla-section" style={{ textAlign: 'center' }} data-bla-section>
            <p className="bla-section__eyebrow">Detalles del Día</p>
            <h2 className="bla-section__title">¿Dónde celebramos?</h2>
            <p className="bla-section__subtitle">
                Después de 25 años, ¡ya era hora de volver a hacer fiesta! 🥳
            </p>

            <div className="bla-events">
                <div className="bla-events__grid">
                    {config.events.map((event) => (
                        <article key={event.type} className="bla-card bla-event-card">
                            <div className="bla-event-card__img-wrapper">
                                <img
                                    src={`${basePath}/img/${event.image}`}
                                    alt={event.title}
                                    className="bla-event-card__img"
                                />
                                <div className="bla-event-card__overlay">
                                    <p className="bla-event-card__tag">
                                        {event.type === 'church' ? '⛪ Misa' : '🎉 Fiesta'}
                                    </p>
                                    <p className="bla-event-card__name">{event.title}</p>
                                </div>
                            </div>

                            <div className="bla-event-card__body">
                                <p className="bla-event-card__location">{event.location}</p>
                                <p className="bla-event-card__address">{event.address}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem' }}>
                                    <span className="bla-event-card__time">
                                        <Clock size={14} />
                                        {event.time}
                                    </span>
                                    {event.mapLink && event.mapLink !== '#' && (
                                        <a
                                            href={event.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bla-event-card__map-link"
                                        >
                                            <MapPinned size={14} />
                                            Ver ubicación
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
