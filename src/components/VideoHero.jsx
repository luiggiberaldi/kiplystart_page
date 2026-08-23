import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, ShieldCheck, ArrowRight, Truck, RefreshCw } from 'lucide-react';

/**
 * VideoHero Component
 * @description
 * Responsive Hero with precise 0.5s shorter loop trimming for perfect pacing:
 * - Desktop & Mobile: Plays Optimized Video with dynamic timeupdate loop (duration - 0.5s).
 * - Phase 1 -> Phase 2 text transition dynamically synced with the trimmed loop duration.
 */
export default function VideoHero() {
    const desktopVideoRef = useRef(null);
    const mobileVideoRef = useRef(null);
    const [showPhase2, setShowPhase2] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handles looping 0.5 seconds earlier (making video half a second shorter)
    const handleTimeUpdate = (e) => {
        const video = e.target;
        if (!video || !video.duration) return;

        // Trim 0.5s from the end for a faster, snappier loop
        const effectiveDuration = Math.max(0.1, video.duration - 0.5);

        if (video.currentTime >= effectiveDuration) {
            video.currentTime = 0;
            video.play().catch(() => {});
            setShowPhase2(false);
            return;
        }

        const progress = video.currentTime / effectiveDuration;

        // Show Phase 2 at ~50% of the shortened clip
        if (progress >= 0.50) {
            setShowPhase2(true);
        } else {
            setShowPhase2(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden group">

            {/* 
                MEDIA LAYER
                Conditionally rendered for high performance
            */}
            {!isMobile ? (
                /* DESKTOP: MP4 Video (Trimmed by 0.5s in JS loop) */
                <video
                    ref={desktopVideoRef}
                    className="w-full h-full object-cover scale-[1.06] origin-top animate-fade-in"
                    autoPlay
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    poster="/hero.png"
                    src="/videos/hero.mp4"
                />
            ) : (
                /* MOBILE: MP4 Video (Trimmed by 0.5s in JS loop) */
                <video
                    ref={mobileVideoRef}
                    className="w-full h-full object-cover scale-[1.06] origin-top"
                    autoPlay
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    poster="/hero-man.png"
                    src="/videos/hero-mobile.mp4"
                />
            )}

            {/* Overlay Darkening with Luxury Ambient Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 pointer-events-none z-10"></div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 pointer-events-none z-20">

                {/* Phase 1: "Envíos GRATIS hasta tu puerta" */}
                <div
                    className={`transition-all duration-[600ms] ease-out absolute transform max-w-5xl mx-auto px-4 ${
                        showPhase2 ? 'opacity-0 translate-y-[-24px] blur-xs pointer-events-none' : 'opacity-100 translate-y-0 blur-0'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-wider mb-4 shadow-lg">
                        <Truck className="w-4 h-4 text-brand-red" />
                        <span>Despachos a Nivel Nacional</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 tracking-tight leading-tight">
                        Envíos <span className="text-brand-red text-shadow-md">GRATIS</span> hasta tu puerta
                    </h1>
                    <p className="text-lg sm:text-2xl md:text-3xl text-white/95 font-semibold drop-shadow-lg max-w-2xl mx-auto">
                        Servicio a domicilio en toda Venezuela con entrega asegurada
                    </p>
                </div>

                {/* Phase 2: "Paga al recibir a Tasa BCV" */}
                <div
                    className={`transition-all duration-[600ms] ease-out absolute transform max-w-5xl mx-auto px-4 ${
                        showPhase2 ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-[24px] blur-xs pointer-events-none'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-4 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Cero Riesgo · Primero Verificas</span>
                    </div>
                    <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 tracking-tight leading-tight">
                        Paga al recibir a <span className="text-brand-red text-shadow-md">Tasa BCV</span>
                    </h2>
                    <p className="text-lg sm:text-2xl md:text-3xl text-white/95 font-semibold drop-shadow-lg mb-8 max-w-2xl mx-auto">
                        Primero tienes el producto en tus manos, luego realizas tu pago
                    </p>

                    {/* CTA Button */}
                    <div className={`pointer-events-auto transition-all duration-400 delay-75 transform ${showPhase2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                        <Link
                            to="/catalogo"
                            className="inline-flex items-center gap-3 bg-brand-red hover:bg-red-700 text-white font-black text-base sm:text-lg px-8 py-4 sm:px-10 sm:py-5 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-brand-red/40 ring-4 ring-white/20 active:scale-95 cursor-pointer"
                        >
                            <span>COMPRAR AHORA</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </div>

            {/* Stats Bar — Bottom Value Props */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/70 backdrop-blur-md border-t border-white/10">
                <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-white/10 py-3.5 px-4 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-white">
                        <span className="text-base sm:text-xl font-black text-white">+2,500</span>
                        <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase tracking-wider">Pedidos Entregados</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-white">
                        <span className="text-base sm:text-xl font-black text-emerald-400">24-48h</span>
                        <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase tracking-wider">Envío Gratis</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-white">
                        <span className="text-base sm:text-xl font-black text-brand-red">Tasa BCV</span>
                        <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase tracking-wider">Oficial del Día</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
