import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
/**
 * ProductPricePreview Component
 * @description
 * Real-time price calculator preview for admin product form
 */
export default function ProductPricePreview({ basePrice, bundle2Discount, bundle3Discount }) {
    const { formatPrice, currency } = useCurrency();
    const price = parseFloat(basePrice) || 0;
    const d2 = parseInt(bundle2Discount) || 10;
    const d3 = parseInt(bundle3Discount) || 20;

    const price2x = (price * 2) * (1 - d2 / 100);
    const price3x = (price * 3) * (1 - d3 / 100);

    if (price === 0) return null;

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
            </div>
        </div>
    );
}
