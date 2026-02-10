import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

// === API Chain ===
async function fetchRateFromAPIs() {
    // 1. Private Google Script API
    try {
        const bcvToken = import.meta.env.VITE_BCV_TOKEN || '';
        const res = await fetch(`/google-api/macros/s/AKfycbxT9sKz_XWRWuQx_XP-BJ33T0hoAgJsLwhZA00v6nPt4Ij4jRjq-90mDGLVCsS6FXwW9Q/exec?token=${bcvToken}`);
        const data = await res.json();
        if (data.bcv?.price) return { rate: data.bcv.price, source: 'google-script' };
    } catch { }

    // 2. Public API (pydolarve / bcv-api)
    try {
        const res = await fetch('/api/v1/dollar?page=bcv');
        const data = await res.json();
        const rate = data.monitors?.bcv?.price || data.bcv?.price || data.bcv?.rate;
        if (rate) return { rate, source: 'pydolarve' };
    } catch { }

    // 3. Fallback: rafnixg BCV API
    try {
        const res = await fetch('https://bcv-api.rafnixg.dev/rates/');
        const data = await res.json();
        if (data.usd) return { rate: parseFloat(data.usd), source: 'rafnixg' };
    } catch { }

    return null;
}

// === Cache helpers ===
function getCachedRate() {
    try {
        const cached = JSON.parse(localStorage.getItem('bcv_rate_cache'));
        if (cached?.rate && cached?.timestamp) return cached;
    } catch { }
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
                    const cacheHours = data.rate_cache_hours || 4;
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
                        // Use cached even if stale, or fallback
                        setExchangeRate(cached?.rate || 55.0);
                        setRateSource(cached ? 'stale-cache' : 'fallback');
                    }
                    setLastUpdated(new Date());
                    setLoading(false);
                } else {
                    // No settings row — fallback
                    const result = await fetchRateFromAPIs();
                    setExchangeRate(result?.rate || 55.0);
                    setRateSource(result?.source || 'fallback');
                    setLastUpdated(new Date());
                    setLoading(false);
                }
            } catch (e) {
                console.warn('CurrencyContext init failed:', e);
                setExchangeRate(55.0);
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
    const formatUSD = useCallback((amountUSD) => {
        if (!amountUSD) return '$0';
        const hasDecimals = amountUSD % 1 !== 0;
        return `$${amountUSD.toLocaleString('en-US', {
            minimumFractionDigits: hasDecimals ? 2 : 0,
            maximumFractionDigits: 2
        })}`;
    }, []);

    const formatBs = useCallback((amountUSD) => {
        if (!amountUSD || !exchangeRate) return '';
        const amountVES = amountUSD * exchangeRate;
        return `Bs ${amountVES.toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }, [exchangeRate]);

    // Legacy: returns formatted string based on selected currency
    const formatPrice = useCallback((amountUSD) => {
        if (!amountUSD) return '$0';
        return formatUSD(amountUSD);
    }, [formatUSD]);

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
