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
                console.log('Admin Presence State:', state); // Debug log
                const allPresences = Object.values(state).flat();
                console.log('Admin Flattened Visitors (JSON):', JSON.stringify(allPresences, null, 2)); // Deep Debug log
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
