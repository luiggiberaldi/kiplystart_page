import { useState, useEffect } from 'react';

/**
 * useIsMobile Hook
 * @description Reactive hook for mobile detection using matchMedia.
 * Breakpoint: 767px (below Tailwind's md breakpoint of 768px).
 * Updates on resize/orientation change.
 */
export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 767px)').matches;
    });

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 767px)');
        const handler = (e) => setIsMobile(e.matches);

        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    return isMobile;
}
