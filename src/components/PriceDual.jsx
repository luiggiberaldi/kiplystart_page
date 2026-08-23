import { useCurrency } from '../context/CurrencyContext';

/**
 * PriceDual 2.0 — High-Contrast Bimonetary Price Display (USD + Bs BCV)
 */
export default function PriceDual({ amount, size = 'md', showRate = false, className = '' }) {
    const { formatUSD, formatBs, exchangeRate, showBs, rateSource } = useCurrency();

    if (!amount && amount !== 0) return null;

    const sizes = {
        sm: {
            usd: 'text-lg sm:text-xl font-black text-gray-950',
            bs: 'text-[10px] sm:text-xs font-extrabold text-slate-700 bg-slate-100/90 border border-slate-200/80 px-1.5 sm:px-2 py-0.5 rounded-lg'
        },
        md: {
            usd: 'text-2xl sm:text-3xl font-black text-gray-950',
            bs: 'text-xs sm:text-sm font-extrabold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl'
        },
        lg: {
            usd: 'text-3xl sm:text-4xl font-black text-gray-950',
            bs: 'text-sm sm:text-base font-extrabold text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl'
        },
    };
    const s = sizes[size] || sizes.md;

    return (
        <div className={`flex items-baseline sm:items-center gap-1.5 sm:gap-2.5 flex-wrap ${className}`}>
            <span className={`${s.usd} tracking-tight tabular-nums`}>
                {formatUSD(amount)}
            </span>
            {showBs && exchangeRate && (
                <div className="inline-flex items-center gap-1.5">
                    <span className={`${s.bs} tabular-nums shadow-2xs`}>
                        {formatBs(amount)}
                    </span>
                    {showRate && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Tasa BCV{rateSource === 'manual' ? ' (manual)' : ''}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
