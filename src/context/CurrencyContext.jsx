import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'USD'); // 'USD' | 'VES'
    const [exchangeRate, setExchangeRate] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleCurrency = () => {
        const newCurrency = currency === 'USD' ? 'VES' : 'USD';
        setCurrency(newCurrency);
        localStorage.setItem('app_currency', newCurrency);
    };

    const fetchRate = async () => {
        setLoading(true);
        let rate = 0;

        // 1. Try Private Google Script API (Primary)
        try {
            const bcvToken = import.meta.env.VITE_BCV_TOKEN || '';
            const response = await fetch(`/google-api/macros/s/AKfycbxT9sKz_XWRWuQx_XP-BJ33T0hoAgJsLwhZA00v6nPt4Ij4jRjq-90mDGLVCsS6FXwW9Q/exec?token=${bcvToken}`);
            const data = await response.json();
            if (data.bcv && data.bcv.price) {
                rate = data.bcv.price;
            }
        } catch {
            // Private API failed, try public API
        }

        // 2. Try Public API (Fallback 1)
        if (!rate) {
            try {
                const response = await fetch('/api/v1/dollar?page=bcv');
                const data = await response.json();
                if (data.monitors && data.monitors.bcv) {
                    rate = data.monitors.bcv.price;
                } else if (data.bcv) {
                    rate = data.bcv.price || data.bcv.rate;
                }
            } catch {
                // Public API failed, using hardcoded fallback
            }
        }

        // 3. Hardcoded Fallback (Fallback 2)
        if (!rate || isNaN(rate)) {
            rate = 55.00; // Safe fallback
        }

        setExchangeRate(rate);
        setLastUpdated(new Date());
        setLoading(false);
    };

    useEffect(() => {
        fetchRate();
        // Refresh every hour
        const interval = setInterval(fetchRate, 3600000);
        return () => clearInterval(interval);
    }, []);

    const formatPrice = (amountUSD) => {
        if (!amountUSD) return '$0.00';

        if (currency === 'VES' && exchangeRate) {
            const amountVES = amountUSD * exchangeRate;
            return `Bs. ${amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        return `$${amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const value = {
        currency,
        toggleCurrency,
        exchangeRate,
        lastUpdated,
        formatPrice,
        loading
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
