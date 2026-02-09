import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * VideoHero Component
 * @description
 * Responsive Hero:
 * - Desktop: Plays High-Quality WebP (<img>) - Timed text transition (4s)
 * - Mobile: Plays Optimized MP4 (<video>) - Synced text transition (onTimeUpdate)
 * - Conditional rendering prevents double data usage.
 */
export default function VideoHero() {
    const videoRef = useRef(null);
    const [showPhase2, setShowPhase2] = useState(false);

    // Detect Mobile Viewport (< 768px) to serve correct media
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile(); // Check on mount
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // DESKTOP: WebP Timing Logic
    // Frame 0-40 (approx 0-45%) -> Frame 55-90 (approx 60%+)
    // Assuming effective animation duration is ~6s (standard for these loops)
    useEffect(() => {
        if (!isMobile) {
            // Phase 1 -> Phase 2 transition roughly at 3.5s (matching previous logic)
            const timer = setTimeout(() => {
                setShowPhase2(true);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isMobile]);

    // MOBILE: Video Sync Logic
    // Frame 40/90 = 0.44
    // Frame 55/90 = 0.61
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        const progress = video.currentTime / video.duration;

        // Show Phase 2 starting at Frame 55 (60%)
        if (progress > 0.60) {
            setShowPhase2(true);
        } else {
            setShowPhase2(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden group">

            {/* 
                MEDIA LAYER
                Conditionally rendered for performance (only load what's needed)
            */}
            {!isMobile ? (
                /* DESKTOP: WebP */
                <img
                    src="/videos/hero.webp"
                    alt="Entrega segura KiplyStart Desktop"
                    className="w-full h-full object-cover scale-[1.06] origin-top animate-fade-in"
                />
            ) : (
                /* MOBILE: MP4 Video */
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover scale-[1.06] origin-top"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    src="/videos/hero-mobile.mp4"
                />
            )}

            {/* Overlay Darkening */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-10 transition-opacity duration-1000"></div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 pointer-events-none z-20">

                {/* Phase 1: "Envíos GRATIS hasta tu puerta" (0-60%) */}
                <div
                    className={`transition-all duration-[800ms] ease-out absolute transform max-w-5xl mx-auto ${showPhase2 ? 'opacity-0 translate-y-[-30px] blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-white drop-shadow-xl mb-4 tracking-tight leading-tight">
                        Envíos <span className="text-brand-red text-shadow-sm">GRATIS</span> hasta tu puerta
                    </h2>
                    <p className="text-xl md:text-3xl text-white/95 font-medium drop-shadow-lg pb-2">
                        Servicio a domicilio en todo el país
                    </p>
                </div>

                {/* Phase 2: "Paga al recibir a Tasa BCV" (60%+) */}
                <div
                    className={`transition-all duration-[800ms] ease-out absolute transform max-w-5xl mx-auto ${showPhase2 ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-[30px] blur-sm'}`}
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-white drop-shadow-xl mb-6 tracking-tight leading-tight px-4">
                        Paga al recibir a <span className="text-brand-red text-shadow-sm">Tasa BCV</span>
                    </h2>
                    <p className="text-xl md:text-3xl text-white/95 font-medium drop-shadow-lg mb-8">
                        Primero verificas tu producto, luego pagas
                    </p>

                    {/* CTA Button with Pop-Up Animation */}
                    <div className={`pointer-events-auto transition-all duration-500 delay-100 transform ${showPhase2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <Link
                            to="/catalogo"
                            className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red/90 text-white font-bold text-lg px-8 py-4 md:px-10 md:py-5 rounded-full shadow-2xl transition-transform hover:scale-105 hover:shadow-brand-red/30 ring-4 ring-white/10 backdrop-blur-sm"
                        >
                            <span className="tracking-wide">COMPRAR AHORA</span>
                            <span className="material-symbols-outlined text-2xl">thumb_up</span>
                        </Link>
                        <p className="text-white/80 text-sm mt-4 font-medium tracking-wide update-check flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></span>
                            Pago Contraentrega
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
