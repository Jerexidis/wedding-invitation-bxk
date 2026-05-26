import { useEffect, useRef, useCallback } from 'react';

/**
 * Componente reutilizable de confeti con canvas.
 * Úsalo en cualquier invitación: <Confetti /> y listo.
 *
 * @param {number}   duration      - Duración total del confeti en ms (default 8000)
 * @param {number}   particleCount - Cantidad de partículas (default 150)
 * @param {string[]} colors        - Paleta de colores (default: dorados, rosas y blancos)
 * @param {boolean}  active        - Si es false no renderiza nada (default true)
 */
const Confetti = ({
    duration = 8000,
    particleCount = 150,
    colors = ['#FFD700', '#FFC0CB', '#FFFFFF', '#FF69B4', '#87CEEB', '#F0E68C', '#DDA0DD', '#FFB6C1'],
    active = true,
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);

    const createParticles = useCallback((canvas) => {
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * -1 - 20, // nacen arriba del viewport
                w: Math.random() * 10 + 5,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: Math.random() * 3 + 2,
                swing: Math.random() * Math.PI * 2,
                swingSpeed: Math.random() * 0.05 + 0.02,
                swingAmplitude: Math.random() * 2 + 1,
                opacity: 1,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
            });
        }
        return particles;
    }, [particleCount, colors]);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles = createParticles(canvas);
        startTimeRef.current = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const fadeStart = duration * 0.7;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let activeCount = 0;

            particles.forEach((p) => {
                // Fade out en el último 30%
                if (elapsed > fadeStart) {
                    p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart));
                }

                if (p.opacity <= 0) return;
                activeCount++;

                // Física
                p.swing += p.swingSpeed;
                p.x += p.velocityX + Math.sin(p.swing) * p.swingAmplitude;
                p.y += p.velocityY;
                p.rotation += p.rotationSpeed;

                // Dibujar
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.w / 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();

                // Reciclar partículas que salen de pantalla (mientras no estemos en fade-out)
                if (p.y > canvas.height + 20 && elapsed < fadeStart) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            });

            if (elapsed < duration && activeCount > 0) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [active, duration, createParticles]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
            aria-hidden="true"
        />
    );
};

export default Confetti;
