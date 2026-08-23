import { useCurrency } from '../../context/CurrencyContext';
import { Package } from 'lucide-react';

export default function CODProductSummary({ product, quantity, selectedBundle, totalPrice }) {
    const { formatUSD, formatBs, exchangeRate, showBs } = useCurrency();

    return (
        <div className="flex items-center gap-3.5 mb-5 bg-slate-50 p-3.5 rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-950 truncate">{product.name}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Cantidad: <strong className="text-gray-800">{quantity} {selectedBundle > 1 && `(Pack x${selectedBundle})`}</strong>
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-[#0A2463] text-lg tabular-nums">{formatUSD(totalPrice)}</span>
                    {showBs && exchangeRate && (
                        <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg tabular-nums">
                            {formatBs(totalPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
