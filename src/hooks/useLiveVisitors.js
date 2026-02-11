import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useLiveVisitors — subscribes to Presence channel and returns live count.
 * Use this in admin DashboardStats.
 * 
 * Returns: { liveCount, visitors }
 *   - liveCount: number of currently connected visitors
 *   - visitors: array of presence state objects (path, joined_at)
 */
export default function useLiveVisitors() {
    const [liveCount, setLiveCount] = useState(0);
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        const channel = supabase.channel('page-presence');

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const allPresences = Object.values(state).flat();
                setLiveCount(allPresences.length);
                setVisitors(allPresences);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { liveCount, visitors };
}
