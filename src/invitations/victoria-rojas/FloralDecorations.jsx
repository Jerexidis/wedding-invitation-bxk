import React from 'react';

// Elegante corona floral circular para la sección Hero, reemplazando la corona de princesa.
export const FloralWreath = ({ className, size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Círculo guía sutil */}
        <circle cx="60" cy="60" r="44" strokeDasharray="3 3" opacity="0.2" />
        
        {/* Rama izquierda */}
        <path d="M60 106 C25 98, 14 62, 30 34 C36 26, 47 18, 60 18" strokeLinecap="round" />
        {/* Hojas izquierda */}
        <path d="M51 103 Q45 101, 46 96" fill="currentColor" opacity="0.8" />
        <path d="M37 95 Q30 89, 34 84" fill="currentColor" opacity="0.8" />
        <path d="M26 77 Q21 68, 28 64" fill="currentColor" opacity="0.8" />
        <path d="M25 56 Q23 45, 31 43" fill="currentColor" opacity="0.8" />
        <path d="M35 38 Q36 28, 44 29" fill="currentColor" opacity="0.8" />
        <path d="M50 25 Q54 16, 59 20" fill="currentColor" opacity="0.8" />
        
        {/* Rama derecha */}
        <path d="M60 106 C95 98, 106 62, 90 34 C84 26, 73 18, 60 18" strokeLinecap="round" />
        {/* Hojas derecha */}
        <path d="M69 103 Q75 101, 74 96" fill="currentColor" opacity="0.8" />
        <path d="M83 95 Q90 89, 86 84" fill="currentColor" opacity="0.8" />
        <path d="M94 77 Q99 68, 92 64" fill="currentColor" opacity="0.8" />
        <path d="M95 56 Q97 45, 89 43" fill="currentColor" opacity="0.8" />
        <path d="M85 38 Q84 28, 76 29" fill="currentColor" opacity="0.8" />
        <path d="M70 25 Q66 16, 61 20" fill="currentColor" opacity="0.8" />

        {/* Pequeños capullos de rosas / detalles florales en los extremos */}
        <circle cx="60" cy="106" r="3.5" fill="currentColor" />
        <circle cx="57" cy="103" r="2.2" fill="currentColor" opacity="0.9" />
        <circle cx="63" cy="103" r="2.2" fill="currentColor" opacity="0.9" />
        
        <circle cx="60" cy="18" r="3.5" fill="currentColor" />
        <circle cx="57" cy="21" r="2.2" fill="currentColor" opacity="0.9" />
        <circle cx="63" cy="21" r="2.2" fill="currentColor" opacity="0.9" />

        {/* Flores decorativas en los costados */}
        <g transform="translate(23, 67) scale(0.65)">
            <circle cx="10" cy="10" r="4" fill="currentColor" />
            <circle cx="5" cy="10" r="3" fill="currentColor" opacity="0.75" />
            <circle cx="15" cy="10" r="3" fill="currentColor" opacity="0.75" />
            <circle cx="10" cy="5" r="3" fill="currentColor" opacity="0.75" />
            <circle cx="10" cy="15" r="3" fill="currentColor" opacity="0.75" />
        </g>
        <g transform="translate(87, 67) scale(0.65)">
            <circle cx="10" cy="10" r="4" fill="currentColor" />
            <circle cx="5" cy="10" r="3" fill="currentColor" opacity="0.75" />
            <circle cx="15" cy="10" r="3" fill="currentColor" opacity="0.75" />
            <circle cx="10" cy="5" r="3" fill="currentColor" opacity="0.75" />
            <circle cx="10" cy="15" r="3" fill="currentColor" opacity="0.75" />
        </g>
    </svg>
);

