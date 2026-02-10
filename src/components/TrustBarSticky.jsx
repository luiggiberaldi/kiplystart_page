import { useEffect, useState } from 'react';

/**
 * TrustBarSticky Component - Product Bible 2026 Standard
 * @description
 * Sticky trust bar showing 3 core guarantees to reduce fraud fear.
 * Neuro-optimized for Venezuelan market.
 * 
 * Responsive breakpoints:
 * - 320px+: All 3 items visible, smaller text
 * - 768px+: Full size text with separators
 */
export default function TrustBarSticky() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`trust-bar-sticky sticky top-0 z-[1000] transition-shadow ${isSticky ? 'shadow-lg' : ''}`}
            style={{
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '0.5rem 0.75rem'
            }}
        >
            <div className="max-w-4xl mx-auto flex justify-center items-center gap-2 md:gap-6 text-[10px] md:text-sm font-semibold">
                <span className="flex items-center gap-0.5 whitespace-nowrap">
                    🔒 <span className="hidden sm:inline">PAGO AL</span> RECIBIR
                </span>
                <span className="text-white/50">|</span>
                <span className="flex items-center gap-0.5 whitespace-nowrap">
                    ✓ TASA BCV
                </span>
                <span className="text-white/50">|</span>
                <span className="flex items-center gap-0.5 whitespace-nowrap">
                    🚚 ENVÍO GRATIS
                </span>
            </div>
        </div>
    );
}
