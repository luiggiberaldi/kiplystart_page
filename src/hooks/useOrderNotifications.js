import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useOrderNotifications — listens for new orders via Supabase Realtime
 * and plays a notification sound + calls a callback.
 * 
 * @param {Function} onNewOrder - Called with the new order row
 * @param {boolean} enabled - Whether to listen (default: true)
 */
export default function useOrderNotifications(onNewOrder, enabled = true) {
    const audioRef = useRef(null);

    // Create audio context on first user interaction (browser autoplay policy)
    const ensureAudio = useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = createNotificationSound();
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        // Ensure audio is ready (will work after first user click on page)
        document.addEventListener('click', ensureAudio, { once: true });
        document.addEventListener('keydown', ensureAudio, { once: true });
        ensureAudio(); // Try immediately too

        const channel = supabase
            .channel('admin-order-notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    // Play notification sound
                    playSound(audioRef.current);

                    // Vibrate if on mobile
                    if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200]);
                    }

                    // Call the callback
                    if (onNewOrder) onNewOrder(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            document.removeEventListener('click', ensureAudio);
            document.removeEventListener('keydown', ensureAudio);
        };
    }, [enabled, onNewOrder, ensureAudio]);
}

/**
 * Create a notification sound using Web Audio API
 * A pleasant two-tone chime (no external files needed)
 */
function createNotificationSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    } catch {
        return null;
    }
}

/**
 * Play a two-tone notification chime
 */
function playSound(audioCtx) {
    if (!audioCtx) return;

    try {
        // Resume context if suspended (browser autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // First tone — bright ding
        playTone(audioCtx, 880, now, 0.15, 0.3);       // A5
        // Second tone — higher, softer
        playTone(audioCtx, 1318.5, now + 0.15, 0.12, 0.25); // E6
        // Third tone — highest, resolution chime
        playTone(audioCtx, 1760, now + 0.3, 0.1, 0.2);  // A6

    } catch (err) {
        console.warn('Could not play notification sound:', err);
    }
}

function playTone(ctx, freq, startTime, duration, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
}