// Separador floral elegante para dividir secciones, reemplazando estrellas y cruces.
export const FloralDivider = ({ className, color = "currentColor", size = "normal" }) => {
    const scale = size === "small" ? 0.6 : 1;
    return (
        <svg
            viewBox="0 0 120 20"
            className={className}
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ width: size === "small" ? "70px" : "120px", height: "20px" }}
        >
            <g transform={`scale(${scale}) translate(${(120 - 120 * scale) / 2}, 0)`}>
                {/* Flor central */}
                <circle cx="60" cy="10" r="2.5" fill={color} />
                <circle cx="56" cy="10" r="1.5" />
                <circle cx="64" cy="10" r="1.5" />
                <circle cx="60" cy="6" r="1.5" />
                <circle cx="60" cy="14" r="1.5" />
                
                {/* Rama izquierda con pequeñas hojas curvas */}
                <path d="M50 10 C43 14, 33 5, 20 10" />
                <path d="M41 11 Q39 8, 36 9" fill={color} />
                <path d="M30 9 Q28 12, 25 11" fill={color} />
                <circle cx="17" cy="10" r="1.5" fill={color} />
                
                {/* Rama derecha con pequeñas hojas curvas */}
                <path d="M70 10 C77 14, 87 5, 100 10" />
                <path d="M79 11 Q81 8, 84 9" fill={color} />
                <path d="M90 9 Q92 12, 95 11" fill={color} />
                <circle cx="103" cy="10" r="1.5" fill={color} />
            </g>
        </svg>
    );
};

// Una única flor pequeña para usar de viñeta o espaciador micro.
export const SingleFlower = ({ className, size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="6" cy="10" r="2" fill={color} opacity="0.8" />
        <circle cx="14" cy="10" r="2" fill={color} opacity="0.8" />
        <circle cx="10" cy="6" r="2" fill={color} opacity="0.8" />
        <circle cx="10" cy="14" r="2" fill={color} opacity="0.8" />
        {/* Pequeños pétalos diagonales */}
        <circle cx="7.2" cy="7.2" r="1.5" fill={color} opacity="0.6" />
        <circle cx="12.8" cy="7.2" r="1.5" fill={color} opacity="0.6" />
        <circle cx="7.2" cy="12.8" r="1.5" fill={color} opacity="0.6" />
        <circle cx="12.8" cy="12.8" r="1.5" fill={color} opacity="0.6" />
    </svg>
);

// Hojas marca de agua muy sutiles para fondos de secciones.
export const LeafWatermark = ({ className, size = 100 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M15 85 C42 85, 78 52, 85 15 C62 32, 32 42, 15 85 Z" opacity="0.04" />
        <path d="M28 72 C48 70, 58 58, 62 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.06" />
        <path d="M42 58 C52 57, 58 52, 60 46" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.06" />
        <path d="M55 45 C63 46, 68 41, 70 36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.06" />
    </svg>
);

// Esquina floral clásica (Watercolor Rose Corner style) en SVG.
export const RoseCorner = ({ className, size = 150 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1">
        {/* Tallos principales de esquina */}
        <path d="M5 95 C5 60, 35 15, 60 5" strokeLinecap="round" opacity="0.4" />
        <path d="M95 5 C60 5, 15 35, 5 60" strokeLinecap="round" opacity="0.4" />
        
        {/* Hojas grandes */}
        <path d="M12 70 Q16 64, 22 68 Q18 74, 12 70 Z" fill="currentColor" opacity="0.25" />
        <path d="M30 45 Q36 39, 42 43 Q38 49, 30 45 Z" fill="currentColor" opacity="0.25" />
        <path d="M45 30 Q49 38, 43 42 Q39 36, 45 30 Z" fill="currentColor" opacity="0.25" />
        <path d="M70 12 Q74 18, 68 22 Q64 16, 70 12 Z" fill="currentColor" opacity="0.25" />
        
        {/* Flor de esquina principal (rosa abierta) */}
        <g transform="translate(15, 15)">
            <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.4" />
            <circle cx="10" cy="10" r="5" fill="currentColor" opacity="0.6" />
            <circle cx="10" cy="10" r="2.5" fill="currentColor" />
            {/* Pétalos curvos */}
            <path d="M10 2 C15 2, 18 5, 18 10 C18 15, 15 18, 10 18 C5 18, 2 15, 2 10 C2 5, 5 2, 10 2 Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 5 C13 5, 15 7, 15 10 C15 13, 13 15, 10 15 C7 15, 5 13, 5 10 C5 7, 7 5, 10 5 Z" stroke="currentColor" strokeWidth="1" />
        </g>
    </svg>
);
