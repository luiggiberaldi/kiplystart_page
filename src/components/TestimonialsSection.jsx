import { useState, useEffect, useRef } from 'react';

const testimonials = [
    {
        text: 'El reloj llegó impecable. No pensé que fuera tan rápido, en menos de 24 horas ya lo tenía.',
        name: 'María G.',
        city: 'Caracas',
        rating: 5,
    },
    {
        text: 'Pedí el lunes y el miércoles ya lo tenía en casa. 100% recomendado.',
        name: 'José R.',
        city: 'Valencia',
        rating: 5,
    },
    {
        text: 'Nunca había comprado online en Venezuela con contraentrega. Me encantó la experiencia, sin riesgo.',
        name: 'Ana L.',
        city: 'Maracaibo',
        rating: 5,
    },
    {
        text: 'El Lubristone dejó mi carro como nuevo. Excelente producto y llegó rapidísimo.',
        name: 'Carlos M.',
        city: 'Maracay',
        rating: 5,
    },
    {
        text: 'Compré dos relojes y ambos llegaron perfectos. El empaque de calidad y todo como se veía en la foto.',
        name: 'Daniela V.',
        city: 'Barquisimeto',
        rating: 5,
    },
];

const stats = [
    { value: 2500, label: 'Pedidos Enviados', prefix: '+', suffix: '' },
    { value: 4.8, label: 'Rating Promedio', prefix: '', suffix: '/5' },
    { value: 99, label: 'Entrega Exitosa', prefix: '', suffix: '%' },
];

/**
 * AnimatedCounter — Scroll-triggered count-up animation
 */
function AnimatedCounter({ target, prefix = '', suffix = '', isDecimal = false }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 1500;
                    const startTime = performance.now();

                    function animate(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = eased * target;
                        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
                        if (progress < 1) requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, isDecimal]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </span>
    );
}

/**
 * TestimonialsSection — Customer testimonials + animated business metrics
 */
export default function TestimonialsSection() {
    const scrollRef = useRef(null);

    return (
        <section className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-blue text-center mb-2">
                    Lo que dicen nuestros clientes
                </h2>
                <div className="flex justify-center gap-1 mb-10">
                    {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className="text-yellow-400 text-lg">★</span>
                    ))}
                </div>

                {/* Testimonial cards — horizontal scroll mobile, grid desktop */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible"
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-[280px] sm:min-w-[300px] md:min-w-0 shrink-0 snap-start flex flex-col"
                        >
                            <div className="flex gap-0.5 mb-3">
                                {Array.from({ length: t.rating }, (_, n) => (
                                    <span key={n} className="text-yellow-400 text-sm">★</span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">
                                "{t.text}"
                            </p>
                            <p className="text-xs font-semibold text-brand-blue">
                                — {t.name}, <span className="text-gray-500 font-normal">{t.city}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats bar with counters */}
                <div className="mt-10 bg-brand-blue rounded-2xl p-6 sm:p-8 grid grid-cols-3 gap-4 text-center text-white shadow-lg">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <p className="text-2xl sm:text-3xl font-extrabold mb-1">
                                <AnimatedCounter
                                    target={s.value}
                                    prefix={s.prefix}
                                    suffix={s.suffix}
                                    isDecimal={String(s.value).includes('.')}
                                />
                            </p>
                            <p className="text-xs sm:text-sm text-white/70 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
