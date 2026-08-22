import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

/**
 * usePageTracker — tracks page views + joins Realtime Presence channel.
 * Place this in App.jsx inside the <Router>.
 * 
 * - Inserts a row into page_views on route change.
 * - Joins a Presence channel so admin can count live visitors.
 */
export default function usePageTracker() {
    const sessionId = useRef(getOrCreateSessionId());
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/admin')) return;

        // 1. Record page view
        supabase.from('page_views').insert({
            path,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            session_id: sessionId.current,
        }).then();

        // 2. Join Presence channel for live tracking
        const channel = supabase.channel('page-presence', {
            config: { presence: { key: sessionId.current } }
        });

        channel
            .on('presence', { event: 'sync' }, () => { /* noop on visitor side */ })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Presence connected. Fetching geo...');

                    // Robust Geolocation Fetching Strategy
                    let geo = {};
                    let debugError = null;

                    const fetchGeo = async () => {
                        // Strategy 1: ipwho.is (Free, 10k/month, detailed)
                        try {
                            const res = await fetch('https://ipwho.is/');
                            if (res.ok) {
                                const data = await res.json();
                                if (data.success) {
                                    return {
                                        country: data.country_code,
                                        city: data.city,
                                        lat: data.latitude,
                                        lng: data.longitude,
                                        region: data.region,
                                        provider: 'ipwho.is'
                                    };
                                }
                            }
                        } catch (e) {
                            console.warn('⚠️ ipwho.is failed, trying next...', e);
                        }

                        // Strategy 2: ipapi.co (Free quota, reliable)
                        try {
                            const res = await fetch('https://ipapi.co/json/');
                            if (res.ok) {
                                const data = await res.json();
                                if (!data.error) {
                                    return {
                                        country: data.country_code,
                                        city: data.city,
                                        lat: data.latitude,
                                        lng: data.longitude,
                                        region: data.region_code,
                                        provider: 'ipapi.co'
                                    };
                                }
                            }
                        } catch (e) {
                            console.warn('⚠️ ipapi.co failed, trying next...', e);
                        }

                        // Strategy 3: geojs.io (Free, very robust fallback)
                        try {
                            const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
                            if (res.ok) {
                                const data = await res.json();
                                return {
                                    country: data.country_code,
                                    city: data.city,
                                    lat: parseFloat(data.latitude),
                                    lng: parseFloat(data.longitude),
                                    region: data.region,
                                    provider: 'geojs.io'
                                };
                            }
                        } catch (e) {
                            console.warn('⚠️ geojs.io failed.', e);
                        }

                        return { error: 'ALL_PROVIDERS_FAILED' };
                    };

                    // Execute Fetch
                    try {
                        const result = await fetchGeo();
                        if (result.error) {
                            console.error('❌ Could not determine location:', result.error);
                            // FALLBACK: Default to Caracas if all fail, so we at least see the pin
                            geo = {
                                country: 'VE',
                                city: 'ERROR: ' + result.error,
                                lat: 10.4806,
                                lng: -66.9036,
                                region: 'Fallback',
                                provider: 'FALLBACK'
                            };
                            debugError = result.error;
                        } else {
                            geo = result;
                            console.log('📍 Location found via', geo.provider, geo);
                        }
                    } catch (e) {
                        debugError = e.message;
                        // Safety Fallback
                        geo = {
                            country: 'VE',
                            city: 'CRITICAL_ERR',
                            lat: 10.48,
                            lng: -66.90,
                            provider: 'CRITICAL'
                        };
                    }

                    // 3. Track Presence
                    await channel.track({
                        path,
                        joined_at: new Date().toISOString(),
                        ...geo, // Spread geo fields (lat, lng, country...)
                        geo_error: debugError // Send error info to admin if any
                    });
                }
            });

        return () => {
            channel.untrack();
            supabase.removeChannel(channel);
        };
    }, [location.pathname]);
}

/** Generate or reuse a session ID for this browser tab session */
function getOrCreateSessionId() {
    let id = sessionStorage.getItem('kp_session_id');
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem('kp_session_id', id);
    }
    return id;
}
