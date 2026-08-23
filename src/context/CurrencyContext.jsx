import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatUSD as pureFormatUSD, formatBs as pureFormatBs } from '../utils/pricingCalculations';

const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

// === API Chain ===
async function fetchRateFromAPIs() {
    // 1. Primary Live Official BCV API: DolarApi Venezuela
    try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (res.ok) {
            const data = await res.json();
            const rate = parseFloat(data.promedio || data.precio || data.valor);
            if (rate && rate > 100) return { rate, source: 'bcv-oficial-dolarapi' };
        }
    } catch {
        // Fallback to secondary APIs
    }

    // 2. Secondary: BCV API rafnixg
    try {
        const res = await fetch('https://bcv-api.rafnixg.dev/rates/');
        if (res.ok) {
            const data = await res.json();
            if (data.usd && parseFloat(data.usd) > 100) {
                return { rate: parseFloat(data.usd), source: 'bcv-rafnixg' };
            }
        }
    } catch {
        // Fallback
    }

    // 3. Private Google Script API
    try {
        const bcvToken = import.meta.env.VITE_BCV_TOKEN || '';
        if (bcvToken) {
            const res = await fetch(`/google-api/macros/s/AKfycbxT9sKz_XWRWuQx_XP-BJ33T0hoAgJsLwhZA00v6nPt4Ij4jRjq-90mDGLVCsS6FXwW9Q/exec?token=${bcvToken}`);
            const data = await res.json();
            if (data.bcv?.price && data.bcv.price > 600) return { rate: data.bcv.price, source: 'google-script' };
        }
    } catch {
        // All remote APIs failed
    }

    return null;
}

// === Cache helpers ===
function getCachedRate() {
    try {
        const cached = JSON.parse(localStorage.getItem('bcv_rate_cache'));
        // Invalidate stale caches with outdated exchange rate (< 600)
        if (cached?.rate && cached?.rate > 600 && cached?.timestamp) return cached;
    } catch {
        // Cache parse failure
    }
    return null;
}

function setCachedRate(rate, source) {
    localStorage.setItem('bcv_rate_cache', JSON.stringify({
        rate, source, timestamp: Date.now()
    }));
}

export const CurrencyProvider = ({ children }) => {
    const [exchangeRate, setExchangeRate] = useState(null);
    const [rateSource, setRateSource] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBs, setShowBs] = useState(true);
    const [rateMode, setRateMode] = useState('auto'); // 'auto' | 'manual'

    // Load settings from Supabase
    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('settings')
                    .select('rate_mode, manual_rate, rate_cache_hours, show_bs')
                    .eq('id', 1)
                    .single();
                if (data) {
                    setRateMode(data.rate_mode || 'auto');
                    setShowBs(data.show_bs !== false);

                    if (data.rate_mode === 'manual' && data.manual_rate > 0) {
                        setExchangeRate(data.manual_rate);
                        setRateSource('manual');
                        setLastUpdated(new Date());
                        setLoading(false);
                        return;
                    }

                    // Auto mode: check cache first
                    const cacheHours = data.rate_cache_hours || 2;
                    const cached = getCachedRate();
                    if (cached && (Date.now() - cached.timestamp) < cacheHours * 3600000) {
                        setExchangeRate(cached.rate);
                        setRateSource(cached.source + ' (cache)');
                        setLastUpdated(new Date(cached.timestamp));
                        setLoading(false);
                        return;
                    }

                    // Fetch fresh rate
                    const result = await fetchRateFromAPIs();
                    if (result) {
                        setExchangeRate(result.rate);
                        setRateSource(result.source);
                        setCachedRate(result.rate, result.source);
                    } else {
                        setExchangeRate(cached?.rate || 779.95);
                        setRateSource(cached ? 'stale-cache' : 'fallback');
                    }
                    setLastUpdated(new Date());
                    setLoading(false);
                } else {
                    const result = await fetchRateFromAPIs();
                    setExchangeRate(result?.rate || 779.95);
                    setRateSource(result?.source || 'fallback');
                    setLastUpdated(new Date());
                    setLoading(false);
                }
            } catch (e) {
                console.warn('CurrencyContext init failed:', e);
                setExchangeRate(779.95);
                setRateSource('error-fallback');
                setLastUpdated(new Date());
                setLoading(false);
            }
        })();
    }, []);

    // Refresh rate every hour (auto mode only)
    useEffect(() => {
        if (rateMode !== 'auto') return;
        const interval = setInterval(async () => {
            const result = await fetchRateFromAPIs();
            if (result) {
                setExchangeRate(result.rate);
                setRateSource(result.source);
                setCachedRate(result.rate, result.source);
                setLastUpdated(new Date());
            }
        }, 3600000);
        return () => clearInterval(interval);
    }, [rateMode]);

    // === Formatters ===
    const formatUSD = useCallback((amountUSD) => pureFormatUSD(amountUSD), []);

    const formatBs = useCallback((amountUSD) => pureFormatBs(amountUSD, exchangeRate), [exchangeRate]);

    // Legacy: returns formatted string based on selected currency
    const formatPrice = useCallback((amountUSD) => pureFormatUSD(amountUSD), []);

    const value = {
        exchangeRate,
        rateSource,
        lastUpdated,
        loading,
        showBs,
        rateMode,
        formatPrice,
        formatUSD,
        formatBs,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
