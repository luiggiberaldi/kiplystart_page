import { useCurrency } from '../context/CurrencyContext';

/**
 * PriceDual — Shows USD price (large) + Bs equivalent (small)
 * 
 * Usage:
 *   <PriceDual amount={46} />
 *   <PriceDual amount={46} size="sm" />         // compact for cards
 *   <PriceDual amount={46} size="lg" />         // large for product detail
 *   <PriceDual amount={46} showRate />           // shows "tasa BCV" label
 */
export default function PriceDual({ amount, size = 'md', showRate = false, className = '' }) {
    const { formatUSD, formatBs, exchangeRate, showBs, rateSource } = useCurrency();

    if (!amount) return null;

    const sizes = {
        sm: { usd: 'text-lg md:text-xl', bs: 'text-[10px]', rate: 'text-[8px]' },
        md: { usd: 'text-[22px] md:text-[24px]', bs: 'text-[11px]', rate: 'text-[9px]' },
        lg: { usd: 'text-[26px] md:text-[32px]', bs: 'text-xs md:text-sm', rate: 'text-[10px]' },
    };
    const s = sizes[size] || sizes.md;

    return (
        <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
            <span className={`${s.usd} font-bold font-display text-brand-blue`}>
                {formatUSD(amount)}
            </span>
            {showBs && exchangeRate && (
                <span className="flex flex-col">
                    <span className={`${s.bs} text-gray-400 font-medium font-mono`}>
                        {formatBs(amount)}
                    </span>
                    {showRate && (
                        <span className={`${s.rate} text-gray-300`}>
                            tasa BCV{rateSource === 'manual' ? ' (manual)' : ''}
                        </span>
                    )}
                </span>
            )}
        </div>
    );
}
