import { useState } from 'react';

/**
 * PriceCalculator Component
 * @description
 * Real-time price calculator for dropshipping.
 * Formula: ceil(max(cost + $8 shipping + $6 profit, suggested_price))
 */
export default function PriceCalculator() {
    const [cost, setCost] = useState('');
    const [suggested, setSuggested] = useState('');
    const [d2, setD2] = useState(10);
    const [d3, setD3] = useState(20);

    const SHIPPING = 8;
    const PROFIT = 6;
    const COMPARE_MULT = 1.4;

    const costNum = parseFloat(cost) || 0;
    const suggestedNum = parseFloat(suggested) || 0;
    const raw = costNum + SHIPPING + PROFIT;
    const finalPrice = Math.ceil(Math.max(raw, suggestedNum));
    const compareAt = finalPrice > 0 ? (finalPrice * COMPARE_MULT).toFixed(0) + '.90' : '0';
    const margin = costNum > 0 ? finalPrice - costNum : 0;
    const marginPct = costNum > 0 ? ((margin / finalPrice) * 100).toFixed(1) : 0;
    const wasAdjusted = suggestedNum > 0 && suggestedNum > raw;

    const price2 = Math.ceil((finalPrice * 2) * (1 - d2 / 100));
    const price3 = Math.ceil((finalPrice * 3) * (1 - d3 / 100));
    const save2 = (finalPrice * 2) - price2;
    const save3 = (finalPrice * 3) - price3;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-display text-brand-blue">Calculadora de Precios</h2>
                <p className="text-gray-500 text-sm">Calcula precios de venta para dropshipping con DroPanas</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-blue text-[20px]">edit</span>
                        Datos del Producto
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Precio Proveedor (DroPanas)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={cost}
                                onChange={e => setCost(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Precio Sugerido (mínimo)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={suggested}
                                onChange={e => setSuggested(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    {/* Formula breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
                        <div className="flex justify-between text-gray-500">
                            <span>Costo proveedor</span>
                            <span>${costNum.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>+ Envío fijo</span>
                            <span>${SHIPPING.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>+ Ganancia fija</span>
                            <span>${PROFIT.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-700 border-t border-gray-200 pt-2">
                            <span>= Costo crudo</span>
                            <span>${raw.toFixed(2)}</span>
                        </div>
                        {wasAdjusted && (
                            <div className="flex justify-between text-yellow-600 text-xs items-center gap-1">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">info</span>
                                    Ajustado al sugerido
                                </span>
                                <span>${suggestedNum.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* Bundle discounts */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Descuento 2x (%)
                            </label>
                            <input
                                type="number"
                                value={d2}
                                onChange={e => setD2(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Descuento 3x (%)
                            </label>
                            <input
                                type="number"
                                value={d3}
                                onChange={e => setD3(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    {/* Main Price */}
                    <div className="bg-gradient-to-br from-[#0A2463] to-[#1A3A8F] rounded-xl p-6 text-white">
                        <p className="text-xs font-bold text-blue-200/60 uppercase tracking-wider mb-1">Precio de Venta</p>
                        <p className="text-5xl font-bold font-display">${finalPrice}</p>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-blue-200/60">Compare at: <span className="text-blue-200 font-bold">${compareAt}</span></span>
                            {wasAdjusted && (
                                <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 rounded text-xs font-bold">AJUSTADO</span>
                            )}
                        </div>
                    </div>

                    {/* Margin */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Margen de Ganancia</p>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-green-600">${margin.toFixed(2)}</span>
                            <span className="text-sm text-gray-400 pb-1">({marginPct}%)</span>
                        </div>
                        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                                style={{ width: `${Math.min(parseFloat(marginPct) || 0, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Bundles */}
                    {finalPrice > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Precios por Bundle</p>

                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-bold text-brand-blue">1x</span>
                                    <span className="text-sm text-gray-600">1 Unidad</span>
                                </div>
                                <span className="font-bold text-brand-blue text-lg">${finalPrice}</span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-bold text-brand-blue">2x</span>
                                    <span className="text-sm text-gray-600">2 Unidades ({d2}% off)</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 line-through mr-2">${finalPrice * 2}</span>
                                    <span className="font-bold text-brand-blue text-lg">${price2}</span>
                                    <span className="text-xs text-green-500 ml-1">-${save2}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-bold text-brand-blue">3x</span>
                                    <span className="text-sm text-gray-600">3 Unidades ({d3}% off)</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 line-through mr-2">${finalPrice * 3}</span>
                                    <span className="font-bold text-brand-blue text-lg">${price3}</span>
                                    <span className="text-xs text-green-500 ml-1">-${save3}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
