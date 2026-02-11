import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * usePageTracker — tracks page views + joins Realtime Presence channel.
 * Place this in App.jsx or the main public layout.
 * 
 * - Inserts a row into page_views on first mount and on route change.
 * - Joins a Presence channel so admin can count live visitors.
 */
export default function usePageTracker() {
    const sessionId = useRef(getOrCreateSessionId());

    useEffect(() => {
        const path = window.location.pathname;

        // 1. Record page view
        supabase.from('page_views').insert({
            path,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            session_id: sessionId.current,
        }).then(); // fire-and-forget

        // 2. Join Presence channel for live tracking
        const channel = supabase.channel('page-presence', {
            config: { presence: { key: sessionId.current } }
        });

        channel
            .on('presence', { event: 'sync' }, () => { /* noop on visitor side */ })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        path,
                        joined_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.untrack();
            supabase.removeChannel(channel);
        };
    }, []);
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
