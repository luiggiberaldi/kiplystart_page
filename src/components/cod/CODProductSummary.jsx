import { useCurrency } from '../../context/CurrencyContext';

/**
 * Product summary card shown at the top of the COD modal
 */
export default function CODProductSummary({ product, quantity, selectedBundle, totalPrice }) {
    const { formatUSD, formatBs, exchangeRate, showBs } = useCurrency();

    return (
        <div className="flex gap-3 mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 p-1 shrink-0">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain rounded" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-brand-blue truncate">{product.name}</p>
                <p className="text-[11px] text-gray-500">
                    Cantidad: {quantity} {selectedBundle > 1 && `(${selectedBundle}x)`}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-bold text-brand-red text-lg">{formatUSD(totalPrice)}</span>
                    {showBs && exchangeRate && (
                        <span className="text-[11px] text-gray-400 font-mono">{formatBs(totalPrice)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
