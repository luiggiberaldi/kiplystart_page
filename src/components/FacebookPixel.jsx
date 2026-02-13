import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Facebook Pixel Integration
 * @description
 * Injects the Facebook Pixel script into the head and tracks PageViews
 * on every route change.
 * 
 * Usage:
 * Add VITE_FACEBOOK_PIXEL_ID=your_id_here to .env
 * Place <FacebookPixel /> inside <BrowserRouter>
 */
const FacebookPixel = () => {
    const location = useLocation();

    // 1. Inject Script on Mount
    useEffect(() => {
        const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

        if (!pixelId) {
            console.warn('Facebook Pixel: No VITE_FACEBOOK_PIXEL_ID found in .env');
            return;
        }

        // Prevent duplicate injection
        if (window.fbq) return;

        /* eslint-disable */
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */

        // Init Pixel
        window.fbq('init', pixelId);
    }, []);

    // 2. Track PageView on Route Change
    useEffect(() => {
        const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
        if (!pixelId || !window.fbq) return;

        window.fbq('track', 'PageView');
    }, [location]);

    return null;
};

export default FacebookPixel;
