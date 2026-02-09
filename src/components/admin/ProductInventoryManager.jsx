import React from 'react';

export default function ProductInventoryManager({ stock, lowStockThreshold, allowBackorders, onChange }) {
    return (
        <section>
            <h3 className="font-display font-bold text-lg text-brand-blue mb-4 border-b pb-2">Inventario</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Stock Actual</label>
                    <input
                        type="number"
                        name="stock"
                        value={stock}
                        onChange={onChange}
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Umbral Stock Bajo</label>
                    <input
                        type="number"
                        name="low_stock_threshold"
                        value={lowStockThreshold}
                        onChange={onChange}
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                </div>

                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                        <input
                            type="checkbox"
                            name="allow_backorders"
                            checked={allowBackorders}
                            onChange={onChange}
                            className="w-4 h-4 text-brand-blue rounded focus:ring-2 focus:ring-brand-blue"
                        />
                        <span className="text-sm font-medium text-gray-700">Permitir Backorders</span>
                    </label>
                </div>
            </div>
        </section>
    );
}
