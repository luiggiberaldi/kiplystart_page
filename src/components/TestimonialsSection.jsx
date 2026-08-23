import { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle2, MapPin, Quote, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const testimonials = [
    {
        text: 'Pedí el cargador inteligente y me llegó en menos de 1 hora a mi casa en Chacao. Pagué en efectivo al recibir y revivió la batería de una.',
        name: 'Carlos M.',
        city: 'Caracas',
        rating: 5,
        item: 'Cargador de Batería 12V',
        avatarColor: 'bg-blue-600 text-white'
    },
    {
        text: 'Excelente servicio. Compré el compresor de aire desde Valencia y me llegó al día siguiente con Tealca. Calibré los 4 cauchos al instante.',
        name: 'José R.',
        city: 'Valencia, Carabobo',
        rating: 5,
        item: 'Compresor Digital Portátil',
        avatarColor: 'bg-emerald-600 text-white'
    },
    {
        text: 'Nunca había comprado online en Venezuela con Pago Contra Entrega. Es lo máximo: revisas el paquete y luego pagas con Pago Móvil a Tasa BCV.',
        name: 'Ana L.',
        city: 'Maracaibo, Zulia',
        rating: 5,
        item: 'Kit de Limpieza Lubristone',
        avatarColor: 'bg-purple-600 text-white'
    },
    {
        text: 'Las tiras Nox me cambiaron el sueño por completo. Cero ronquidos y respiro despejado toda la noche. Súper recomendados.',
        name: 'Daniela V.',
        city: 'Barquisimeto, Lara',
        rating: 5,
        item: 'Nox Tiras Nasales',
        avatarColor: 'bg-amber-600 text-white'
    },
    {
        text: 'El motorizado express llegó súper puntual a Los Palos Grandes. Todo bien sellado y empaque de primera calidad.',
        name: 'María G.',
        city: 'Caracas',
        rating: 5,
        item: 'Reloj T900 Ultra 2',
        avatarColor: 'bg-rose-600 text-white'
    },
];

const stats = [
    { value: 4800, label: 'Pedidos Entregados', prefix: '+', suffix: '' },
    { value: 99.2, label: 'Calificación Positiva', prefix: '', suffix: '%' },
    { value: 24, label: 'Estados con Cobertura', prefix: '', suffix: '' },
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
        <span ref={ref} className="tabular-nums font-black">
            {prefix}{isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </span>
    );
}

/**
 * TestimonialsSection — Mobile-Optimized Customer Reviews & Animated Metrics
 */
export default function TestimonialsSection() {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, clientWidth } = scrollRef.current;
        const index = Math.round(scrollLeft / (clientWidth * 0.85));
        setActiveIndex(Math.min(index, testimonials.length - 1));
    };

    const scrollTo = (index) => {
        if (!scrollRef.current) return;
        const cardWidth = scrollRef.current.clientWidth * 0.85;
        scrollRef.current.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
        setActiveIndex(index);
    };

    return (
        <section className="py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
                {/* Header */}
                <div className="text-center space-y-2 max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                        <div className="flex text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <Star key={n} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span>4.9 / 5.0 (4,800+ Reseñas)</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-tight">
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Experiencias reales de compradores con Pago Contra Entrega en toda Venezuela:
                    </p>
                </div>

                {/* Testimonial Cards Carousel / Grid */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-1 px-1 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:gap-6"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/80 w-[82vw] max-w-[320px] sm:w-[320px] md:w-auto shrink-0 snap-center flex flex-col justify-between transition-all hover:shadow-md hover:border-gray-300"
                            >
                                <div className="space-y-3">
                                    {/* Card Top: Stars + Verified Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-0.5 text-amber-400">
                                            {Array.from({ length: t.rating }, (_, n) => (
                                                <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                            <span>Verificado</span>
                                        </span>
                                    </div>

                                    {/* Quote Text */}
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                                        "{t.text}"
                                    </p>
                                </div>

                                {/* User & Purchase Details */}
                                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${t.avatarColor}`}>
                                            {t.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-gray-950 truncate">
                                                {t.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-semibold truncate flex items-center gap-0.5">
                                                <MapPin className="w-2.5 h-2.5 text-gray-400" />
                                                {t.city}
                                            </p>
                                        </div>
                                    </div>

                                    {t.item && (
                                        <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/80 truncate max-w-[110px] hidden xs:inline-block">
                                            {t.item}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Pagination Dots */}
                    <div className="flex md:hidden justify-center items-center gap-1.5 pt-2">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollTo(idx)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                    activeIndex === idx ? 'w-6 bg-[#0A2463]' : 'w-1.5 bg-gray-300'
                                }`}
                                aria-label={`Ir al testimonio ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Bar with Counters */}
                <div className="bg-gradient-to-br from-slate-900 via-[#0A2463] to-slate-950 rounded-3xl p-6 sm:p-8 grid grid-cols-3 gap-3 sm:gap-6 text-center text-white shadow-xl border border-white/10">
                    {stats.map((s, i) => (
                        <div key={i} className="space-y-1">
                            <p className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                                <AnimatedCounter
                                    target={s.value}
                                    prefix={s.prefix}
                                    suffix={s.suffix}
                                    isDecimal={String(s.value).includes('.')}
                                />
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-blue-200/80 font-bold">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
