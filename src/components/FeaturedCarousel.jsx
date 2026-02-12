import { useRef, useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';

/**
 * FeaturedCarousel – infinite auto-scrolling product carousel.
 *
 * - Shows 1 card on mobile, 2 on tablet, 3 on desktop
 * - Auto-slides every 3.5 s, loops infinitely
 * - Pause on hover / touch
 * - Swipe and arrow navigation
 * - Dot indicators
 */
export default function FeaturedCarousel({ products = [] }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const [visibleCards, setVisibleCards] = useState(getVisibleCards());
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);

    const total = products.length;
    // Max index before we'd show empty space on the right
    const maxSlide = Math.max(0, total - visibleCards);

    // Update visible count on resize
    useEffect(() => {
        const onResize = () => setVisibleCards(getVisibleCards());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Auto-advance — infinite loop
    useEffect(() => {
        if (paused || total <= visibleCards) return;
        const id = setInterval(() => {
            setActiveIdx(prev => (prev >= maxSlide ? 0 : prev + 1));
        }, 3500);
        return () => clearInterval(id);
    }, [paused, total, visibleCards, maxSlide]);

    // Navigation helpers
    const goNext = useCallback(() => {
        setActiveIdx(prev => (prev >= maxSlide ? 0 : prev + 1));
    }, [maxSlide]);

    const goPrev = useCallback(() => {
        setActiveIdx(prev => (prev <= 0 ? maxSlide : prev - 1));
    }, [maxSlide]);

    // Swipe handling
    const onTouchStart = useCallback((e) => {
        setPaused(true);
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    }, []);

    const onTouchMove = useCallback((e) => {
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }, []);

    const onTouchEnd = useCallback(() => {
        const delta = touchDeltaX.current;
        if (delta < -50) goNext();
        else if (delta > 50) goPrev();
        touchDeltaX.current = 0;
        setTimeout(() => setPaused(false), 4000);
    }, [goNext, goPrev]);

    if (!total) {
        return (
            <div className="text-center py-10 bg-white rounded-xl">
                <span className="text-4xl">📦</span>
                <p className="text-gray-500 mt-2">No hay productos destacados por ahora.</p>
            </div>
        );
    }

    const cardWidth = 100 / visibleCards;
    const translateX = activeIdx * cardWidth;

    return (
        <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Overflow container */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${translateX}%)` }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="shrink-0 px-2"
                            style={{ width: `${cardWidth}%` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation arrows */}
            {total > visibleCards && (
                <>
                    <button
                        onClick={goPrev}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full items-center justify-center text-brand-blue hover:bg-white hover:scale-110 transition-all"
                        aria-label="Anterior"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    <button
                        onClick={goNext}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full items-center justify-center text-brand-blue hover:bg-white hover:scale-110 transition-all"
                        aria-label="Siguiente"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {total > visibleCards && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            aria-label={`Ir a posición ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${i === activeIdx
                                    ? 'w-6 h-2 bg-brand-blue'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function getVisibleCards() {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
}
