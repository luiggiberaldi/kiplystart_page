import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * useSecretAdminAccess Hook
 * Enables stealthy, frictionless access to the admin portal for store owners:
 * 1. Keybinds: Ctrl+Shift+A, Cmd+Shift+A, Ctrl+Alt+K
 * 2. Mobile / Click: Triple-tap or 2s long-press on secret trigger elements
 * 3. Search commands: /admin, kp:admin
 */
export function useSecretAdminAccess() {
    const navigate = useNavigate();

    const goToAdmin = useCallback(() => {
        if (navigator.vibrate) {
            try { navigator.vibrate(50); } catch {}
        }
        navigate('/admin-portal-2026');
    }, [navigate]);

    // 1. Global Keyboard Shortcut Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            
            // Ctrl + Shift + A  OR  Cmd + Shift + A
            if (isCtrlOrCmd && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                goToAdmin();
                return;
            }

            // Ctrl + Alt + K  OR  Cmd + Alt + K (K for KiplyStart)
            if (isCtrlOrCmd && e.altKey && (e.key === 'K' || e.key === 'k')) {
                e.preventDefault();
                goToAdmin();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToAdmin]);

    // Helper for multi-tap secret triggers (e.g. 3 taps within 1 second)
    const createTapHandler = useCallback((tapsRequired = 3, timeLimitMs = 1200) => {
        let tapCount = 0;
        let tapTimer = null;

        return () => {
            tapCount++;
            if (tapTimer) clearTimeout(tapTimer);

            if (tapCount >= tapsRequired) {
                tapCount = 0;
                goToAdmin();
            } else {
                tapTimer = setTimeout(() => {
                    tapCount = 0;
                }, timeLimitMs);
            }
        };
    }, [goToAdmin]);

    return { goToAdmin, createTapHandler };
}
