import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SettingsContext = createContext();

const DB_SETTINGS_COLUMNS = new Set([
    'shipping_cost', 'profit_margin',
    'compare_at_multiplier', 'compare_at_suffix',
    'bundle_2_discount', 'bundle_3_discount',
    'low_stock_threshold',
    'store_name', 'whatsapp_number',
    'admin_email', 'instagram_handle',
    'currency', 'auto_deactivate_oos', 'notify_low_stock'
]);

const DEFAULTS = {
    shipping_cost: 8, 
    profit_margin: 6,
    compare_at_multiplier: 1.4, 
    compare_at_suffix: '.90',
    bundle_2_discount: 10, 
    bundle_3_discount: 20,
    order_bump_discount_pct: 30,
    low_stock_threshold: 5,
    store_name: 'KiplyStart',
    whatsapp_number: '+584121234567',
    admin_email: '', 
    instagram_handle: '',
    currency: 'USD',
    auto_deactivate_oos: true, 
    notify_low_stock: true,
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULTS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                // Read local persisted client settings
                let localOrderBump = 30;
                try {
                    const saved = localStorage.getItem('kiply_order_bump_discount_pct');
                    if (saved) localOrderBump = parseInt(saved, 10) || 30;
                } catch {}

                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .eq('id', 1)
                    .single();

                if (!error && data) {
                    const { id: _id, updated_at: _updated_at, ...rest } = data;
                    setSettings(prev => ({ 
                        ...prev, 
                        ...rest, 
                        order_bump_discount_pct: localOrderBump 
                    }));
                } else {
                    setSettings(prev => ({ ...prev, order_bump_discount_pct: localOrderBump }));
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

        // Persist client-side settings
        if (newSettings.order_bump_discount_pct !== undefined) {
            try {
                localStorage.setItem('kiply_order_bump_discount_pct', newSettings.order_bump_discount_pct.toString());
            } catch {}
        }

        // Only send known columns to the Supabase Postgres 'settings' table
        const dbPayload = {};
        for (const [key, val] of Object.entries(newSettings)) {
            if (DB_SETTINGS_COLUMNS.has(key)) {
                dbPayload[key] = val;
            }
        }

        if (Object.keys(dbPayload).length > 0) {
            const { error } = await supabase
                .from('settings')
                .update(dbPayload)
                .eq('id', 1);

            if (error) {
                console.error('Supabase settings update error:', error);
                throw error;
            }
        }
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
