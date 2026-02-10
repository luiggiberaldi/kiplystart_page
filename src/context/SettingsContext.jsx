import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SettingsContext = createContext();

const DEFAULTS = {
    shipping_cost: 8, profit_margin: 6,
    compare_at_multiplier: 1.4, compare_at_suffix: '.90',
    bundle_2_discount: 10, bundle_3_discount: 20,
    low_stock_threshold: 5,
    store_name: 'KiplyStart',
    whatsapp_number: '+584121234567',
    admin_email: '', instagram_handle: '',
    currency: 'USD',
    auto_deactivate_oos: true, notify_low_stock: true,
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULTS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .eq('id', 1)
                    .single();
                if (!error && data) {
                    const { id, updated_at, ...rest } = data;
                    setSettings(prev => ({ ...prev, ...rest }));
                }
            } catch (e) {
                console.warn('Settings fetch failed, using defaults', e);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    async function saveSettings(newSettings) {
        setSettings(newSettings);
        const { id, updated_at, ...payload } = newSettings;
        const { error } = await supabase
            .from('settings')
            .update(payload)
            .eq('id', 1);
        if (error) throw error;
        return true;
    }

    return (
        <SettingsContext.Provider value={{ settings, saveSettings, loaded }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
    return ctx;
}
