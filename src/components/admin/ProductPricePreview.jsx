import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
/**
 * ProductPricePreview Component
 * Real-time price calculator preview for admin product form.
 * Supports both 'discount' (% off) and 'quantity' (buy 2 get 3) bundle types.
 */
export default function ProductPricePreview({ basePrice, bundle2Discount, bundle3Discount, bundleType = 'discount' }) {
    const { formatPrice, currency } = useCurrency();
    const price = parseFloat(basePrice) || 0;
    const d2 = parseInt(bundle2Discount) || 10;
    const d3 = parseInt(bundle3Discount) || 20;

    if (price === 0) return null;

    const isQuantity = bundleType === 'quantity';

    // Quantity mode: buy 2 get 1 free → pay for 2, receive 3
    const qtyPrice2 = price * 2;  // pay for 2 get 3
    const price2x = isQuantity ? qtyPrice2 : (price * 2) * (1 - d2 / 100);
    const price3x = isQuantity ? qtyPrice2 : (price * 3) * (1 - d3 / 100);

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-steel-blue uppercase tracking-wide">Vista Previa de Precios</p>
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">1 Unidad:</span>
                    <div className="text-right">
                        <span className="font-bold text-brand-blue block text-lg">${price.toFixed(2)}</span>
                        {currency === 'VES' && <span className="text-xs text-gray-500 font-mono">{formatPrice(price)}</span>}
                    </div>
                </div>

                {isQuantity ? (
                    <>
                        <div className="flex justify-between items-center bg-purple-50 rounded-lg p-2 border border-purple-100">
                            <div>
                                <span className="text-gray-700 font-bold block">Compra 2, Llévate 3 🎁</span>
                                <span className="text-[10px] text-green-600 font-bold">¡1 GRATIS!</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-400 line-through mr-2">${(price * 3).toFixed(2)}</span>
                                <span className="font-bold text-brand-blue text-lg">${qtyPrice2.toFixed(2)}</span>
                                {currency === 'VES' && <div className="text-xs text-gray-500 font-mono">{formatPrice(qtyPrice2)}</div>}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">2 Unidades ({d2}% off):</span>
                            <div className="text-right">
                                <span className="text-xs text-gray-400 line-through mr-2">${(price * 2).toFixed(2)}</span>
                                <span className="font-bold text-brand-blue">${price2x.toFixed(2)}</span>
                                {currency === 'VES' && <div className="text-xs text-gray-500 font-mono">{formatPrice(price2x)}</div>}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">3 Unidades ({d3}% off):</span>
                            <div className="text-right">
                                <span className="text-xs text-gray-400 line-through mr-2">${(price * 3).toFixed(2)}</span>
                                <span className="font-bold text-brand-blue">${price3x.toFixed(2)}</span>
                                {currency === 'VES' && <div className="text-xs text-gray-500 font-mono">{formatPrice(price3x)}</div>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
