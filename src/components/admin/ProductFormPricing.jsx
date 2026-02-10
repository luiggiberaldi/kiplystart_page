import { useMemo } from 'react';
import ProductPricePreview from './ProductPricePreview';

/**
 * ProductFormPricing - Dropshipping pricing section with auto-calculation
 * Formula: price = ceil(max(dropanas_price + 14, sugerido))
 * Compare at: floor(price * 1.4) + 0.90
 */
export default function ProductFormPricing({ formData, onChange, calculatedPrice, calculatedCompareAt, effectivePrice }) {
    const margin = useMemo(() => {
        const dp = parseFloat(formData.dropanas_price) || 0;
        if (dp === 0 || effectivePrice === 0) return { amount: 0, pct: 0 };
        const amount = effectivePrice - dp;
        const pct = ((amount / effectivePrice) * 100).toFixed(1);
        return { amount, pct };
    }, [formData.dropanas_price, effectivePrice]);

    return (
        <section className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
            <h3 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Precios (Dropshipping)
            </h3>

            {/* DroPanas inputs */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Precio DroPanas ($) *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                        <input type="number" step="0.01" name="dropanas_price"
                            value={formData.dropanas_price} onChange={onChange}
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm font-mono"
                            placeholder="0.00" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Precio Sugerido ($)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                        <input type="number" step="0.01" name="precio_sugerido"
                            value={formData.precio_sugerido} onChange={onChange}
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm font-mono"
                            placeholder="0.00" />
                    </div>
                </div>
            </div>

            {/* Auto-calculated prices */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Auto-Calculado</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" name="price_override" checked={formData.price_override} onChange={onChange}
                            className="w-3.5 h-3.5 text-orange-500 rounded" />
                        <span className="text-[10px] font-bold text-gray-500">Override manual</span>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">PRECIO VENTA</label>
                        <input type="number" step="1" name="price"
                            value={formData.price_override ? formData.price : calculatedPrice || ''}
                            onChange={onChange}
                            readOnly={!formData.price_override}
                            className={`w-full px-3 py-2 rounded-lg text-xl font-bold font-mono transition-colors ${formData.price_override
                                ? 'border-2 border-orange-300 bg-white text-orange-600 focus:ring-2 focus:ring-orange-400 outline-none'
                                : 'bg-white/60 border border-blue-200 text-brand-blue cursor-default'
                                }`} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">COMPARE AT</label>
                        <input type="text" name="compare_at_price"
                            value={formData.price_override ? formData.compare_at_price : calculatedCompareAt}
                            onChange={onChange}
                            readOnly={!formData.price_override}
                            className={`w-full px-3 py-2 rounded-lg text-xl font-bold font-mono transition-colors ${formData.price_override
                                ? 'border-2 border-orange-300 bg-white text-orange-600 focus:ring-2 focus:ring-orange-400 outline-none'
                                : 'bg-white/60 border border-blue-200 text-gray-400 line-through cursor-default'
                                }`} />
                    </div>
                </div>

                {/* Margin indicator */}
                {effectivePrice > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                        <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                                style={{ width: `${Math.min(parseFloat(margin.pct) || 0, 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-green-600 whitespace-nowrap">
                            ${margin.amount} ({margin.pct}%)
                        </span>
                    </div>
                )}

                <p className="text-[10px] text-blue-400 font-mono">
                    ceil(max({parseFloat(formData.dropanas_price) || 0} + 14, {parseFloat(formData.precio_sugerido) || 0})) = ${effectivePrice}
                </p>
            </div>

            {/* Bundle discounts */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Bundle 2x (%)</label>
                    <input type="number" name="bundle_2_discount" value={formData.bundle_2_discount}
                        onChange={onChange} min="0" max="100"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Bundle 3x (%)</label>
                    <input type="number" name="bundle_3_discount" value={formData.bundle_3_discount}
                        onChange={onChange} min="0" max="100"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                </div>
            </div>

            <ProductPricePreview
                basePrice={effectivePrice}
                bundle2Discount={formData.bundle_2_discount}
                bundle3Discount={formData.bundle_3_discount}
            />
        </section>
    );
}
