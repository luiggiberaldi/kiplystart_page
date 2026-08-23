import React from 'react';

/**
 * lazyWithRetry
 * @description
 * Resilient wrapper around React.lazy() to gracefully handle stale chunk load errors
 * when a new production build is deployed to the server.
 * If fetching a chunk fails (e.g. 404/MIME text/html), it automatically forces a single
 * cache-busting reload to fetch the latest index and chunk hashes.
 * 
 * @param {Function} componentImport - Dynamic import function, e.g. () => import('./views/TrackingPage')
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithRetry(componentImport) {
    return React.lazy(async () => {
        const pageHasAlreadyBeenForceRefreshed = JSON.parse(
            window.sessionStorage.getItem('kiply-chunk-reload') || 'false'
        );

        try {
            const component = await componentImport();
            window.sessionStorage.setItem('kiply-chunk-reload', 'false');
            return component;
        } catch (error) {
            console.warn('Chunk load error detected. Refreshing for latest version...', error);
            if (!pageHasAlreadyBeenForceRefreshed) {
                window.sessionStorage.setItem('kiply-chunk-reload', 'true');
                window.location.reload();
                return { default: () => null };
            }
            throw error;
        }
    });
}
